# 🚀 Linux Server & Web Server Deployment

> **Last Updated:** September 7, 2026

## 🎯 Project Overview

Build and deploy a **full-stack web application** on AWS EC2 — from **writing the code** to **production deployment**.

```
                    ┌─────────────────┐
                    │     🌐 Browser  │
                    └────────┬────────┘
                             │
                           🔒 HTTPS
                             │
                             ▼
                        🌍 DNS (Domain)
                             │
                             ▼
                    ┌─────────────────┐
                    │    ☁️  AWS EC2   │
                    │ 🐧 Ubuntu Linux  │
                    │                 │
                    │ 🔷 Nginx :443   │
                    │      │          │
                    │      ▼          │
                    │ ⚡ Node.js :3000 │
                    │      │          │
                    │      ▼          │
                    │ 🐘 PostgreSQL   │
                    │    :5432        │
                    └─────────────────┘
```

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| 🛠️ App | React + Node.js | Full-stack application |
| ☁️ Cloud | AWS EC2 | Virtual Linux server |
| 🐧 OS | Ubuntu 24.04 LTS | Server operating system |
| 🔷 Web Server | Nginx | Reverse proxy & static files |
| ⚡ Backend | Node.js / Express | API server |
| 🎨 Frontend | React | User interface |
| 🐘 Database | PostgreSQL 16 | Relational database |
| 🔒 SSL | Let's Encrypt | Free HTTPS certificates |
| 🔥 Firewall | UFW | Linux firewall |
| 🔄 Process | systemd | Auto-start on boot |

---

## 📚 Quick Links

| # | 📖 Guide | 🎯 What You Do |
|---|---------|----------------|
| 1 | [🛠️ Create Your App](docs/01-app-creation.md) | Build React + Node.js app from scratch |
| 2 | [🏗️ Project Setup](docs/02-project-setup.md) | Understand the project and prepare |
| 3 | [☁️ AWS EC2 Setup](docs/03-aws-ec2-setup.md) | Create your cloud server |
| 4 | [🔐 SSH Connection](docs/04-ssh-connection.md) | Connect to your server |
| 5 | [🐧 Linux Server Setup](docs/05-linux-server-setup.md) | Install software and configure |
| 6 | [🐙 GitHub & App Setup](docs/06-github-and-application-setup.md) | Get code on the server |
| 7 | [⚡ Node.js Backend](docs/07-nodejs-backend-deployment.md) | Deploy and test the API |
| 8 | [🐘 PostgreSQL](docs/08-postgresql-setup.md) | Database setup |
| 9 | [🎨 React Frontend](docs/09-react-frontend-deployment.md) | Build and serve the frontend |
| 10 | [🔷 Nginx](docs/10-nginx-configuration.md) | Web server & reverse proxy |
| 11 | [🌍 DNS](docs/11-dns-configuration.md) | Domain name setup |
| 12 | [🔒 HTTPS/SSL](docs/12-https-ssl-setup.md) | Encrypt traffic |
| 13 | [🔥 Firewall & Security](docs/13-firewall-and-security.md) | Lock it down |
| 14 | [🔄 systemd Service](docs/14-systemd-application-service.md) | Auto-start on boot |
| 15 | [📊 Logs & Monitoring](docs/15-logs-and-monitoring.md) | Watch what's happening |
| 16 | [🔧 Troubleshooting](docs/16-troubleshooting.md) | Fix common problems |
| 17 | [🚀 Deployment Procedure](docs/17-deployment-procedure.md) | Redeploy after code changes |
| 18 | [✅ Final Validation](docs/18-final-validation.md) | Complete checklist |

---

## 📁 Project Structure

```
.
├── 📁 linux-server-project/   # 🛠️ Application code
│   ├── 📁 frontend/           # 🎨 React app
│   └── 📁 backend/            # ⚡ Node.js/Express API
├── 📁 docs/                   # 📚 The 18 deployment guides
│   └── 📁 screenshots/        # 📸 Proof-of-work screenshots
├── 🖼️ linux server and web deployement architecture.png
├── 🔒 .env.example            # 📝 Environment variable template
├── 🙈 .gitignore
└── 📖 README.md
```

---

## 🎓 What You'll Learn

```
🛠️  App Creation     — Build a full-stack app from scratch
☁️  AWS EC2          — Launch and manage a cloud server
🐧  Linux            — Navigate and configure an Ubuntu server
🔐  SSH              — Connect securely to a remote server
🐙  Git/GitHub       — Deploy code from repository to server
⚡  Node.js          — Run a backend API on the server
🎨  React            — Build and serve a frontend with Nginx
🐘  PostgreSQL       — Set up a relational database
🔄  systemd          — Manage application processes
🔒  HTTPS            — Secure traffic with SSL certificates
🔥  Firewall         — Protect your server with UFW
📊  Logs             — Monitor and troubleshoot issues
```

---

## 🏗️ Architecture Diagram

![Architecture](linux%20server%20and%20web%20deployement%20architecture.png)

---

## ⚡ Quick Start

```bash
# 1️⃣ Clone this guide
git clone https://github.com/YOUR_USERNAME/linux-server-project.git
cd linux-server-project

# 2️⃣ Start with Guide 01 — Create Your App
# Follow docs/01-app-creation.md
```

---

## 📝 License

This is a learning project. Use it to build your DevOps skills! 🚀
