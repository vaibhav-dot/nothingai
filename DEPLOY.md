# Deploy Nothing AI prototype to Cloudflare Pages

**Live link:** [https://18094c52.nothing-ai.pages.dev/](https://18094c52.nothing-ai.pages.dev/)

You may also get a link like **`https://nothing-ai.pages.dev`** (or your project name). Same link after every update.

---

## Option A: Quick deploy (dashboard, ~2 min)

1. **Create a zip of the site** (only what the browser needs):
   - Include: `index.html`, `styles.css`, `app.js`, `Ndot-57.otf`, `NType82 Headline.otf`, `NType82 Regular.otf`, and the whole `assets` folder.
   - Exclude: `frames/`, `DEPLOY.md`, `.gitignore`, `.DS_Store`.

   On Mac, from the project folder:
   ```bash
   zip -r nothing-ai-deploy.zip index.html styles.css app.js "Ndot-57.otf" "NType82 Headline.otf" "NType82 Regular.otf" assets -x "*.DS_Store"
   ```

2. **In Cloudflare (logged in):**
   - Go to [Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages)
   - **Create application** → **Pages** → **Upload assets** (or “Get started” → “Drag and drop your files”)
   - Project name: e.g. `nothing-ai` → **Create project**
   - Drag and drop `nothing-ai-deploy.zip` (or the folder with the files above)
   - **Deploy site**

3. **Your link:** `https://nothing-ai.pages.dev` (or the URL shown).

**To update later:** Change your files locally, create a new zip the same way, then in the same project go to **Deployments** → **Create deployment** and upload the new zip.

---

## Option B: Deploy from terminal (Wrangler)

Good if you want to update by running one command.

1. **Install and log in** (one-time):
   ```bash
   npm install -g wrangler
   wrangler login
   ```
   (Opens browser to log in with your Cloudflare account.)

2. **Create the project** (one-time):
   ```bash
   cd "/Users/vaibhav/Desktop/Nothing AI"
   npx wrangler pages project create nothing-ai
   ```
   Use the project name you want; the URL will be `https://nothing-ai.pages.dev`.

3. **Deploy** (and for every future update):
   ```bash
   cd "/Users/vaibhav/Desktop/Nothing AI"
   npx wrangler pages deploy . --project-name=nothing-ai
   ```
   This uploads the current folder. To avoid uploading `frames/` and other extras, you can deploy a subfolder (see below).

**To update:** Edit your files, then run the same `npx wrangler pages deploy . --project-name=nothing-ai` again.

---

## Option C: Git + GitHub (auto-deploy on every push)

Best if you want to “make changes and have the link update automatically.”

1. **Create a GitHub repo** (e.g. `nothing-ai-prototype`) and push this project:
   ```bash
   cd "/Users/vaibhav/Desktop/Nothing AI"
   git init
   git add index.html styles.css app.js "Ndot-57.otf" "NType82 Headline.otf" "NType82 Regular.otf" assets .gitignore
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/nothing-ai-prototype.git
   git push -u origin main
   ```

2. **Connect to Cloudflare Pages:**
   - [Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages) → **Create** → **Pages** → **Connect to Git**
   - Choose the repo (e.g. `nothing-ai-prototype`)
   - Project name: `nothing-ai`
   - **Build settings:**  
     - Framework preset: **None**  
     - Build command: *(leave empty)*  
     - Build output directory: **`/`** (root)
   - **Save and Deploy**

3. **Your link:** `https://nothing-ai.pages.dev` (or the one shown). Every push to `main` will redeploy automatically.

**To update:** Edit locally, then:
   ```bash
   git add -A
   git commit -m "Update prototype"
   git push
   ```
   The site at the same link will update in about a minute.

---

## Deploying only the web files (optional)

If you use Wrangler and want to exclude `frames/` and docs:

1. Create a deploy folder and copy only what’s needed:
   ```bash
   mkdir -p deploy
   cp index.html styles.css app.js "Ndot-57.otf" "NType82 Headline.otf" "NType82 Regular.otf" deploy/
   cp -R assets deploy/
   ```
2. Deploy that folder:
   ```bash
   npx wrangler pages deploy deploy --project-name=nothing-ai
   ```

Use the same flow after making changes (copy again, then deploy).
