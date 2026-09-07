# 14 — 📊 Logs & Monitoring

> **Last Updated:** September 7, 2026

---

## 🎯 Goal

Learn where to find logs and how to monitor the application.

## ✅ Prerequisites

```text
[ ] 🔄 Application running as systemd service (from 13-systemd-application-service.md)
[ ] 🔷 Nginx configured (from 09-nginx-configuration.md)
```

## 📍 Where Are the Logs?

```text
📊 Nginx access logs     →  /var/log/nginx/access.log
⚠️ Nginx error logs      →  /var/log/nginx/error.log
📝 Node.js logs          →  journalctl (systemd journal)
🐘 PostgreSQL logs       →  /var/log/postgresql/
```

---

## 📝 Step 1 — Nginx Access Logs

Shows every request to your server:

```bash
sudo tail /var/log/nginx/access.log
```

### 📡 Follow in real-time

```bash
sudo tail -f /var/log/nginx/access.log
```

Press `Ctrl+C` to stop.

### 👁️ What to look for

```text
GET / HTTP/1.1 200          →  ✅ Normal page load
GET /api/health 200         →  ✅ API request succeeded
GET /api/users 500          →  ❌ API error
POST /api/login 401         →  🚫 Unauthorized
```

The numbers at the end are HTTP status codes:

```text
✅ 200  →  OK
🔄 301  →  Redirect
❌ 404  →  Not Found
💥 500  →  Internal Server Error
🔴 502  →  Bad Gateway (Nginx can't reach Node.js)
```

---

## 📝 Step 2 — Nginx Error Logs

Shows Nginx errors:

```bash
sudo tail /var/log/nginx/error.log
```

### 📡 Follow in real-time

```bash
sudo tail -f /var/log/nginx/error.log
```

### 👁️ What to look for

```text
❌ connect() failed →  Cannot reach Node.js
⚠️ permission denied →  File permission issue
❌ no such host →  DNS resolution failed
```

---

## 📝 Step 3 — Node.js / Application Logs

Since we configured systemd to use the journal:

```bash
# 📋 View all logs
sudo journalctl -u myapp
```

```bash
# 📡 Follow in real-time
sudo journalctl -u myapp -f
```

```bash
# 📊 Last 100 lines
sudo journalctl -u myapp -n 100
```

```bash
# ⏰ Logs from the last hour
sudo journalctl -u myapp --since "1 hour ago"
```

```bash
# 📅 Logs from today
sudo journalctl -u myapp --since today
```

```bash
# ⚠️ Logs with errors only
sudo journalctl -u myapp -p err
```

### 👁️ What to look for

```text
✅ Server started on port 3000  →  Normal startup
❌ Error: connection refused     →  Database not reachable
⚠️ UnhandledPromiseRejection    →  Unhandled error in your code
🔴 EADDRINUSE                   →  Port already in use
```

---

## 📝 Step 4 — PostgreSQL Logs

```bash
# 🔍 Find the log file
ls /var/log/postgresql/
```

```bash
# 📖 View the log
sudo tail /var/log/postgresql/postgresql-16-main.log
```

### 👁️ What to look for

```text
✅ database system is ready     →  PostgreSQL started successfully
❌ FATAL: password auth failed  →  Wrong credentials
📝 LOG: connection received     →  App connected to database
```

---

## 📝 Step 5 — System Resource Monitoring

### 💾 Check disk space

```bash
df -h
```

```text
Filesystem      Size  Used Avail Use% Mounted on
/dev/xvda1       20G  4.5G   15G  24% /
```

> ⚠️ Alert when Use% exceeds 80%.

### 🧠 Check memory

```bash
free -h
```

```text
              total   used   free
Mem:          981Mi   412Mi  284Mi
Swap:         0B      0B     0B
```

### 📋 Check running processes

```bash
ps aux | grep node
```

```bash
# 📊 Top processes by CPU
top -b -n 1 | head -20
```

### 🔌 Check network connections

```bash
ss -lntp
```

Shows all listening ports.

---

## 📝 Step 6 — Create a Simple Monitoring Script

Create a script to check all services at once:

```bash
nano ~/check-services.sh
```

Paste:

```bash
#!/bin/bash
echo "📊 === Service Status ==="
echo ""
echo "🔷 Nginx:"
systemctl is-active nginx
echo ""
echo "🐘 PostgreSQL:"
systemctl is-active postgresql
echo ""
echo "⚡ MyApp:"
systemctl is-active myapp
echo ""
echo "🔌 === Listening Ports ==="
ss -lntp | grep -E ':(80|443|3000|5432|22) '
echo ""
echo "💾 === Disk Space ==="
df -h / | tail -1
echo ""
echo "🧠 === Memory ==="
free -h | grep Mem
```

Make it executable:

```bash
chmod +x ~/check-services.sh
```

Run it:

```bash
bash ~/check-services.sh
```

Expected output:

```text
📊 === Service Status ===

🔷 Nginx:
active

🐘 PostgreSQL:
active

⚡ MyApp:
active

🔌 === Listening Ports ===
LISTEN 0 128 0.0.0.0:443 ...
LISTEN 0 128 0.0.0.0:80 ...
LISTEN 0 128 0.0.0.0:22 ...
LISTEN 0 128 127.0.0.1:3000 ...
LISTEN 0 128 127.0.0.1:5432 ...

💾 === Disk Space ===
/dev/xvda1  20G  4.5G  15G  24% /

🧠 === Memory ===
Mem:    981Mi   412Mi   284Mi
```

---

## ✅ Checkpoint

At this point:

```text
[✓] 📊 Nginx logs accessible at /var/log/nginx/
[✓] 📝 Application logs accessible via journalctl
[✓] 🐘 PostgreSQL logs accessible
[✓] 💾 Disk space checked
[✓] 🧠 Memory usage checked
[✓] 📊 Monitoring script created
```

> 🎉 If all checks pass, continue to: [🔧 Troubleshooting](15-troubleshooting.md).

---

## 🔧 Troubleshooting

### ❓ "Permission denied when reading logs"

Use `sudo`:

```bash
sudo tail /var/log/nginx/error.log
```

### ❓ "journalctl shows no logs"

The service may not have started properly. Check:

```bash
sudo systemctl status myapp
```

If it shows `inactive (dead)`, start it:

```bash
sudo systemctl start myapp
```

### ❓ "Disk space is full"

Find large files:

```bash
du -sh /* | sort -rh | head -10
```

Clean up:

```bash
# 🧹 Clean apt cache
sudo apt clean

# 🗑️ Remove old logs
sudo journalctl --vacuum-size=100M

# 🗑️ Remove old Nginx logs
sudo truncate -s 0 /var/log/nginx/access.log
sudo truncate -s 0 /var/log/nginx/error.log
```

---

## 🎉 Done

You know where all the logs are and how to monitor the server. 📊 Next, you will learn how to troubleshoot common problems. 🔧
