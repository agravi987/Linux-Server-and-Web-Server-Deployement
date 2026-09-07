# 02 — 🏗️ Project Setup

> **Last Updated:** September 7, 2026

---

## 🎯 Goal

Understand what we are building and prepare everything before touching the server.

## ✅ Prerequisites

```text
[ ] ☁️ AWS account with billing enabled
[ ] 💻 Local computer (Windows, Mac, or Linux)
[ ] ⌨️ Terminal / command line access
[ ] 🐙 Application code pushed to a GitHub repository
```

---

## 📦 What We Are Building

```
🎨 React Frontend       →  Built into static files
       ↓
🔷 Nginx                →  Serves static files + proxies API
       ↓
⚡ Node.js / Express    →  Backend API server
       ↓
🐘 PostgreSQL           →  Database
```

**🖥️ Infrastructure:**

```
☁️ AWS EC2 (Ubuntu Linux)
  ├── 🔷 Nginx        →  :443 (HTTPS) / :80 (HTTP)
  ├── ⚡ Node.js      →  :3000 (internal only)
  └── 🐘 PostgreSQL   →  :5432 (internal only)
```

---

## 🔄 Request Flow

```
👤 User types yourdomain.com
  ↓
🌍 DNS resolves to EC2 public IP
  ↓
🌐 Browser connects on port 443 (HTTPS)
  ↓
🛡️ AWS Security Group allows traffic on 80/443
  ↓
🔥 Linux firewall (UFW) allows 80/443
  ↓
🔷 Nginx receives the request
  ├── 📄 Static file? → Serves from /var/www/myapp/
  └── 🔌 /api/*?      → Forwards to Node.js on port 3000
  ↓
⚡ Node.js processes API request
  ↓
🐘 Node.js queries PostgreSQL on port 5432
  ↓
📤 Response flows back to the user
```

---

## 📝 Step 1 — Verify Your GitHub Repository

Make sure your code is pushed to GitHub.

Command (run on your local computer):

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

Replace `YOUR_USERNAME` and `YOUR_REPO` with your actual values.

Verify:

```bash
ls -la
```

Expected result:

```
📁 .git
📁 backend
📁 frontend
📄 .gitignore
📄 .env.example
📄 README.md
```

---

## 📝 Step 2 — Verify Your Project Structure

Check that you have both frontend and backend:

Command (on your local computer):

```bash
ls frontend/
```

Expected result:

```
📄 package.json
📁 src/
📁 public/
📄 index.html
...
```

Command:

```bash
ls backend/
```

Expected result:

```
📄 package.json
📁 src/
...
```

---

## 📝 Step 3 — Identify Your Package Manager

Check which package manager your project uses:

```bash
# Check if yarn.lock exists
ls yarn.lock 2>/dev/null && echo "🟢 Uses Yarn"

# Check if package-lock.json exists
ls package-lock.json 2>/dev/null && echo "🟢 Uses npm"

# Check if pnpm-lock.yaml exists
ls pnpm-lock.yaml 2>/dev/null && echo "🟢 Uses pnpm"
```

**📝 Note down which one:** `npm`, `yarn`, or `pnpm`. You will need this later.

> 💡 All examples in this guide use `npm`. If you use a different package manager, replace `npm` with your choice.

---

## 📝 Step 4 — Identify Your Start Commands

Check your `package.json` files:

Command:

```bash
cat backend/package.json | grep -A 5 '"scripts"'
```

Expected result (example):

```json
"scripts": {
  "start": "node src/index.js",
  "dev": "nodemon src/index.js",
  "build": "echo 'no build'"
}
```

Command:

```bash
cat frontend/package.json | grep -A 5 '"scripts"'
```

Expected result (example):

```json
"scripts": {
  "start": "react-scripts start",
  "dev": "react-scripts start",
  "build": "react-scripts build",
  "preview": "vite preview"
}
```

**📝 Note down:**

```text
⚡ Backend production command:  npm start
🎨 Frontend build command:      npm run build
```

---

## 📝 Step 5 — Check Your .env.example

Look at what environment variables your app needs:

Command:

```bash
cat .env.example
```

You will need to configure these on the server later.

---

## ✅ Checkpoint

At this point you should know:

```text
[✓] 🐙 Your GitHub repository URL
[✓] 📦 Your package manager (npm/yarn/pnpm)
[✓] ⚡ Your backend start command
[✓] 🎨 Your frontend build command
[✓] 🔐 Required environment variables
```

> 📸 **Screenshot:** Capture your terminal showing `ls -la` output of your project root.

> 🎉 If all checks pass, continue to the next section: [☁️ AWS EC2 Setup](03-aws-ec2-setup.md).

---

## 🔧 Troubleshooting

### ❓ "I don't have a GitHub repository yet"

Create one:

```bash
# On your local computer
mkdir myapp && cd myapp
git init
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

### ❓ "I don't know my package manager"

Run this in your project root:

```bash
ls *.lock 2>/dev/null
```

| File | Package Manager |
|------|----------------|
| 📦 `package-lock.json` | npm |
| 🧶 `yarn.lock` | Yarn |
| 📦 `pnpm-lock.yaml` | pnpm |

### ❓ "My project doesn't have separate frontend/backend folders"

That's fine. Adapt the paths in later guides to match your actual project structure.

---

## 🎉 Done

You now understand the project architecture and have identified all the commands you will need. Time to create the server! 🚀
