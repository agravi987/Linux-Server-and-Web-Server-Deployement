# 📚 Deployment Guide

> **Last Updated:** September 7, 2026
> **Version:** 1.0

---

## 🎯 What This Guide Does

Takes you from **zero** to a **fully deployed** full-stack application on AWS EC2:

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
[ ] ☁️  AWS Account (with billing enabled)
[ ] 🌍 Domain name (optional — can use IP address initially)
[ ] 🐙 Your application code in a GitHub repository
[ ] 💻 Local computer with terminal/SSH access
```

### 🧠 What You Will Learn

| Skill | Description |
|-------|-------------|
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
| 1 | [🏗️ Project Setup](01-project-setup.md) | Understand the project and prepare | ~10 min |
| 2 | [☁️ AWS EC2 Setup](02-aws-ec2-setup.md) | Create your cloud server | ~15 min |
| 3 | [🔐 SSH Connection](03-ssh-connection.md) | Connect to your server | ~5 min |
| 4 | [🐧 Linux Server Setup](04-linux-server-setup.md) | Install software and configure | ~20 min |
| 5 | [🐙 GitHub & Application Setup](05-github-and-application-setup.md) | Get code on the server | ~10 min |
| 6 | [⚡ Node.js Backend](06-nodejs-backend-deployment.md) | Deploy and test the API | ~15 min |
| 7 | [🐘 PostgreSQL](07-postgresql-setup.md) | Set up the database | ~15 min |
| 8 | [🎨 React Frontend](08-react-frontend-deployment.md) | Build and serve the frontend | ~10 min |
| 9 | [🔷 Nginx](09-nginx-configuration.md) | Configure web server and reverse proxy | ~15 min |
| 10 | [🌍 DNS](10-dns-configuration.md) | Point your domain to the server | ~10 min |
| 11 | [🔒 HTTPS/SSL](11-https-ssl-setup.md) | Enable HTTPS with Let's Encrypt | ~10 min |
| 12 | [🔥 Firewall & Security](12-firewall-and-security.md) | Lock down the server | ~10 min |
| 13 | [🔄 systemd Service](13-systemd-application-service.md) | Auto-start the app on boot | ~10 min |
| 14 | [📊 Logs & Monitoring](14-logs-and-monitoring.md) | Watch and debug | ~10 min |
| 15 | [🔧 Troubleshooting](15-troubleshooting.md) | Fix common problems | ~20 min |
| 16 | [🚀 Deployment Procedure](16-deployment-procedure.md) | Redeploy after code changes | ~15 min |
| 17 | [✅ Final Validation](17-final-validation.md) | Complete checklist | ~15 min |

**Total estimated time:** ~3 hours (including hands-on practice)

---

## 🎯 How to Use This Guide

```text
1️⃣  Follow each section in order
2️⃣  Run the commands shown
3️⃣  Verify each step before moving on
4️⃣  Use the ✅ checkpoints to confirm progress
5️⃣  If something fails, check the 🔧 Troubleshooting guide (15)
```

> **⚠️ Rule:** Never skip a verification step. If a command fails, fix it before continuing.

---

## 🆘 Getting Help

If you get stuck:

1. 📖 Check the [Troubleshooting Guide](15-troubleshooting.md) first
2. 🔍 Look for the error message in the relevant guide's troubleshooting section
3. 💬 Ask for help with the specific error message you're seeing

---

## 📊 Progress Tracker

Use this to track your progress:

```text
Phase 1: Infrastructure    [ ] AWS EC2 + SSH
Phase 2: Server Setup      [ ] Linux + Software
Phase 3: Application       [ ] Code + Database
Phase 4: Web Server        [ ] Nginx + Frontend
Phase 5: Security          [ ] DNS + HTTPS + Firewall
Phase 6: Operations        [ ] systemd + Logs
Phase 7: Validation        [ ] Final Checklist
```
