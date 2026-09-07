# 08 — 🎨 React Frontend Deployment

> **Last Updated:** September 7, 2026

---

## 🎯 Goal

Build the React application into static files and serve them with Nginx.

## ✅ Prerequisites

```text
[ ] 🔷 Nginx installed (from 04-linux-server-setup.md)
[ ] 🐙 Code on server (from 05-github-and-application-setup.md)
```

## 💡 How React Works in Production

```
🎨 React source code (JSX, components)
        ↓
    📦 npm run build
        ↓
    📁 dist/ or build/ folder
        ↓
    📄 Static HTML, CSS, JS files
        ↓
    🔷 Nginx serves these files
```

> 💡 React is a frontend framework. In production, it compiles into plain HTML, CSS, and JavaScript files that any web server can serve.

---

## 📝 Step 1 — Navigate to the Frontend Directory

```bash
cd ~/YOUR_REPO/frontend
pwd
```

Expected:

```text
/home/ubuntu/YOUR_REPO/frontend
```

---

## 📝 Step 2 — Install Dependencies

```bash
npm install
```

⏳ Wait for it to complete.

---

## 📝 Step 3 — Configure the API URL

Your React app needs to know the backend API URL. Create or edit the `.env` file in the frontend:

```bash
nano ~/YOUR_REPO/frontend/.env
```

Add:

```env
VITE_API_URL=https://YOUR_DOMAIN/api
```

or for Create React App:

```env
REACT_APP_API_URL=https://YOUR_DOMAIN/api
```

> 💡 If using the EC2 public IP (no domain yet), use:
> `VITE_API_URL=http://YOUR_EC2_PUBLIC_IP/api`

---

## 📝 Step 4 — Build for Production

```bash
npm run build
```

**💡 Why:** Compiles React into optimized static files (minified, bundled, ready for production).

⏳ This may take a minute or two. Wait for it to complete.

Verify:

```bash
ls dist/
```

or

```bash
ls build/
```

Expected result:

```
📄 index.html
📁 assets/
🖼️ favicon.ico
...
```

> 💡 The folder name depends on your build tool: `dist/` for Vite, `build/` for Create React App.

---

## 📝 Step 5 — Copy Build Files to Nginx Web Root

```bash
sudo cp -r dist/* /var/www/myapp/
```

or for Create React App:

```bash
sudo cp -r build/* /var/www/myapp/
```

---

## 📝 Step 6 — Set Correct Permissions

```bash
sudo chown -R www-data:www-data /var/www/myapp
```

**💡 Why:** Nginx runs as the `www-data` user. It needs read access to the files.

---

## 📝 Step 7 — Verify Files Are Served

Test Nginx is serving the files:

```bash
curl -I http://localhost
```

Expected result:

```text
HTTP/1.1 200 OK
Server: nginx/1.x.x
Content-Type: text/html
...
```

Test from your local computer (open a new terminal):

```bash
curl -I http://YOUR_EC2_PUBLIC_IP
```

Expected: `HTTP/1.1 200 OK` ✅

> 💡 You should see the Nginx welcome page for now. We will configure Nginx to serve React files in the Nginx guide (09).

---

## ✅ Checkpoint

At this point:

```text
[✓] 📦 Frontend dependencies installed
[✓] 🔐 API URL configured in frontend .env
[✓] 🏗️ Production build completed
[✓] 📁 Static files copied to /var/www/myapp/
[✓] 🔐 Files have correct permissions
```

> 🎉 If all checks pass, continue to: [🔷 Nginx Configuration](09-nginx-configuration.md).

---

## 🔧 Troubleshooting

### ❓ "npm run build fails"

Check for TypeScript errors or missing dependencies:

```bash
npm run build 2>&1 | head -50
```

Common fix:

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### ❓ "dist/ or build/ directory is empty"

The build may have failed silently. Check for errors in the output.

### ❓ "Permission denied when copying files"

Use `sudo`:

```bash
sudo cp -r dist/* /var/www/myapp/
sudo chown -R www-data:www-data /var/www/myapp
```

### ❓ "The page shows the wrong content"

Make sure you copied the correct build output:

```bash
ls /var/www/myapp/
```

Should show `index.html` and other static files, not the Nginx default page.

---

## 🎉 Done

The React frontend is built and the static files are in place. Next, you will configure Nginx to serve them properly and proxy API requests to Node.js. 🔷
