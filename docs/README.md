# 📚 Deployment Guide

> **Last Updated:** September 7, 2026
> **Version:** 2.0

---

## 🎯 What This Guide Does

Takes you from **zero** to a **fully deployed** full-stack application on AWS EC2 — including **building the app from scratch**.

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

## 🎓 Before You Start

### ✅ Prerequisites

```text
[ ] 💻 Local computer with terminal
[ ] 📦 Node.js installed locally (v18+ or v20+)
[ ] 🐙 GitHub account
[ ] ☁️ AWS Account (with billing enabled)
[ ] 🌍 Domain name (optional — can use IP address initially)
```

### 🧠 What You Will Learn

| Skill | Description |
|-------|-------------|
| 🛠️ App Creation | Build a React + Node.js app from scratch |
| ☁️ AWS EC2 | Launch and manage a cloud server |
| 🐧 Linux | Navigate and configure an Ubuntu server |
| 🔐 SSH | Connect securely to a remote server |
| 🐙 Git/GitHub | Deploy code from repository to server |
| ⚡ Node.js | Run a backend API on the server |
| 🎨 React | Build and serve a frontend with Nginx |
| 🐘 PostgreSQL | Set up a relational database |
| 🔷 Nginx | Configure a web server and reverse proxy |
| 🌍 DNS | Point a domain to your server |
| 🔒 HTTPS | Secure traffic with SSL certificates |
| 🔥 Firewall | Protect your server with UFW |
| 🔄 systemd | Manage application processes |
| 📊 Logs | Monitor and troubleshoot issues |

---

## 📖 Guide Order

**Follow these in order.** Each guide builds on the previous one:

| # | 📖 Guide | 🎯 What You Do | ⏱️ Est. Time |
|---|---------|----------------|--------------|
| 1 | [🛠️ Create Your App](01-app-creation.md) | Build React + Node.js app from scratch | ~30 min |
| 2 | [🏗️ Project Setup](02-project-setup.md) | Understand the project and prepare | ~10 min |
| 3 | [☁️ AWS EC2 Setup](03-aws-ec2-setup.md) | Create your cloud server | ~15 min |
| 4 | [🔐 SSH Connection](04-ssh-connection.md) | Connect to your server | ~5 min |
| 5 | [🐧 Linux Server Setup](05-linux-server-setup.md) | Install software and configure | ~20 min |
| 6 | [🐙 GitHub & Application Setup](06-github-and-application-setup.md) | Get code on the server | ~10 min |
| 7 | [⚡ Node.js Backend](07-nodejs-backend-deployment.md) | Deploy and test the API | ~15 min |
| 8 | [🐘 PostgreSQL](08-postgresql-setup.md) | Set up the database | ~15 min |
| 9 | [🎨 React Frontend](09-react-frontend-deployment.md) | Build and serve the frontend | ~10 min |
| 10 | [🔷 Nginx](10-nginx-configuration.md) | Configure web server and reverse proxy | ~15 min |
| 11 | [🌍 DNS](11-dns-configuration.md) | Point your domain to the server | ~10 min |
| 12 | [🔒 HTTPS/SSL](12-https-ssl-setup.md) | Enable HTTPS with Let's Encrypt | ~10 min |
| 13 | [🔥 Firewall & Security](13-firewall-and-security.md) | Lock down the server | ~10 min |
| 14 | [🔄 systemd Service](14-systemd-application-service.md) | Auto-start the app on boot | ~10 min |
| 15 | [📊 Logs & Monitoring](15-logs-and-monitoring.md) | Watch and debug | ~10 min |
| 16 | [🔧 Troubleshooting](16-troubleshooting.md) | Fix common problems | ~20 min |
| 17 | [🚀 Deployment Procedure](17-deployment-procedure.md) | Redeploy after code changes | ~15 min |
| 18 | [✅ Final Validation](18-final-validation.md) | Complete checklist | ~15 min |

**Total estimated time:** ~4 hours (including hands-on practice)

---

## 🎯 How to Use This Guide

```text
1️⃣  Start with Guide 01 — Create Your App (build the application locally)
2️⃣  Push to GitHub
3️⃣  Follow guides 02-18 to deploy on AWS EC2
4️⃣  Run the commands shown, verify each step
5️⃣  Use the ✅ checkpoints to confirm progress
6️⃣  If something fails, check the 🔧 Troubleshooting guide (16)
```

> **⚠️ Rule:** Never skip a verification step. If a command fails, fix it before continuing.

---

## 📊 Progress Tracker

Use this to track your progress:

```text
Phase 1: Build App        [ ] Guide 01 — Create React + Node.js app
Phase 2: Infrastructure   [ ] Guides 02-04 — AWS EC2 + SSH
Phase 3: Server Setup     [ ] Guides 05-06 — Linux + Software + GitHub
Phase 4: Application      [ ] Guides 07-09 — Backend + Database + Frontend
Phase 5: Web Server       [ ] Guide 10 — Nginx
Phase 6: Security         [ ] Guides 11-13 — DNS + HTTPS + Firewall
Phase 7: Operations       [ ] Guides 14-15 — systemd + Logs
Phase 8: Validation       [ ] Guides 16-18 — Troubleshooting + Deploy + Checklist
```

---

## 🆘 Getting Help

If you get stuck:

1. 📖 Check the [🔧 Troubleshooting Guide](16-troubleshooting.md) first
2. 🔍 Look for the error message in the relevant guide's troubleshooting section
3. 💬 Ask for help with the specific error message you're seeing
