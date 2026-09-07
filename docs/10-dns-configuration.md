# 10 — 🌍 DNS Configuration

> **Last Updated:** September 7, 2026

---

## 🎯 Goal

Point a domain name to your EC2 server's public IP address.

## ✅ Prerequisites

```text
[ ] 🔷 Nginx is configured and serving your app (from 09-nginx-configuration.md)
[ ] 🌍 A domain name (registered at a registrar like Namecheap, GoDaddy, Google Domains, etc.)
```

## 💡 What is DNS?

DNS (Domain Name System) maps a human-readable domain name to an IP address.

```
🌍 yourdomain.com
      ↓
   🔍 DNS lookup
      ↓
📍 EC2 Public IP: 54.123.45.67
```

When someone types `yourdomain.com`, DNS resolves it to your server's IP address.

---

## 📝 Step 1 — Get Your EC2 Public IP

```bash
# 🖥️ On the server
curl http://169.254.169.254/latest/meta-data/public-ipv4
```

Or check the AWS Console → EC2 → Instances → your instance → Public IPv4 address.

📝 Write it down:

```text
YOUR_EC2_PUBLIC_IP = __.__.__.__
```

---

## 📝 Step 2 — Log In to Your DNS Provider

🔐 Log in to wherever you bought your domain (Namecheap, GoDaddy, Google Domains, Cloudflare, etc.).

---

## 📝 Step 3 — Create an A Record

An **A record** maps a domain name to an IP address.

In your DNS provider's dashboard:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| 🌍 A | @ | YOUR_EC2_PUBLIC_IP | 300 |

Explanation:

```text
Type:   🌍 A         →  Maps to an IP address
Name:   @         →  Root domain (yourdomain.com)
Value:  📍 IP        →  Your EC2 public IP
TTL:    ⏱️ 300       →  300 seconds (5 minutes) — how long DNS caches this record
```

If you want `www.yourdomain.com` as well, add another record:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| 🌍 A | www | YOUR_EC2_PUBLIC_IP | 300 |

---

## 📝 Step 4 — Update Nginx Server Name

Edit the Nginx configuration to use your domain:

```bash
sudo nano /etc/nginx/sites-available/myapp
```

Update `server_name`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    ...
}
```

Test and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 📝 Step 5 — Wait for DNS Propagation

⏳ DNS changes can take 5 minutes to 48 hours to propagate worldwide.

### 🔍 Check if DNS has propagated

**From your local computer:**

```bash
nslookup yourdomain.com
```

Expected result:

```text
Server:     XX.XX.XX.XX
Address:    XX.XX.XX.XX#53

Non-authoritative answer:
Name:   yourdomain.com
Address: YOUR_EC2_PUBLIC_IP
```

**Or use dig:**

```bash
dig yourdomain.com
```

Look for the **ANSWER SECTION**:

```text
;; ANSWER SECTION:
yourdomain.com.    300    IN    A    YOUR_EC2_PUBLIC_IP
```

---

## 📝 Step 6 — Test in Browser

🌐 Open your browser and go to:

```text
http://yourdomain.com
```

You should see your React application. 🎨

---

## 📝 Step 7 — Test the API

```bash
curl http://yourdomain.com/api/health
```

Expected: A response from your Node.js backend. ⚡

---

## 📝 Without a Domain

If you don't have a domain yet, everything works with just the IP address:

```text
http://YOUR_EC2_PUBLIC_IP
http://YOUR_EC2_PUBLIC_IP/api/health
```

You can configure DNS later without any changes to the application.

---

## ✅ Checkpoint

At this point:

```text
[✓] 🌍 A record created in DNS
[✓] 📍 Domain resolves to EC2 public IP
[✓] 🔷 Nginx updated with server_name
[✓] 🎨 http://yourdomain.com loads the app
[✓] ⚡ API works at /api/*
```

> 🎉 If all checks pass, continue to: [🔒 HTTPS/SSL Setup](11-https-ssl-setup.md).

---

## 🔧 Troubleshooting

### ❓ "Domain doesn't resolve"

1. ⏳ Wait — DNS propagation can take time
2. ✅ Check the A record is correct in your DNS provider
3. 🔍 Try with a different DNS server:

```bash
nslookup yourdomain.com 8.8.8.8
```

4. 🌐 Use https://dnschecker.org to check propagation worldwide

### ❓ "My registrar doesn't show DNS settings"

Some registrars use separate nameservers. You may need to:

1. ☁️ Use Cloudflare (free) as your DNS provider
2. 🌐 Or configure nameservers at your registrar to point to AWS Route 53

### ❓ "Nginx shows default page instead of my app"

Make sure you removed the default config:

```bash
sudo rm /etc/nginx/sites-enabled/default
sudo systemctl reload nginx
```

### ❓ "The IP address works but the domain doesn't"

⏳ DNS hasn't propagated yet. Wait or use https://dnschecker.org to check.

---

## 🎉 Done

Your domain points to your EC2 server. Next, you will enable HTTPS with a free SSL certificate. 🔒
