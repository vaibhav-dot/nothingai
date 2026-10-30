#!/bin/bash
# Creates nothing-ai-deploy.zip for Cloudflare Pages upload (Dashboard drag-and-drop).
# Run from project root: ./zip-for-deploy.sh

set -e
cd "$(dirname "$0")"
ZIP="nothing-ai-deploy.zip"
rm -f "$ZIP"
zip -r "$ZIP" \
  index.html styles.css app.js \
  "Ndot-57.otf" "NType82 Headline.otf" "NType82 Regular.otf" \
  assets \
  -x "*.DS_Store" -x "assets/.DS_Store"
echo "Created $ZIP — upload this at Cloudflare Workers & Pages → your project → Create deployment → drag and drop"
open . 2>/dev/null || true
