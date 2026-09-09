# 14 — 🔄 systemd Application Service

> **Last Updated:** September 7, 2026

---

## 🎯 Goal

Make the Node.js application start automatically on boot and restart if it crashes.

## ✅ Prerequisites

```text
[ ] ⚡ Node.js backend runs correctly (from 07-nodejs-backend-deployment.md)
[ ] 🔥 Firewall configured (from 13-firewall-and-security.md)
```

## 💡 What is systemd?

systemd is Ubuntu's init system. It manages services (daemons) — processes that run in the background. We will tell systemd to manage our Node.js application as a service.

---

## 📝 Step 1 — Create the Service File

```bash
sudo nano /etc/systemd/system/myapp.service
```

---

## 📝 Step 2 — Add the Service Configuration

Paste the following:

```ini
[Unit]
Description=MyApp Node.js API Server
After=network.target postgresql.service

[Service]
Type=simple
User=ubuntu
Group=ubuntu
WorkingDirectory=/home/ubuntu/simple-basic-application/backend
ExecStart=/usr/bin/node src/index.js
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

### 💡 What each section means:

```text
[Unit]
Description      →  📝 Human-readable name
After            →  🔗 Start after network and PostgreSQL are ready

[Service]
Type             →  ⚙️ simple = the command IS the process
User             →  👤 Run as the ubuntu user (not root)
WorkingDirectory →  📁 The directory to run from (where package.json is)
ExecStart        →  🚀 The command to start the app
Restart          →  🔄 Restart automatically on failure
RestartSec       →  ⏱️ Wait 5 seconds before restarting
StandardOutput   →  📊 Send logs to journal
Environment      →  🔐 Set environment variables

[Install]
WantedBy         →  🔄 Start this service when the system reaches multi-user mode (normal operation)
```

---

## 📝 Step 3 — Verify ExecStart Path

Check that `src/index.js` exists in your backend:

```bash
ls ~/simple-basic-application/backend/src/index.js
```

If your main file is different (e.g., `server.js`, `app.js`), update the `ExecStart` line accordingly.

---

## 📝 Step 4 — Reload systemd

```bash
sudo systemctl daemon-reload
```

**💡 Why:** Tells systemd to read the new service file.

---

## 📝 Step 5 — Start the Service

```bash
sudo systemctl start myapp
```

---

## 📝 Step 6 — Verify It's Running

```bash
sudo systemctl status myapp
```

Expected result:

```text
🔄 myapp.service - MyApp Node.js API Server
     Loaded: loaded (/etc/systemd/system/myapp.service; disabled; vendor preset: enabled)
     Active: 🟢 active (running) since ...
     Main PID: XXXXX (node)
     ...
```

The key lines:

```text
Loaded: loaded    →  📖 Service file is read
Active: active (running) →  ⚡ App is running
```

---

## 📝 Step 7 — Test the API

```bash
curl http://localhost:3000/api/health
```

Expected: A response from your backend. ⚡

From your local computer:

```bash
curl https://yourdomain.com/api/health
```

Expected: A response from your API. ✅

---

## 📝 Step 8 — Enable on Boot

```bash
sudo systemctl enable myapp
```

Expected:

```text
🔗 Created symlink /etc/systemd/system/multi-user.target.wants/myapp.service → /etc/systemd/system/myapp.service
```

**💡 Why:** Ensures the service starts automatically when the server reboots.

---

## 📝 Step 9 — Test Restart Behavior

### 9.1 🛑 Kill the process manually

```bash
sudo systemctl stop myapp
```

Verify it's stopped:

```bash
sudo systemctl status myapp
```

Expected:

```text
🔴 Active: inactive (dead)
```

### 9.2 🚀 Start it again

```bash
sudo systemctl start myapp
```

### 9.3 ✅ Verify it started

```bash
sudo systemctl status myapp
```

Expected:

```text
🟢 Active: active (running)
```

---

## 📝 Step 10 — View Application Logs

```bash
sudo journalctl -u myapp
```

Expected: Logs from your Node.js application. 📊

### 📡 Follow logs in real-time

```bash
sudo journalctl -u myapp -f
```

Press `Ctrl+C` to stop following.

---

## 📝 Step 11 — Test Reboot Behavior

**Optional but recommended:**

```bash
sudo reboot
```

⏳ Wait 30-60 seconds, then reconnect:

```bash
ssh -i ~/Downloads/myapp-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

Verify the service started:

```bash
sudo systemctl status myapp
```

Expected:

```text
🟢 Active: active (running)
```

Test the website:

```bash
curl -I https://yourdomain.com
```

Expected: `🔒 HTTP/2 200`

---

## ✅ Checkpoint

At this point:

```text
[✓] 📄 Service file created
[✓] 🔄 systemd daemon-reload completed
[✓] 🚀 Service starts with systemctl start
[✓] 🟢 Service is active (running)
[✓] ⚡ API responds on localhost:3000
[✓] 🔄 Service enabled on boot
[✓] 🔄 Service restarts after manual stop/start
[✓] 📊 Logs visible with journalctl
[✓] 🔄 (Optional) Survives server reboot
```

> 📸 **Screenshot:** Capture the terminal showing `sudo systemctl status myapp` with `active (running)` status.

> 📸 **Screenshot:** Capture the terminal showing `sudo systemctl is-enabled myapp` returning `enabled`.

> 🎉 If all checks pass, continue to: [📊 Logs & Monitoring](15-logs-and-monitoring.md).

---

## 📖 Useful systemd Commands

```bash
# ⚙️ Service management
sudo systemctl start myapp
sudo systemctl stop myapp
sudo systemctl restart myapp
sudo systemctl reload myapp
sudo systemctl status myapp

# 🔄 Enable/Disable on boot
sudo systemctl enable myapp
sudo systemctl disable myapp

# 📊 View logs
sudo journalctl -u myapp           # 📋 All logs
sudo journalctl -u myapp -f        # 📡 Follow (real-time)
sudo journalctl -u myapp --since "1 hour ago"  # ⏰ Recent logs
sudo journalctl -u myapp -n 50     # 📊 Last 50 lines

# 🔄 Reload systemd after config changes
sudo systemctl daemon-reload
```

---

## 🔧 Troubleshooting

### ❓ "Failed to start myapp.service"

Check logs for the error:

```bash
sudo journalctl -u myapp -n 50
```

Common issues:

- ❌ Wrong `ExecStart` path
- 🔐 Missing environment variables
- ❌ Node.js not found at `/usr/bin/node`

### ❓ "Unit myapp.service not found"

Make sure you ran `daemon-reload`:

```bash
sudo systemctl daemon-reload
```

### ❓ "Active: failed"

The application crashed. Check the logs:

```bash
sudo journalctl -u myapp -n 100
```

Fix the issue, then restart:

```bash
sudo systemctl restart myapp
```

### ❓ "Node.js not found at /usr/bin/node"

Find the correct path:

```bash
which node
```

Update the service file with the correct path.

### ❓ "Permission denied"

Make sure the service runs as the correct user:

```ini
User=ubuntu
Group=ubuntu
```

And the application files are owned by that user:

```bash
sudo chown -R ubuntu:ubuntu ~/simple-basic-application
```

---

## 🎉 Done

Your Node.js application is managed by systemd. 🔄 It starts on boot, restarts on failure, and logs are visible. Next, you will learn about logging and monitoring. 📊
