# 11 — 🔒 HTTPS / SSL Setup

> **Last Updated:** September 7, 2026

---

## 🎯 Goal

Enable HTTPS on your server using a free SSL certificate from Let's Encrypt.

## ✅ Prerequisites

```text
[ ] 🌍 DNS configured and domain resolves to your server (from 10-dns-configuration.md)
[ ] 🔷 Nginx is serving your application on port 80
```

## 💡 What is HTTPS?

HTTPS encrypts communication between the browser and the server using TLS (Transport Layer Security). Without it, data (including passwords) can be intercepted.

```text
🌐 HTTP  :80   →  ⚠️ Unencrypted (dangerous)
🔒 HTTPS :443  →  ✅ Encrypted (secure)
```

> 💡 Let's Encrypt provides free SSL certificates that are trusted by all browsers.

---

## 📝 Step 1 — Install Certbot

Certbot is the tool that obtains and installs Let's Encrypt certificates.

```bash
sudo apt install certbot python3-certbot-nginx -y
```

> 💡 The `python3-certbot-nginx` plugin automatically configures Nginx for you.

---

## 📝 Step 2 — Obtain the Certificate

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot will:

1. ✅ Verify you own the domain (via DNS or HTTP challenge)
2. 📥 Download the SSL certificate
3. 🔷 Automatically configure Nginx

Follow the prompts:

```text
📧 Enter email address: your-email@example.com
```

```text
📜 (A)gree to Terms of Service: A
```

```text
📧 Share email with EFF: N (or Y, your choice)
```

```text
🔢 Select the appropriate number:
1. No redirect
2. 🔒 Redirect (recommended) → Select 2
```

> 💡 Option 2 automatically redirects all HTTP traffic to HTTPS.

---

## 📝 Step 3 — Verify HTTPS is Working

```bash
sudo nginx -t
```

Expected:

```text
✅ nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
```

Test from your local computer:

```bash
curl -I https://yourdomain.com
```

Expected result:

```text
🔒 HTTP/2 200
server: nginx/1.x.x
...
```

🌐 Open in browser:

```text
https://yourdomain.com
```

You should see the 🔒 padlock icon in the address bar.

> 📸 **Screenshot:** Capture the browser showing the 🔒 padlock icon and HTTPS URL in the address bar.

---

## 📝 Step 4 — Verify HTTP Redirect

```bash
curl -I http://yourdomain.com
```

Expected result:

```text
🔄 HTTP/1.1 301 Moved Permanently
Location: https://yourdomain.com/
```

> 💡 HTTP requests are automatically redirected to HTTPS.

---

## 📝 Step 5 — Check What Certbot Changed

Certbot automatically modified your Nginx configuration. View it:

```bash
cat /etc/nginx/sites-available/myapp
```

You should see new lines added:

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # ... rest of your config
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 📝 Step 6 — Certificate Auto-Renewal

Let's Encrypt certificates expire every 90 days. Certbot sets up automatic renewal.

### ✅ Verify auto-renewal is configured

```bash
sudo systemctl status certbot.timer
```

Expected:

```text
🟢 Active: active (waiting)
```

### 🧪 Test renewal (dry run)

```bash
sudo certbot renew --dry-run
```

Expected:

```text
🎉 Congratulations, all simulated renewals succeeded:
  /etc/letsencrypt/live/yourdomain.com/fullchain.pem (success)
```

> 💡 The `--dry-run` flag tests the renewal without actually renewing. It should succeed without errors.

---

## 📝 Step 7 — Verify SSL Certificate Details

```bash
echo | openssl s_client -connect yourdomain.com:443 -servername yourdomain.com 2>/dev/null | openssl x509 -noout -dates
```

Expected:

```text
🔒 notBefore=Sep 07 00:00:00 2026 GMT
🔒 notAfter=Dec 06 00:00:00 2026 GMT
```

---

## ✅ Checkpoint

At this point:

```text
[✓] 📦 Certbot installed
[✓] 🔒 SSL certificate obtained
[✓] 🔷 Nginx configured for HTTPS
[✓] 🔒 https://yourdomain.com loads with 🔒 padlock
[✓] 🔄 HTTP redirects to HTTPS
[✓] ⏰ Auto-renewal is configured
[✓] 🧪 Dry-run renewal works
```

> 📸 **Screenshot:** Capture the terminal showing `sudo certbot renew --dry-run` success output.

> 📸 **Screenshot:** Capture the terminal showing `curl -I http://yourdomain.com` returning 301 redirect to HTTPS.

> 🎉 If all checks pass, continue to: [🔥 Firewall & Security](12-firewall-and-security.md).

---

## 🔧 Troubleshooting

### ❓ "Certbot command not found"

Reinstall:

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### ❓ "Challenge failed" or "DNS problem"

Make sure your domain resolves to the server:

```bash
nslookup yourdomain.com
```

If it doesn't resolve, wait for DNS propagation or fix the A record.

### ❓ "Certificate already exists"

You may have already obtained a certificate. Check:

```bash
sudo certbot certificates
```

If the certificate exists, renew it:

```bash
sudo certbot renew
sudo systemctl reload nginx
```

### ❓ "SSL certificate error in browser"

The certificate may not be installed correctly. Re-run Certbot:

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### ❓ "Auto-renewal not working"

Check the timer:

```bash
sudo systemctl status certbot.timer
```

If not active:

```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

Or add a cron job:

```bash
sudo crontab -e
```

Add:

```text
⏰ 0 0,12 * * * certbot renew --quiet
```

---

## 🎉 Done

Your site is secured with HTTPS. 🔒 Next, you will configure the firewall to lock down the server. 🔥
