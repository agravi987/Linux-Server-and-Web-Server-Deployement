# 09 — 🔷 Nginx Configuration

> **Last Updated:** September 7, 2026

---

## 🎯 Goal

Configure Nginx to serve the React frontend and proxy API requests to Node.js.

## ✅ Prerequisites

```text
[ ] 🔷 Nginx installed (from 04-linux-server-setup.md)
[ ] 🎨 React frontend built (from 08-react-frontend-deployment.md)
[ ] ⚡ Node.js backend runs on port 3000 (from 06-nodejs-backend-deployment.md)
```

## 💡 How Nginx Works

```
🌐 Browser
   ↓
🔷 Nginx :80/:443
   ├── /           → 🎨 Serves React (static files from /var/www/myapp/)
   └── /api/*      → ⚡ Proxies to Node.js on port 3000
```

Nginx is a **reverse proxy** — it sits between the browser and your application, forwarding requests to the right place.

---

## 📝 Step 1 — Create a New Nginx Configuration File

```bash
sudo nano /etc/nginx/sites-available/myapp
```

---

## 📝 Step 2 — Add the Configuration

Paste the following:

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN www.YOUR_DOMAIN;

    root /var/www/myapp;
    index index.html;

    # 🎨 Serve React — handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # ⚡ Proxy API requests to Node.js
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 🛡️ Disable access to hidden files
    location ~ /\. {
        deny all;
    }
}
```

> 💡 Replace `YOUR_DOMAIN` with your domain name, or use the EC2 public IP for now.

### 💡 What each part does:

```text
listen 80           →  🔊 Listen on port 80 (HTTP)
server_name         →  🌍 Your domain name
root                →  📁 Where static files are stored
try_files           →  🎨 Serve static files, fallback to index.html (React routing)
proxy_pass          →  ⚡ Forward /api/* to Node.js on port 3000
proxy_set_header    →  📡 Pass useful headers to Node.js
```

---

## 📝 Step 3 — Remove the Default Configuration

```bash
sudo rm /etc/nginx/sites-enabled/default
```

**💡 Why:** The default config also uses port 80 and would conflict.

---

## 📝 Step 4 — Enable Your Configuration

```bash
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/myapp
```

---

## 📝 Step 5 — Test the Configuration

```bash
sudo nginx -t
```

Expected result:

```text
✅ nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
✅ nginx: configuration file /etc/nginx/nginx.conf test is successful
```

> ⚠️ If you see errors, go back and fix the configuration file.

---

## 📝 Step 6 — Reload Nginx

```bash
sudo systemctl reload nginx
```

**💡 Why:** `reload` applies the new configuration without dropping connections. `restart` would briefly stop the server.

---

## 📝 Step 7 — Verify

### 7.1 ⚡ Start the backend (if not running)

```bash
cd ~/YOUR_REPO/backend
npm start &
```

### 7.2 🧪 Test the frontend

From your local computer:

```bash
curl -I http://YOUR_EC2_PUBLIC_IP
```

Expected:

```text
HTTP/1.1 200 OK
Server: nginx/1.x.x
```

### 7.3 🧪 Test the API proxy

```bash
curl http://YOUR_EC2_PUBLIC_IP/api/health
```

or

```bash
curl http://YOUR_EC2_PUBLIC_IP/api
```

Expected: A response from your Node.js backend. ⚡

### 7.4 🌐 Open in browser

Go to:

```text
http://YOUR_EC2_PUBLIC_IP
```

You should see your React application. 🎨

---

## ✅ Checkpoint

At this point:

```text
[✓] 🔷 Nginx configuration file created
[✓] 🗑️ Default config removed
[✓] 🔗 Configuration enabled
[✓] ✅ nginx -t passes
[✓] 🔄 Nginx reloaded
[✓] 🎨 React frontend loads at http://YOUR_EC2_PUBLIC_IP
[✓] ⚡ API requests proxy to Node.js
```

> 🎉 If all checks pass, continue to: [🌍 DNS Configuration](10-dns-configuration.md).

---

## 🔧 Troubleshooting

### ❓ "nginx -t shows syntax error"

Read the error message carefully. Common issues:

- ❌ Missing semicolons
- ❌ Unclosed braces
- ❌ Typos in directives

Edit the file and fix:

```bash
sudo nano /etc/nginx/sites-available/myapp
```

### ❓ "502 Bad Gateway"

⚡ Node.js is not running or Nginx can't reach it.

```bash
# 🔍 Check if Node.js is running
ps aux | grep node

# 🔌 Check if port 3000 is listening
ss -lntp | grep 3000

# 🧪 Test Node.js directly
curl http://localhost:3000
```

### ❓ "403 Forbidden"

Nginx doesn't have permission to read the files.

```bash
sudo chown -R www-data:www-data /var/www/myapp
sudo chmod -R 755 /var/www/myapp
```

### ❓ "404 Not Found"

The `root` path in the Nginx config doesn't match where the files are.

```bash
ls /var/www/myapp/
```

Should show `index.html`.

### ❓ "React shows blank page or 404 on refresh"

You need the `try_files` directive. Make sure this is in your config:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

## 🎉 Done

Nginx is configured to serve the React frontend and proxy API requests to Node.js. Next, you will configure DNS to point a domain to your server. 🌍
