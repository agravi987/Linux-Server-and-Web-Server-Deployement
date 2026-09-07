# 15 — 🔧 Troubleshooting

> **Last Updated:** September 7, 2026

---

## 🎯 Goal

Fix the most common problems you will encounter.

## 📋 Format

Each problem follows this pattern:

```text
🔴 PROBLEM
  ↓
🔍 CHECK
  ↓
💻 COMMAND
  ↓
✅ EXPECTED RESULT
  ↓
🛠️ FIX
  ↓
✅ VERIFY
```

---

## 🔐 SSH Doesn't Work

### ❌ Problem

```text
ssh: connect to host YOUR_EC2_PUBLIC_IP port 22: Connection refused
```

### 🔍 Check — Is the instance running?

AWS Console → EC2 → Instances → check State.

### 🛠️ Fix

If stopped, start the instance. If terminated, create a new one.

---

### ❌ Problem

```text
Permission denied (publickey)
```

### 🔍 Check — Key file permissions

```bash
ls -la ~/Downloads/myapp-key.pem
```

Expected:

```text
-rw------- 1 user user ... myapp-key.pem
```

### 🛠️ Fix

```bash
chmod 400 ~/Downloads/myapp-key.pem
```

### ✅ Verify

```bash
ssh -i ~/Downloads/myapp-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

---

### ❌ Problem

```text
Connection timed out
```

### 🔍 Check — Security Group

AWS Console → EC2 → Instances → Security → verify port 22 is allowed from "My IP".

### 🛠️ Fix

Update the security group inbound rule to allow port 22 from your current IP.

---

## 🌐 Website Doesn't Open

### 🔍 Check — Is Nginx running?

```bash
sudo systemctl status nginx
```

### 🛠️ Fix

```bash
sudo systemctl start nginx
```

### 🔍 Check — Is the firewall blocking?

```bash
sudo ufw status
```

### 🛠️ Fix

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### 🔍 Check — Is DNS resolving?

```bash
nslookup yourdomain.com
```

### 🛠️ Fix

⏳ Wait for DNS propagation, or verify the A record is correct.

---

## 🔴 502 Bad Gateway

This means Nginx received the request but cannot reach Node.js.

### 🔍 Check — Is Node.js running?

```bash
sudo systemctl status myapp
```

### 🛠️ Fix

```bash
sudo systemctl start myapp
```

### 🔍 Check — Is port 3000 listening?

```bash
sudo ss -lntp | grep 3000
```

Expected:

```text
⚡ LISTEN  0  128  127.0.0.1:3000  ...
```

If nothing shows, Node.js is not running.

### 🔍 Check — Test directly

```bash
curl http://127.0.0.1:3000
```

Expected: A response from your API. ⚡

If this fails, check the app logs:

```bash
sudo journalctl -u myapp -n 50
```

### 🛠️ Fix — Most common causes

1. ⚡ Node.js crashed → restart it: `sudo systemctl restart myapp`
2. 🔌 Port 3000 conflict → kill other processes: `sudo fuser -k 3000/tcp`
3. 🔷 Nginx config wrong → check proxy_pass URL

### ✅ Verify

```bash
curl -I https://yourdomain.com
```

Expected: `🔒 HTTP/2 200`

---

## 🚫 403 Forbidden

Nginx doesn't have permission to read the files.

### 🔍 Check

```bash
ls -la /var/www/myapp/
```

### 🛠️ Fix

```bash
sudo chown -R www-data:www-data /var/www/myapp
sudo chmod -R 755 /var/www/myapp
```

### ✅ Verify

```bash
curl -I https://yourdomain.com
```

Expected: `🔒 HTTP/2 200`

---

## ❌ 404 Not Found

Nginx can't find the file.

### 🔍 Check — Does the file exist?

```bash
ls /var/www/myapp/index.html
```

### 🛠️ Fix

If the file doesn't exist, copy the build output:

```bash
cd ~/YOUR_REPO/frontend
sudo cp -r dist/* /var/www/myapp/
```

### 🔍 Check — Is the Nginx root path correct?

```bash
cat /etc/nginx/sites-available/myapp | grep root
```

Expected:

```text
root /var/www/myapp;
```

### ✅ Verify

```bash
curl -I https://yourdomain.com
```

---

## 💥 500 Internal Server Error

The server encountered an unexpected error.

### 🔍 Check — Nginx error log

```bash
sudo tail -20 /var/log/nginx/error.log
```

### 🔍 Check — Node.js logs

```bash
sudo journalctl -u myapp -n 50
```

### 🛠️ Fix

Read the error message. Common causes:

- 🐘 Database connection failed
- 🔐 Missing environment variable
- 💻 Code bug

---

## ⚡ Node.js Isn't Running

### 🔍 Check

```bash
sudo systemctl status myapp
```

### 🛠️ Fix

```bash
sudo systemctl start myapp
```

If it fails to start:

```bash
sudo journalctl -u myapp -n 50
```

Read the error and fix the underlying issue.

### ✅ Verify

```bash
sudo systemctl status myapp
# 🟢 Should show: Active: active (running)
```

---

## 🔌 Port 3000 Isn't Listening

### 🔍 Check

```bash
sudo ss -lntp | grep 3000
```

### 🛠️ Fix

Start the service:

```bash
sudo systemctl start myapp
```

If something else is using port 3000:

```bash
sudo fuser -k 3000/tcp
sudo systemctl start myapp
```

---

## 🐘 PostgreSQL Isn't Running

### 🔍 Check

```bash
systemctl status postgresql
```

### 🛠️ Fix

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### ✅ Verify

```bash
ss -lntp | grep 5432
```

Expected:

```text
🐘 LISTEN  0  128  127.0.0.1:5432  ...
```

---

## 🐘 Database Connection Failed

### 🔍 Check — Is PostgreSQL running?

```bash
systemctl status postgresql
```

### 🔍 Check — Can you connect?

```bash
psql -U myapp_user -d myapp_db -h localhost
```

If password fails, reset it:

```bash
sudo -u postgres psql
ALTER USER myapp_user WITH PASSWORD 'new_password';
\q
```

Update `.env` with the new password:

```bash
nano ~/YOUR_REPO/backend/.env
```

Restart the app:

```bash
sudo systemctl restart myapp
```

---

## 🌍 DNS Doesn't Resolve

### 🔍 Check

```bash
nslookup yourdomain.com
```

### 🛠️ Fix

1. ✅ Verify A record in your DNS provider
2. ⏳ Wait for propagation (5 min — 48 hours)
3. 🔍 Test with a different DNS server:

```bash
nslookup yourdomain.com 8.8.8.8
```

4. 🌐 Use https://dnschecker.org to check globally

---

## 🔒 HTTPS Doesn't Work

### 🔍 Check — Is the certificate installed?

```bash
sudo certbot certificates
```

### 🛠️ Fix

Obtain a new certificate:

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 🔍 Check — Is Nginx configured for HTTPS?

```bash
cat /etc/nginx/sites-available/myapp | grep ssl
```

Should show `listen 443 ssl` and `ssl_certificate` lines.

---

## 🔥 Firewall Blocks Traffic

### 🔍 Check

```bash
sudo ufw status
```

### 🛠️ Fix

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### 🚨 If locked out

Use EC2 Serial Console from AWS Console to disable UFW:

```bash
sudo ufw disable
```

---

## 🔄 Application Stops After SSH Disconnect

### 🔍 Check — Was it running in the foreground?

If you ran `npm start` directly (not as a systemd service), it stops when SSH disconnects.

### 🛠️ Fix — Use systemd

Follow guide 13 — 🔄 systemd Application Service:

```bash
sudo systemctl start myapp
sudo systemctl enable myapp
```

---

## 🔄 Application Doesn't Start After Reboot

### 🔍 Check — Is the service enabled?

```bash
sudo systemctl is-enabled myapp
```

Expected:

```text
🟢 enabled
```

### 🛠️ Fix

```bash
sudo systemctl enable myapp
```

### 🔍 Check — Does PostgreSQL start before the app?

```bash
cat /etc/systemd/system/myapp.service | grep After
```

Should include `postgresql.service`.

### 🛠️ Fix

Edit the service file:

```bash
sudo nano /etc/systemd/system/myapp.service
```

Make sure this is in the `[Unit]` section:

```ini
After=network.target postgresql.service
```

Then:

```bash
sudo systemctl daemon-reload
sudo systemctl restart myapp
```

---

## 📋 Quick Reference — Error Codes

```text
✅ HTTP 200  →  OK
🔄 HTTP 301  →  Redirect
🚫 HTTP 403  →  Forbidden (permissions)
❌ HTTP 404  →  Not Found
💥 HTTP 500  →  Internal Server Error (app bug)
🔴 HTTP 502  →  Bad Gateway (Node.js not running)
⚠️ HTTP 503  →  Service Unavailable (overloaded)
```

> 📸 **Screenshot:** If you encounter and fix an error, capture the terminal showing the error and its resolution.

---

## 🎉 Done

You now have a reference for fixing the most common problems. 🔧 Next, you will learn the deployment procedure for updating the application. 🚀
