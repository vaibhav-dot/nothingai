(function () {
  var screen = document.getElementById('phoneScreen');
  if (!screen) return;

  var frames = screen.querySelectorAll('.frame');
  var tapToWake = document.getElementById('tapToWake');

  var flow = ['lock', 'morning', 'commute', 'tasks', 'agent-work', 'agent-travel', 'workflow', 'help'];

  var sliding = false;

  function getActiveFrame() {
    for (var i = 0; i < frames.length; i++) {
      if (frames[i].classList.contains('active')) return frames[i];
    }
    return null;
  }

  function showFrame(id) {
    screen.classList.remove('swipe-in-progress');
    frames.forEach(function (f) {
      f.classList.remove('sliding-out', 'sliding-in');
      f.style.removeProperty('--slide-out');
      f.style.removeProperty('--slide-start');
      f.style.removeProperty('transform');
      f.style.removeProperty('opacity');
      f.style.removeProperty('transition');
      f.classList.toggle('active', f.dataset.frame === id);
    });
    sliding = false;
  }

  function slideToFrame(targetId, forward) {
    if (sliding) return;
    var active = getActiveFrame();
    if (!active) return;
    var targetFrame = document.getElementById('frame-' + targetId);
    if (!targetFrame) return;

    sliding = true;

    var startPos = forward ? '100%' : '-100%';
    targetFrame.style.transform = 'translateX(' + startPos + ')';
    targetFrame.style.opacity = '1';
    targetFrame.style.transition = 'none';

    screen.classList.add('swipe-in-progress');
    active.classList.add('sliding-out');
    active.style.setProperty('--slide-out', forward ? '-100%' : '100%');
    targetFrame.style.setProperty('--slide-start', startPos);
    targetFrame.classList.add('active');

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        targetFrame.style.transform = '';
        targetFrame.style.opacity = '';
        targetFrame.style.transition = '';
        targetFrame.classList.add('sliding-in');
      });
    });

    setTimeout(function () { showFrame(targetId); }, 820);
  }

  // Click on vertical edges of phone screen to navigate
  screen.addEventListener('click', function (e) {
    if (sliding) return;
    var rect = screen.getBoundingClientRect();
    var clickX = e.clientX - rect.left;

    var clicked = e.target;
    if (clicked.closest('button') || clicked.closest('a') || clicked.closest('[data-goto]') ||
        clicked.closest('.f2-navbar') || clicked.closest('.bottom-nav')) return;

    var active = getActiveFrame();
    if (!active) return;
    var activeId = active.dataset.frame;
    var idx = flow.indexOf(activeId);
    if (idx === -1) return;

    if (clickX > rect.width * 0.75 && idx < flow.length - 1) {
      slideToFrame(flow[idx + 1], true);
    } else if (clickX < rect.width * 0.25 && idx > 0) {
      slideToFrame(flow[idx - 1], false);
    }
  });

  // Tap to wake
  if (tapToWake) {
    tapToWake.addEventListener('click', function () {
      slideToFrame('morning', true);
    });
  }

  // Swipe left/right on agent-work & agent-travel frames to switch between them
  var agentFrames = ['frame-agent-work', 'frame-agent-travel'];
  agentFrames.forEach(function (frameId) {
    var el = document.getElementById(frameId);
    if (!el) return;

    var sx = 0, sy = 0;

    function onStart(e) {
      var t = e.touches ? e.touches[0] : e;
      sx = t.clientX; sy = t.clientY;
      var endEvt = e.touches ? 'touchend' : 'mouseup';
      document.addEventListener(endEvt, onEnd, { once: true });
    }

    function onEnd(e) {
      var t = e.changedTouches ? e.changedTouches[0] : e;
      var dx = t.clientX - sx;
      var dy = t.clientY - sy;
      if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return;
      if (dx < 0 && frameId === 'frame-agent-work') {
        slideToFrame('agent-travel', true);
      } else if (dx > 0 && frameId === 'frame-agent-travel') {
        slideToFrame('agent-work', false);
      }
    }

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('mousedown', function (e) {
      if (e.button === 0) onStart(e);
    });
  });

  // Cards with data-goto
  screen.querySelectorAll('[data-goto]').forEach(function (el) {
    el.addEventListener('click', function () {
      var target = el.getAttribute('data-goto');
      if (target) slideToFrame(target, true);
    });
  });

  // Bottom nav
  screen.querySelectorAll('.bottom-nav [data-frame], .f2-navbar [data-frame]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.getAttribute('data-frame');
      if (target) {
        var active = getActiveFrame();
        if (!active) return;
        var curIdx = flow.indexOf(active.dataset.frame);
        var tgtIdx = flow.indexOf(target);
        slideToFrame(target, tgtIdx > curIdx);
      }
    });
  });

  showFrame('lock');
})();
