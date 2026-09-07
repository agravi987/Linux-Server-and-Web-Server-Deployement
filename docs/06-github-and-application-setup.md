# 06 — 🐙 GitHub and Application Setup

> **Last Updated:** September 7, 2026

---

## 🎯 Goal

Clone your application from GitHub onto the EC2 server.

## ✅ Prerequisites

```text
[ ] 📦 All software installed (from 05-linux-server-setup.md)
[ ] 🐙 Application code is pushed to a GitHub repository
[ ] 🔐 You are logged into the server via SSH
```

## 🔄 The Flow

```
💻 Local Computer
      ↓  🐙 git push
   🌐 GitHub
      ↓  🐙 git clone
     ☁️ EC2
      ↓
   📦 Application
```

---

## 📝 Step 1 — Navigate to the Home Directory

```bash
cd ~
pwd
```

Expected result:

```text
/home/ubuntu
```

---

## 📝 Step 2 — Clone Your Repository

Replace with your actual repository URL:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

If your repository is **private**, you have two options:

**🔑 Option A — Use a personal access token:**

```bash
git clone https://YOUR_USERNAME:YOUR_TOKEN@github.com/YOUR_USERNAME/YOUR_REPO.git
```

> 💡 Generate a token at GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens.

**🔐 Option B — Use SSH key (recommended):**

```bash
# 🔑 Generate SSH key on the server
ssh-keygen -t ed25519 -C "your-email@example.com"

# 👁️ Display the public key
cat ~/.ssh/id_ed25519.pub
```

Copy the output and add it to GitHub → Settings → SSH and GPG keys → New SSH key.

Then clone using SSH:

```bash
git clone git@github.com:YOUR_USERNAME/YOUR_REPO.git
```

---

## 📝 Step 3 — Verify the Clone

```bash
ls ~/YOUR_REPO/
```

Expected result:

```
📁 backend/
📁 frontend/
📄 .gitignore
📄 .env.example
📄 README.md
```

---

## 📝 Step 4 — Check Project Structure

### ⚡ Backend

```bash
ls ~/YOUR_REPO/backend/
```

Expected:

```
📄 package.json
📁 src/
...
```

### 🎨 Frontend

```bash
ls ~/YOUR_REPO/frontend/
```

Expected:

```
📄 package.json
📁 src/
📁 public/
...
```

---

## 📝 Step 5 — Set Up Environment Variables

### 5.1 📋 Copy the example file

```bash
cp ~/YOUR_REPO/backend/.env.example ~/YOUR_REPO/backend/.env
```

### 5.2 ✏️ Edit the .env file

```bash
nano ~/YOUR_REPO/backend/.env
```

> 💡 `nano` is a simple text editor. Use arrow keys to navigate, `Ctrl+O` to save, `Ctrl+X` to exit.

Fill in the actual values. Example:

```env
PORT=3000
NODE_ENV=production
DATABASE_URL=postgresql://myapp_user:YOUR_DB_PASSWORD@localhost:5432/myapp_db
JWT_SECRET=YOUR_JWT_SECRET
```

> ⚠️ **IMPORTANT:** Replace `YOUR_DB_PASSWORD` and `YOUR_JWT_SECRET` with real values you create. Never use the same password for multiple services.

### 5.3 ✅ Verify .env is not tracked by Git

```bash
cd ~/YOUR_REPO
git status
```

The `.env` file should NOT appear in the output. If it does:

```bash
echo ".env" >> .gitignore
git rm --cached backend/.env
```

---

## 📝 Step 6 — Verify Git Configuration

```bash
cd ~/YOUR_REPO
git remote -v
```

Expected:

```text
🐙 origin  https://github.com/YOUR_USERNAME/YOUR_REPO.git (fetch)
🐙 origin  https://github.com/YOUR_USERNAME/YOUR_REPO.git (push)
```

---

## ✅ Checkpoint

At this point:

```text
[✓] 🐙 Repository cloned to server
[✓] 📁 Project structure is correct
[✓] 🔐 .env file created with actual values
[✓] 🙈 .env is not tracked by Git
```

> 📸 **Screenshot:** Capture the terminal showing the cloned repository structure with `ls -la ~/YOUR_REPO/`.

> 🎉 If all checks pass, continue to: [⚡ Node.js Backend Deployment](07-nodejs-backend-deployment.md).

---

## 🔧 Troubleshooting

### ❓ "Permission denied" when cloning a private repo

🔑 Use a personal access token or set up SSH keys as described in Step 2.

### ❓ "Repository not found"

Check:

1. ✅ The URL is correct
2. ✅ The repository is public, or you have access (for private repos)
3. ✅ Your token has the `repo` scope (for private repos)

### ❓ "I made a mistake with .env values"

Simply edit the file again:

```bash
nano ~/YOUR_REPO/backend/.env
```

Or delete and recreate:

```bash
rm ~/YOUR_REPO/backend/.env
cp ~/YOUR_REPO/backend/.env.example ~/YOUR_REPO/backend/.env
nano ~/YOUR_REPO/backend/.env
```

### ❓ "nano editor is confusing"

Alternative editors:

```bash
# 📝 Use vim (if you know it)
vim ~/YOUR_REPO/backend/.env

# 💻 Or just echo individual values
echo "PORT=3000" > ~/YOUR_REPO/backend/.env
echo "DATABASE_URL=postgresql://myapp_user:YOUR_DB@localhost:5432/myapp_db" >> ~/YOUR_REPO/backend/.env
```

---

## 🎉 Done

Your application code is on the server with environment variables configured. Next, you will install dependencies and deploy the backend. ⚡
