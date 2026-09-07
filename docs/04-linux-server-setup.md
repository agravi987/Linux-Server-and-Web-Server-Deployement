# 04 — 🐧 Linux Server Setup

> **Last Updated:** September 7, 2026

---

## 🎯 Goal

Install and configure all the software our application needs on the server.

## ✅ Prerequisites

```text
[ ] 🔐 SSH connection works (from 03-ssh-connection.md)
[ ] 👤 You are logged into the server as ubuntu
```

## 📦 What We Will Install

```
🐙 Git          →  Download code from GitHub
⚡ Node.js      →  Run the backend application
📦 npm          →  Install Node.js dependencies
🐘 PostgreSQL   →  Database
🔷 Nginx        →  Web server and reverse proxy
```

---

## 📝 Step 1 — Update Package Information

```bash
sudo apt update
```

**💡 Why:** Updates the local package index so `apt` knows about the latest versions of available software.

Verify:

```bash
sudo apt list --upgradable
```

Expected result:

```text
Listing... Done
<list of upgradable packages or "All packages are up to date">
```

---

## 📝 Step 2 — Upgrade Installed Packages

```bash
sudo apt upgrade -y
```

**💡 Why:** Installs the latest versions of all currently installed packages. The `-y` flag auto-confirms.

⏳ This may take a few minutes. Wait for it to complete.

---

## 📝 Step 3 — Install Git

```bash
sudo apt install git -y
```

Verify:

```bash
git --version
```

Expected result:

```text
🐙 git version 2.x.x
```

---

## 📝 Step 4 — Install Node.js

We will use NodeSource to install a specific LTS version.

### 4.1 📥 Add NodeSource repository

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
```

> 💡 Node.js 20.x is the current LTS (Long Term Support) version.

### 4.2 📦 Install Node.js

```bash
sudo apt install nodejs -y
```

### 4.3 ✅ Verify

```bash
node --version
```

Expected result:

```text
⚡ v20.x.x
```

```bash
npm --version
```

Expected result:

```text
📦 10.x.x
```

---

## 📝 Step 5 — Install PostgreSQL

```bash
sudo apt install postgresql postgresql-contrib -y
```

Verify:

```bash
systemctl status postgresql
```

Expected result:

```text
🐘 postgresql.service - PostgreSQL Cluster 16
     Loaded: loaded
     Active: active (running)
```

> 💡 If it shows `active (running)`, PostgreSQL is installed and running.

### 🐘 Check PostgreSQL is listening on port 5432

```bash
ss -lntp | grep 5432
```

Expected result:

```text
LISTEN  0  128  127.0.0.1:5432  0.0.0.0:*  users:(("postgres",pid=...,fd=...))
```

> 💡 Note: It listens on `127.0.0.1` (localhost) only — not on the public internet. This is correct.

---

## 📝 Step 6 — Install Nginx

```bash
sudo apt install nginx -y
```

Verify:

```bash
systemctl status nginx
```

Expected result:

```text
🔷 nginx.service - A high performance web server
     Loaded: loaded
     Active: active (running)
```

### 🔷 Test Nginx is serving the default page

From your local computer (open a new terminal, not the SSH session):

```bash
curl http://YOUR_EC2_PUBLIC_IP
```

Expected result:

```html
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
...
```

> 💡 If you see the Nginx welcome page, Nginx is working correctly.

---

## 📝 Step 7 — Create Application Directories

We will organize the application files on the server.

### 7.1 📁 Create the web root for the React frontend

```bash
sudo mkdir -p /var/www/myapp
```

### 7.2 👤 Set ownership to the ubuntu user

```bash
sudo chown -R ubuntu:ubuntu /var/www/myapp
```

Verify:

```bash
ls -la /var/www/
```

Expected result:

```text
📁 myapp
```

---

## 📝 Step 8 — Install PM2 (Optional but Recommended)

PM2 helps manage the Node.js process. It keeps the app running if it crashes.

```bash
sudo npm install -g pm2
```

Verify:

```bash
pm2 --version
```

Expected result:

```text
🔄 5.x.x
```

> 💡 We will use PM2 in the systemd guide (13) or directly. If you prefer pure systemd, PM2 is optional.

---

## ✅ Checkpoint

At this point:

```text
[✓] 📦 System packages are updated
[✓] 🐙 Git is installed
[✓] ⚡ Node.js 20.x and npm are installed
[✓] 🐘 PostgreSQL 16 is installed and running
[✓] 🔷 Nginx is installed and running
[✓] 📁 /var/www/myapp directory is created
[✓] 🔄 PM2 is installed (optional)
```

> 🎉 If all checks pass, continue to: [🐙 GitHub and Application Setup](05-github-and-application-setup.md).

---

## 📖 Useful Linux Commands Reference

These commands will help throughout the project:

```bash
pwd                 # 📁 Print current directory
ls                  # 📋 List files
cd /path            # 🧭 Change directory
mkdir -p /path      # 📁 Create directory (with parents)
cp file dest        # 📄 Copy a file
mv file dest        # 📦 Move/rename a file
rm file             # 🗑️ Remove a file
cat file            # 👁️ Display file contents
less file           # 📖 View file (scrollable, press q to quit)
grep "text" file    # 🔍 Search for text in a file
find / -name "file" # 🔎 Search for a file
tail file           # 📊 Show last 10 lines
tail -f file        # 📡 Follow file in real-time
ps aux              # 📋 List running processes
top                 # 📊 Live process monitor (press q to quit)
df -h               # 💾 Disk space usage
du -sh /path        # 📏 Size of a directory
free -h             # 🧠 Memory usage
ss -lntp            # 🔌 Listening network ports
curl URL            # 🌐 Make HTTP requests from the terminal
```

---

## 🔧 Troubleshooting

### ❓ "Nginx won't start"

Check if port 80 is already in use:

```bash
sudo ss -lntp | grep :80
```

If another process is using port 80, stop it:

```bash
sudo fuser -k 80/tcp
```

Then try again:

```bash
sudo systemctl restart nginx
```

### ❓ "PostgreSQL status shows inactive"

Start it:

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### ❓ "npm: command not found"

Node.js might not be installed correctly. Try reinstalling:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y
```

---

## 🎉 Done

All required software is installed on the server. Next, you will get your application code onto the server. 🐙
