# 📸 Proof-of-Work Screenshots

Screenshots captured while following the deployment guides. Each file is named `<guide-number>-<what-it-shows>.png` and is referenced from the matching guide.

| File | Guide | What it shows |
|------|-------|---------------|
| `03-ec2-instance-running.png` | [03 — AWS EC2 Setup](../03-aws-ec2-setup.md) | EC2 instance in `Running` state |
| `03-security-group-inbound-rules.png` | [03 — AWS EC2 Setup](../03-aws-ec2-setup.md) | Security group inbound rules (SSH, HTTP, HTTPS) |
| `04-ssh-login-ubuntu.png` | [04 — SSH Connection](../04-ssh-connection.md) | Successful SSH login and `lsb_release -a` output |
| `05-nginx-welcome-page.png` | [05 — Linux Server Setup](../05-linux-server-setup.md) | Nginx welcome page at the EC2 public IP |
| `07-backend-health-and-port-3000.png` | [07 — Node.js Backend Deployment](../07-nodejs-backend-deployment.md) | `/api/health` response and Node.js listening on port 3000 |
| `09-frontend-build-in-webroot.png` | [09 — React Frontend Deployment](../09-react-frontend-deployment.md) | Build output copied to `/var/www/myapp/` |
| `10-react-app-working.png` | [10 — Nginx Configuration](../10-nginx-configuration.md) | React app loading through Nginx |

## 📝 Naming Convention

When adding a new screenshot:

```text
<guide-number>-<short-kebab-case-description>.png
```

Examples: `11-dns-a-record.png`, `12-https-padlock.png`, `14-systemd-status-running.png`
