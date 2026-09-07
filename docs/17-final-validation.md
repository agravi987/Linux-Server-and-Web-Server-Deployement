# 17 — ✅ Final Validation

> **Last Updated:** September 7, 2026

---

## 🎯 Goal

Verify every component of the deployment is working correctly.

📝 Run through this entire checklist. Mark each item as you verify it.

---

## ☁️ AWS

```text
[ ] ☁️ EC2 instance is running
[ ] 💻 Instance type is t2.micro (or chosen type)
[ ] 🐧 Ubuntu 24.04 LTS is installed
[ ] 🛡️ Security Group allows: SSH (22), HTTP (80), HTTPS (443)
[ ] 🔒 Security Group blocks: Node.js (3000), PostgreSQL (5432)
[ ] 📍 Public IPv4 address is assigned
[ ] 🔑 Key pair (.pem) is saved securely
```

**🔍 Verify:**

```bash
# 🖥️ From the server
curl http://169.254.169.254/latest/meta-data/public-ipv4
```

---

## 🐧 Linux

```text
[ ] 📦 System packages are updated (apt update && apt upgrade)
[ ] 👤 Correct user (ubuntu) with correct permissions
[ ] 📦 Required services installed: Git, Node.js, npm, PostgreSQL, Nginx
[ ] ⚡ Node.js version is 20.x or higher
[ ] 🐘 PostgreSQL is installed and running
[ ] 🔷 Nginx is installed and running
```

**🔍 Verify:**

```bash
git --version
node --version
npm --version
systemctl status postgresql
systemctl status nginx
```

---

## ⚡ Application

```text
[ ] 🐙 Code is cloned from GitHub
[ ] 🔐 .env file is configured with real values
[ ] 🙈 .env is NOT committed to Git
[ ] 📦 Backend dependencies installed
[ ] 📦 Frontend dependencies installed
[ ] 🏗️ Frontend is built for production
[ ] ⚡ Backend starts and responds on port 3000
[ ] 🐘 Database connection works
[ ] 🏗️ Migrations are up to date
```

**🔍 Verify:**

```bash
cd ~/YOUR_REPO/backend
curl http://localhost:3000

# 🙈 Check .env is not tracked
cd ~/YOUR_REPO
git status | grep .env
# Should return nothing
```

---

## 🔷 Nginx

```text
[ ] 📄 Configuration file exists at /etc/nginx/sites-available/myapp
[ ] ✅ nginx -t passes (syntax is valid)
[ ] 🗑️ Default config is removed
[ ] ⚡ Reverse proxy forwards /api/* to Node.js
[ ] 🎨 React static files are served from /var/www/myapp/
[ ] 🔄 try_files directive exists for React routing
[ ] 🌍 server_name matches your domain
```

**🔍 Verify:**

```bash
sudo nginx -t
curl -I https://yourdomain.com
curl https://yourdomain.com/api/health
```

---

## 🌍 DNS

```text
[ ] 🌍 A record points domain to EC2 public IP
[ ] 🌐 www subdomain also resolves (optional)
[ ] 🔍 nslookup returns correct IP
[ ] 🎨 Website loads in browser at http://yourdomain.com
```

**🔍 Verify:**

```bash
nslookup yourdomain.com
dig yourdomain.com
```

---

## 🔒 HTTPS

```text
[ ] 🔒 SSL certificate is installed
[ ] 🔒 https://yourdomain.com loads with 🔒 padlock
[ ] 🔄 HTTP redirects to HTTPS (301)
[ ] ⏰ Certificate auto-renewal is configured
[ ] 🧪 certbot renew --dry-run succeeds
```

**🔍 Verify:**

```bash
curl -I http://yourdomain.com    # 🔄 Should return 301
curl -I https://yourdomain.com   # ✅ Should return 200
sudo certbot renew --dry-run
```

---

## 🔥 Security

```text
[ ] 🔥 UFW firewall is active
[ ] 🔐 SSH (22) is allowed
[ ] 🌐 HTTP (80) is allowed
[ ] 🔒 HTTPS (443) is allowed
[ ] ⚡ Node.js (3000) is NOT publicly exposed
[ ] 🐘 PostgreSQL (5432) is NOT publicly exposed
[ ] 🔐 SSH access is restricted to "My IP" in AWS Security Group
[ ] 🙈 .env file is not committed to Git
[ ] 🔐 Database password is strong and unique
```

**🔍 Verify:**

```bash
sudo ufw status
sudo ss -lntp
```

Expected ports:

```text
0.0.0.0:22     → 🔐 SSH
0.0.0.0:80     → 🌐 HTTP
0.0.0.0:443    → 🔒 HTTPS
127.0.0.1:3000 → ⚡ Node.js (local only)
127.0.0.1:5432 → 🐘 PostgreSQL (local only)
```

---

## 🔄 systemd

```text
[ ] 📄 Service file exists at /etc/systemd/system/myapp.service
[ ] 🟢 Service is active (running)
[ ] 🔄 Service is enabled on boot
[ ] 🔄 Application restarts after manual stop/start
[ ] 🔄 Application starts after server reboot
```

**🔍 Verify:**

```bash
sudo systemctl status myapp
sudo systemctl is-enabled myapp

# 🧪 Test restart
sudo systemctl stop myapp
sudo systemctl start myapp
sudo systemctl status myapp
```

---

## 📊 Logs

```text
[ ] 📊 Nginx access logs accessible
[ ] ⚠️ Nginx error logs accessible
[ ] 📝 Application logs accessible via journalctl
[ ] 🐘 PostgreSQL logs accessible
```

**🔍 Verify:**

```bash
sudo tail /var/log/nginx/access.log
sudo tail /var/log/nginx/error.log
sudo journalctl -u myapp -n 10
sudo tail /var/log/postgresql/postgresql-16-main.log
```

---

## 🔄 Reboot Test

```text
[ ] 🔄 Server rebooted successfully
[ ] ⚙️ All services started after reboot
[ ] 🎨 Website loads after reboot
[ ] ⚡ API works after reboot
```

**🔍 Verify:**

```bash
# 🔄 Reboot
sudo reboot

# ⏳ Wait 60 seconds, then reconnect
ssh -i ~/Downloads/myapp-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

# ⚙️ Check services
sudo systemctl status myapp
sudo systemctl status nginx
sudo systemctl status postgresql

# 🧪 Test website
curl -I https://yourdomain.com
curl https://yourdomain.com/api/health
```

---

## 🎉 Summary

If all boxes are checked, your deployment is complete and production-ready:

```
╔═══════════════════════════════════════════════════════╗
║            🎉 DEPLOYMENT COMPLETE 🎉                  ║
║                                                       ║
║  🌐 Website:    https://yourdomain.com                ║
║  ⚡ API:        https://yourdomain.com/api            ║
║  📍 Server:     YOUR_EC2_PUBLIC_IP                    ║
║  🐧 OS:         Ubuntu 24.04 LTS                      ║
║  🔷 Web Server: Nginx with HTTPS                      ║
║  ⚡ Backend:    Node.js / Express                     ║
║  🐘 Database:   PostgreSQL                            ║
║  🔥 Firewall:   UFW (22, 80, 443)                    ║
║  🔄 Process:    systemd (auto-start)                  ║
║  🔒 SSL:        Let's Encrypt (auto-renew)            ║
║                                                       ║
║            ✅ All systems operational.                ║
╚═══════════════════════════════════════════════════════╝
```

---

## 🎯 Next Steps

Now that the server is running, consider:

```text
[ ] 📊 Set up log rotation to prevent disk filling
[ ] 💾 Configure automatic backups for PostgreSQL
[ ] 🧪 Set up a staging environment
[ ] 📈 Add monitoring (Uptime Robot, etc.)
[ ] 📝 Document your specific deployment steps
[ ] 🔄 Practice the deployment procedure
```

---

## 🎉 Done

Congratulations — you have deployed a full-stack application on AWS EC2 with Linux, Nginx, Node.js, PostgreSQL, HTTPS, and systemd! 🚀

> 🎓 You now have hands-on experience with:
> - ☁️ Cloud infrastructure (AWS EC2)
> - 🐧 Linux server administration
> - 🔐 SSH and security
> - 🐙 Git and deployment workflows
> - ⚡ Node.js backend management
> - 🐘 Database administration
> - 🔷 Web server configuration
> - 🔒 SSL/TLS certificates
> - 🔄 Process management with systemd
> - 📊 Monitoring and troubleshooting
>
> **Keep building. Keep learning. Keep shipping!** 🚀
