# 03 — ☁️ AWS EC2 Setup

> **Last Updated:** September 7, 2026

---

## 🎯 Goal

Create an Ubuntu Linux virtual server on AWS EC2 that will host our application.

## ✅ Prerequisites

```text
[ ] ☁️ AWS account with billing enabled
[ ] 📖 Completed: 01-app-creation.md
```

## 💡 What is EC2?

EC2 (Elastic Compute Cloud) provides a virtual Linux server running in AWS data centers. You rent it by the hour and connect to it over the internet.

---

## 📝 Step 1 — Log In to AWS Console

1. 🌐 Go to **https://aws.amazon.com**
2. 🔐 Click **Sign In to the Console**
3. 🔑 Log in with your AWS account credentials

> 💡 Use the **Root user** or an **IAM user** with EC2 permissions.

---

## 📝 Step 2 — Launch an EC2 Instance

### 2.1 🧭 Navigate to EC2

1. 🔍 In the AWS Console, search for **EC2** in the search bar
2. 📋 Click **EC2** under Services
3. 🚀 Click the orange **Launch instance** button

### 2.2 📛 Choose a Name

```text
Name: myapp-server
```

### 2.3 🖥️ Choose an Amazon Machine Image (AMI)

Select:

```text
🐧 Ubuntu Server 24.04 LTS (or 22.04 LTS)
64-bit (x86)
✅ Free tier eligible
```

> 💡 LTS means Long Term Support — Ubuntu guarantees security updates for 5 years.

### 2.4 ⚙️ Choose an Instance Type

Select:

```text
💻 t2.micro (Free tier eligible)
1 vCPU, 1 GB RAM
```

> 💡 t2.micro is sufficient for this project. You can upgrade later if needed.

### 2.5 🔑 Create a Key Pair (SSH Key)

This is how you will connect to the server.

1. 🔐 Under **Key pair (login)**, click **Create new key pair**
2. ⚙️ Configure:

```text
Key pair name:    myapp-key
Key pair type:    RSA
Private key format: .pem (for Mac/Linux) or .ppk (for Windows/PuTTY)
```

3. ✅ Click **Create key pair**
4. 📥 The `.pem` file will download to your computer

> ⚠️ **IMPORTANT:** Store this file safely. You cannot download it again. Anyone with this file can access your server.

### 2.6 🌐 Configure Network Settings

Click **Edit** next to Network settings.

**VPC and Subnet:**

```text
VPC:        Default VPC
Subnet:     Any public subnet (with auto-assign public IP = Enable)
```

**Firewall (Security Group):**

Select **Create security group** and configure:

```text
Security group name:    myapp-sg
Description:            Security group for myapp server
```

Add these **Inbound rules:**

| Type | Port | Source | Description |
|------|------|--------|-------------|
| 🔐 SSH | 22 | My IP | SSH access |
| 🌐 HTTP | 80 | 0.0.0.0/0 | Web traffic |
| 🔒 HTTPS | 443 | 0.0.0.0/0 | Secure web traffic |

> 💡 **SSH rule:** Set source to **My IP** for security. This restricts SSH access to your current IP address only.

### 2.7 💾 Configure Storage

```text
Size:           20 GB (minimum recommended)
Volume type:    gp3 (General Purpose SSD)
```

> 💡 20 GB is enough for Ubuntu, Node.js, PostgreSQL, Nginx, and your application.

### 2.8 🚀 Launch

1. 👀 Review the settings on the right panel
2. ✅ Click **Launch instance**
3. 👁️ Click **View all instances**
4. ⏳ Wait for the instance state to change from `Pending` to `Running`

> 📸 **Screenshot:** Capture the EC2 instance launch confirmation page.

---

## 📝 Step 3 — Verify the Instance

Run this command in your terminal (not the server — this is just checking AWS):

Wait for the instance to show:

```text
Instance state:     🟢 Running
Status check:       ✅ 2/2 checks passed
Public IPv4 address: XX.XX.XX.XX
```

**📝 Write down your Public IPv4 address:**

```text
YOUR_EC2_PUBLIC_IP = __.__.__.__
```

---

## 📝 Step 4 — Security Group Verification

Go to your instance → **Security** tab → click the security group link.

Verify these **Inbound rules** exist:

| Port | Protocol | Source | Status |
|------|----------|--------|--------|
| 22 | TCP | YOUR_IP/32 | ✅ |
| 80 | TCP | 0.0.0.0/0 | ✅ |
| 443 | TCP | 0.0.0.0/0 | ✅ |

> ⚠️ Do NOT add ports 3000 or 5432. Node.js and PostgreSQL should not be publicly accessible. Nginx will proxy traffic to them internally.

### 🛡️ Why Hide Ports 3000 and 5432?

```text
🔷 Nginx (port 443) → handles all external traffic
⚡ Node.js (port 3000) → only needs to talk to Nginx, not the internet
🐘 PostgreSQL (port 5432) → only needs to talk to Node.js, not the internet
```

> 🚨 Exposing database ports to the internet is a serious security risk.

---

## ✅ Checkpoint

At this point:

```text
[✓] ☁️ EC2 instance is running
[✓] 🐧 Ubuntu 24.04 LTS is installed
[✓] 💻 t2.micro instance type selected
[✓] 🔑 Key pair (.pem) downloaded
[✓] 🛡️ Security group allows SSH, HTTP, HTTPS
[✓] 🔒 Ports 3000 and 5432 are NOT exposed
[✓] 📍 Public IPv4 address noted down
```

> 📸 **Screenshot:** Capture the EC2 Instances dashboard showing your running instance with its Public IPv4 address.

> 📸 **Screenshot:** Capture the Security Group inbound rules showing SSH, HTTP, and HTTPS ports.

> 🎉 If all checks pass, continue to: [🔐 SSH Connection](04-ssh-connection.md).

---

## 🔧 Troubleshooting

### ❓ "Instance is stuck in Pending"

⏳ Wait 2-3 minutes. If it stays in Pending, try stopping and starting the instance.

### ❓ "I can't find my key pair file"

📁 Check your browser's Downloads folder. The `.pem` file was downloaded when you created the key pair.

### ❓ "I accidentally deleted my key pair"

❌ You cannot recover a deleted key pair. Options:

1. 🛑 Stop the instance
2. 🔌 Detach the root volume
3. 🚀 Launch a new instance with a new key pair
4. 🔌 Attach the old volume to the new instance

Or just create a new EC2 instance with a new key pair.

### ❓ "I chose the wrong AMI"

🔄 You can terminate the instance and create a new one, or stop it and change the AMI (not possible — terminate and recreate).

---

## 🎉 Done

Your EC2 instance is running with Ubuntu Linux. Next, you will connect to it using SSH. 🔐
