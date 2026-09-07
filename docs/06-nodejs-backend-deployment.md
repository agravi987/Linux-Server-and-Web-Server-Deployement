# 06 — ⚡ Node.js Backend Deployment

> **Last Updated:** September 7, 2026

---

## 🎯 Goal

Install dependencies, configure, and verify the Node.js backend API on the server.

## ✅ Prerequisites

```text
[ ] 🐙 Code cloned to server (from 05-github-and-application-setup.md)
[ ] 🔐 .env file configured
[ ] ⚡ Node.js installed on server
```

## 🔄 The Flow

```
📦 Clone
  ↓
📥 Install dependencies
  ↓
✏️ Configure .env
  ↓
🧪 Test application
  ↓
🚀 Run application
```

---

## 📝 Step 1 — Navigate to the Backend Directory

```bash
cd ~/YOUR_REPO/backend
pwd
```

Expected:

```text
/home/ubuntu/YOUR_REPO/backend
```

---

## 📝 Step 2 — Install Dependencies

```bash
npm install
```

**💡 Why:** Installs all packages defined in `package.json` into the `node_modules/` directory.

⏳ This may take a few minutes. Wait for it to complete.

Verify:

```bash
ls node_modules/
```

Expected: A large list of package directories. 📦

---

## 📝 Step 3 — Check the Start Script

```bash
cat package.json | grep -A 3 '"scripts"'
```

Note the production start command. Common options:

```text
"start": "node src/index.js"     →  ⚡ npm start
"start": "node server.js"        →  ⚡ npm start
"start": "node app.js"           →  ⚡ npm start
```

---

## 📝 Step 4 — Run the Backend Directly

### 4.1 🚀 Start the server

```bash
npm start &
```

> 💡 The `&` runs it in the background so you can keep using the terminal.

If your start command is different (e.g., `node src/server.js`), use that instead:

```bash
node src/server.js &
```

### 4.2 ✅ Verify it is running

```bash
ss -lntp | grep 3000
```

Expected result:

```text
⚡ LISTEN  0  128  0.0.0.0:3000  0.0.0.0:*  users:(("node",pid=...,fd=...))
```

### 4.3 🧪 Test the API directly

```bash
curl http://localhost:3000
```

> 💡 We test on `localhost` because Node.js should work directly on the server before putting Nginx in front of it.

Expected result (depends on your API):

```json
{"status":"ok"}
```

or

```json
{"message":"Hello World"}
```

or an error page — that's fine as long as you get a response.

> 📸 **Screenshot:** Capture the terminal showing `curl http://localhost:3000` response and `ss -lntp | grep 3000` showing Node.js listening.

### 4.4 🧪 Test a specific endpoint

If you have API routes:

```bash
curl http://localhost:3000/api/health
```

or

```bash
curl http://localhost:3000/api
```

### 4.5 📊 Check logs in the terminal

If you see errors, read them carefully. Common issues:

- 🔐 Missing environment variables
- 🐘 Database connection refused (we will set that up next)
- 🔌 Port already in use

---

## 📝 Step 5 — Stop the Background Process

```bash
# 🔍 Find the process ID
ps aux | grep node
```

Expected:

```text
ubuntu    XXXXX  ... node src/index.js
```

```bash
# 🛑 Kill it (replace XXXXX with the actual PID)
kill XXXXX
```

Verify it stopped:

```bash
ss -lntp | grep 3000
```

Should return nothing. ✅

---

## ✅ Checkpoint

At this point:

```text
[✓] 📦 npm install completed successfully
[✓] ⚡ Node.js app started on port 3000
[✓] 🧪 curl http://localhost:3000 returns a response
[✓] 🛑 App was stopped (we will restart it later with systemd)
```

> 📸 **Screenshot:** Capture the terminal showing `ss -lntp | grep 3000` output.

> 🎉 If all checks pass, continue to: [🐘 PostgreSQL Setup](07-postgresql-setup.md).

---

## 🔧 Troubleshooting

### ❓ "npm install fails"

Check Node.js version:

```bash
node --version
```

Must be 18.x or 20.x. If not:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y
```

### ❓ "Cannot find module"

The install may have failed silently. Try:

```bash
rm -rf node_modules package-lock.json
npm install
```

### ❓ "EADDRINUSE: port 3000 already in use"

Another process is using port 3000. Kill it:

```bash
sudo fuser -k 3000/tcp
```

### ❓ "Error: Cannot find environment variable"

Check your `.env` file:

```bash
cat ~/YOUR_REPO/backend/.env
```

Make sure all required variables are present.

### ❓ "Database connection refused"

This is expected if PostgreSQL is not configured yet. Continue to the next guide (07 — 🐘 PostgreSQL Setup).

---

## 🎉 Done

The backend starts and responds on port 3000. Next, you will set up the PostgreSQL database. 🐘
