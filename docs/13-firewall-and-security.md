# 13 — 🔥 Firewall & Security

> **Last Updated:** September 7, 2026

---

## 🎯 Goal

Configure the Linux firewall to allow only necessary traffic.

## ✅ Prerequisites

```text
[ ] ⚙️ All services are running (from previous guides)
[ ] 🔒 You can access the site via HTTPS
```

## 🛡️ How Security Layers Work

```
☁️ AWS Security Group   →  🥅 First layer (cloud firewall)
        ↓
🔥 Linux Firewall (UFW) →  🛡️ Second layer (server firewall)
        ↓
🖥️ Server
```

> 💡 You already configured the AWS Security Group in guide 03. Now configure the Linux firewall.

---

## 📝 Step 1 — Check Current UFW Status

```bash
sudo ufw status
```

Expected result:

```text
Status: inactive
```

> 💡 UFW (Uncomplicated Firewall) is Ubuntu's firewall management tool.

---

## 📝 Step 2 — ⚠️ IMPORTANT — Allow SSH First

> 🚨 **CRITICAL:** Before enabling the firewall, make sure SSH is allowed. If you don't, you will lock yourself out of the server.

```bash
sudo ufw allow OpenSSH
```

Expected:

```text
✅ Rules updated
✅ Rules updated (v6)
```

### 🚨 Why This Step Is Critical

If you enable the firewall without allowing SSH, your SSH connection will be blocked and you won't be able to access the server. You would need to fix it from the AWS Console using EC2 Serial Console.

---

## 📝 Step 3 — Allow HTTP and HTTPS

```bash
sudo ufw allow 80/tcp
```

Expected:

```text
✅ Rules updated
```

```bash
sudo ufw allow 443/tcp
```

Expected:

```text
✅ Rules updated
```

---

## 📝 Step 4 — Verify Rules

```bash
sudo ufw status verbose
```

Expected result:

```text
Status: inactive

To                         Action      From
--                         ------      ----
22/tcp (OpenSSH)           ALLOW IN    Anywhere
80/tcp                     ALLOW IN    Anywhere
443/tcp                    ALLOW IN    Anywhere
22/tcp (OpenSSH (v6))      ALLOW IN    Anywhere (v6)
80/tcp (v6)                ALLOW IN    Anywhere (v6)
443/tcp (v6)               ALLOW IN    Anywhere (v6)
```

> ✅ **Verify:** SSH (22), HTTP (80), and HTTPS (443) are all allowed. Nothing else should be listed.

---

## 📝 Step 5 — Enable the Firewall

```bash
sudo ufw enable
```

It will warn you:

```text
⚠️ Command may disrupt existing ssh connections. Proceed with operation (y|n)?
```

Type `y` and press Enter.

Expected result:

```text
🔥 Firewall is active and enabled on system startup
```

---

## 📝 Step 6 — Verify Firewall is Active

```bash
sudo ufw status
```

Expected:

```text
🟢 Status: active

To                         Action      From
--                         ------      ----
22/tcp (OpenSSH)           ALLOW IN    Anywhere
80/tcp                     ALLOW IN    Anywhere
443/tcp                    ALLOW IN    Anywhere
22/tcp (OpenSSH (v6))      ALLOW IN    Anywhere (v6)
80/tcp (v6)                ALLOW IN    Anywhere (v6)
443/tcp (v6)               ALLOW IN    Anywhere (v6)
```

---

## 📝 Step 7 — Verify You Can Still Connect

Test SSH from your local computer:

```bash
ssh -i ~/Downloads/myapp-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

It should work normally. ✅

Test HTTP access:

```bash
curl -I http://YOUR_EC2_PUBLIC_IP
```

Expected: `🔄 HTTP/1.1 301 Moved Permanently` (redirect to HTTPS)

Test HTTPS access:

```bash
curl -I https://yourdomain.com
```

Expected: `🔒 HTTP/2 200`

---

## 📝 Step 8 — Verify Internal Ports Are NOT Exposed

The following ports should NOT be accessible from the internet:

```text
⚡ 3000 (Node.js)   → 🔷 Only Nginx connects to this
🐘 5432 (PostgreSQL) → ⚡ Only Node.js connects to this
```

These are only accessible internally because UFW only allows 22, 80, and 443 from the outside. Node.js and PostgreSQL are bound to localhost (`127.0.0.1`), so they are already not exposed.

---

## 📝 Step 9 — Verify Listening Ports

```bash
sudo ss -lntp
```

Expected:

```text
State   Recv-Q  Send-Q  Local Address:Port   Peer Address:Port
LISTEN  0       128     0.0.0.0:443          0.0.0.0:*    nginx
LISTEN  0       128     0.0.0.0:80           0.0.0.0:*    nginx
LISTEN  0       128     0.0.0.0:22           0.0.0.0:*    sshd
LISTEN  0       128     127.0.0.1:3000       0.0.0.0:*    node
LISTEN  0       128     127.0.0.1:5432       0.0.0.0:*    postgres
```

Key observations:

```text
0.0.0.0:443     → 🌐 Public (HTTPS)      ✅
0.0.0.0:80      → 🌐 Public (HTTP)       ✅
0.0.0.0:22      → 🌐 Public (SSH)        ✅
127.0.0.1:3000  → 🔒 Local only (Node.js) ✅
127.0.0.1:5432  → 🔒 Local only (PostgreSQL) ✅
```

> 💡 Ports 3000 and 5432 are bound to `127.0.0.1` (localhost) — they are not accessible from the internet.

---

## ✅ Checkpoint

At this point:

```text
[✓] 🔥 UFW firewall is active
[✓] 🔐 SSH (22) is allowed
[✓] 🌐 HTTP (80) is allowed
[✓] 🔒 HTTPS (443) is allowed
[✓] ⚡ Node.js (3000) is NOT publicly exposed
[✓] 🐘 PostgreSQL (5432) is NOT publicly exposed
[✓] 🔐 SSH connection still works
[✓] 🔒 Website loads via HTTPS
```

> 📸 **Screenshot:** Capture the terminal showing `sudo ufw status` with all rules listed.

> 📸 **Screenshot:** Capture the terminal showing `sudo ss -lntp` with ports 3000 and 5432 bound to 127.0.0.1.

> 🎉 If all checks pass, continue to: [🔄 systemd Application Service](14-systemd-application-service.md).

---

## 📖 Useful UFW Commands

```bash
# 📊 Status
sudo ufw status
sudo ufw status verbose

# ✅ Allow a port
sudo ufw allow 80/tcp

# ❌ Deny a port
sudo ufw deny 3306/tcp

# 🗑️ Delete a rule
sudo ufw delete allow 80/tcp

# ⚠️ Disable (use with caution)
sudo ufw disable

# ✅ Enable
sudo ufw enable

# 🚨 Reset to defaults (DANGEROUS — may lock you out)
sudo ufw reset
```

---

## 🔧 Troubleshooting

### ❓ "I locked myself out of SSH"

1. 🌐 Go to AWS Console → EC2 → Instances
2. ☁️ Select your instance
3. 🔌 Click **Connect** → **EC2 Serial Console**
4. 🔑 Log in and run:

```bash
sudo ufw disable
```

5. 🔧 Then fix your rules and re-enable.

### ❓ "UFW is not installed"

```bash
sudo apt install ufw -y
```

### ❓ "Website stopped working after enabling UFW"

Check if the rules are correct:

```bash
sudo ufw status
```

Make sure 80 and 443 are allowed.

---

## 🎉 Done

The firewall is configured and the server is secured. 🔥 Next, you will configure systemd to auto-start the application on boot. 🔄
