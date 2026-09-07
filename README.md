# 🚀 Linux Server & Web Server Deployment

> **Last Updated:** September 7, 2026

## 🎯 Project Overview

Deploy a **full-stack web application** on AWS EC2 — from zero to production.

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
| 1 | [Project Setup](docs/01-project-setup.md) | 🏗️ Understand the project and prepare |
| 2 | [AWS EC2 Setup](docs/02-aws-ec2-setup.md) | ☁️ Create your cloud server |
| 3 | [SSH Connection](docs/03-ssh-connection.md) | 🔐 Connect to your server |
| 4 | [Linux Server Setup](docs/04-linux-server-setup.md) | 🐧 Install software and configure |
| 5 | [GitHub & App Setup](docs/05-github-and-application-setup.md) | 📦 Get code on the server |
| 6 | [Node.js Backend](docs/06-nodejs-backend-deployment.md) | ⚡ Deploy and test the API |
| 7 | [PostgreSQL](docs/07-postgresql-setup.md) | 🐘 Database setup |
| 8 | [React Frontend](docs/08-react-frontend-deployment.md) | 🎨 Build and serve the frontend |
| 9 | [Nginx](docs/09-nginx-configuration.md) | 🔷 Web server & reverse proxy |
| 10 | [DNS](docs/10-dns-configuration.md) | 🌍 Domain name setup |
| 11 | [HTTPS/SSL](docs/11-https-ssl-setup.md) | 🔒 Encrypt traffic |
| 12 | [Firewall & Security](docs/12-firewall-and-security.md) | 🔥 Lock it down |
| 13 | [systemd Service](docs/13-systemd-application-service.md) | 🔄 Auto-start on boot |
| 14 | [Logs & Monitoring](docs/14-logs-and-monitoring.md) | 📊 Watch what's happening |
| 15 | [Troubleshooting](docs/15-troubleshooting.md) | 🔧 Fix common problems |
| 16 | [Deployment Procedure](docs/16-deployment-procedure.md) | 🚀 Redeploy after code changes |
| 17 | [Final Validation](docs/17-final-validation.md) | ✅ Complete checklist |

---

## 📁 Project Structure

```
linux-server-project/
├── 📁 frontend/          # 🎨 React app
├── 📁 backend/           # ⚡ Node.js/Express API
├── 📁 nginx/             # 🔷 Nginx config files
├── 📁 systemd/           # 🔄 systemd service files
├── 📁 scripts/           # 🛠️ Deployment scripts
├── 📁 docs/              # 📚 This guide
├── 🔒 .env.example       # 📝 Environment variable template
├── 🙈 .gitignore
└── 📖 README.md
```

---

## 🎓 What You'll Learn

```
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

# 2️⃣ Follow the docs in order
# Start with docs/01-project-setup.md
```

---

## 📝 License

This is a learning project. Use it to build your DevOps skills! 🚀
