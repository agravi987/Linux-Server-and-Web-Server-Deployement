# 03 — 🔐 SSH Connection

> **Last Updated:** September 7, 2026

---

## 🎯 Goal

Connect from your local computer to the EC2 server using SSH.

## ✅ Prerequisites

```text
[ ] ☁️ EC2 instance is running (from 02-aws-ec2-setup.md)
[ ] 🔑 Key pair (.pem file) downloaded
[ ] 📍 Public IPv4 address noted down
```

## 💡 What is SSH?

SSH (Secure Shell) is an encrypted connection protocol. It gives you a terminal session on the remote server, as if you were sitting in front of it.

---

## 📝 Step 1 — Locate Your Key File

Find the `.pem` file you downloaded:

**🍎 Mac/Linux:**

```bash
ls ~/Downloads/myapp-key.pem
```

**🪟 Windows (PowerShell):**

```powershell
ls C:\Users\YOUR_USERNAME\Downloads\myapp-key.pem
```

---

## 📝 Step 2 — Set Correct Permissions

The SSH key file must have restricted permissions. SSH will refuse to use it otherwise.

**🍎 Mac/Linux:**

```bash
chmod 400 ~/Downloads/myapp-key.pem
```

> 💡 `chmod 400` means only the file owner can read it. SSH requires this for security.

**🪟 Windows (PowerShell):**

```powershell
icacls C:\Users\YOUR_USERNAME\Downloads\myapp-key.pem /inheritance:r /grant:r "YOUR_USERNAME:R"
```

---

## 📝 Step 3 — Connect via SSH

Run this command, replacing the values:

**🍎 Mac/Linux:**

```bash
ssh -i ~/Downloads/myapp-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

**🪟 Windows (PowerShell, using OpenSSH):**

```powershell
ssh -i C:\Users\YOUR_USERNAME\Downloads\myapp-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

> 💡 `ubuntu` is the default username for Ubuntu AMIs on EC2.

When prompted:

```text
The authenticity of host 'XX.XX.XX.XX' can't be established.
ED25519 key fingerprint is SHA256:XXXX...
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

Type `yes` and press Enter.

---

## 📝 Step 4 — Verify Connection

After connecting, you should see:

```
🎉 Welcome to Ubuntu 24.04.x LTS (GNU/Linux 6.x.x-xx-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

Last login: ...
ubuntu@ip-XX-XX-XX-XX:~$
```

Run a quick check:

```bash
hostname
```

Expected result:

```text
ip-XX-XX-XX-XX
```

Run:

```bash
lsb_release -a
```

Expected result:

```text
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 24.04.x LTS
Release:        24.04
Codename:       noble
```

---

## 📝 Step 5 — Basic Server Exploration

Now that you are connected, try these commands on the server:

```bash
# 📁 Current directory
pwd
```

Expected:

```text
/home/ubuntu
```

```bash
# ℹ️ System information
uname -a
```

```bash
# 💾 Disk space
df -h
```

```bash
# 🧠 Memory
free -h
```

---

## ✅ Checkpoint

At this point:

```text
[✓] 🔐 SSH connection works
[✓] 👤 You are logged in as ubuntu
[✓] 🐧 Server is running Ubuntu 24.04 LTS
[✓] 🧭 You can explore the filesystem
```

> 📸 **Screenshot:** Capture your terminal showing the successful SSH login and `lsb_release -a` output.

> 🎉 If all checks pass, continue to: [🐧 Linux Server Setup](04-linux-server-setup.md).

---

## 🔧 Troubleshooting

### ❓ "Permission denied (publickey)"

**Check 1:** 📁 File permissions

```bash
chmod 400 ~/Downloads/myapp-key.pem
```

**Check 2:** ✅ Correct username

```bash
# 💡 For Ubuntu AMIs, the default user is "ubuntu"
ssh -i ~/Downloads/myapp-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

**Check 3:** 🔑 Correct key file

Make sure you are pointing to the `.pem` file you actually downloaded for this instance.

### ❓ "Connection timed out"

**Check 1:** ☁️ Instance is running

Go to AWS Console → EC2 → Instances → verify state is `Running`.

**Check 2:** 🛡️ Security Group allows SSH

Go to your instance → Security → verify inbound rule for port 22 exists.

**Check 3:** 📍 Source is correct

If you set SSH source to "My IP", make sure your current IP hasn't changed (e.g., you moved to a different network). Update the security group rule.

### ❓ "Connection refused"

The SSH service might not be running on the server.

1. 🌐 Go to AWS Console
2. ☁️ Select your instance
3. 🔌 Click **Instance state** → **Connect to new instance** (or use EC2 Serial Console if available)

### ❓ "Host key verification failed"

This happens if the server's IP was previously associated with a different host. Remove the old entry:

```bash
ssh-keygen -R YOUR_EC2_PUBLIC_IP
```

Then try connecting again.

### ❓ "I'm on Windows and don't have SSH"

Windows 10/11 includes OpenSSH. Open PowerShell and run the ssh command.

If not available:

1. 📥 Install PuTTY from https://www.putty.org
2. 🔑 Convert the `.pem` key to `.ppk` using PuTTYgen
3. 🔌 Use PuTTY to connect

---

## 🎉 Done

You are connected to your EC2 server. Next, you will install the required software on the server. 🐧
