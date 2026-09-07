# 01 — 🛠️ Create Your Application

> **Last Updated:** September 7, 2026

---

## 🎯 Goal

Create a simple full-stack application with a React frontend and Node.js/Express backend, then push it to GitHub.

## ✅ Prerequisites

```text
[ ] 💻 Local computer (Windows, Mac, or Linux)
[ ] ⌨️ Terminal / command line access
[ ] 🐙 GitHub account
[ ] 📦 Node.js installed locally (v18+ or v20+)
```

### 📦 Check Node.js is installed locally

```bash
node --version
```

Expected: `v18.x.x` or `v20.x.x`

```bash
npm --version
```

Expected: `10.x.x` or similar

> 💡 If not installed, download from https://nodejs.org

---

## 📋 What We Are Building

```
👤 User visits yourdomain.com
  ↓
🎨 React Frontend (port 80/443)
  ↓  /api/*
⚡ Node.js/Express Backend (port 3000)
  ↓
🐘 PostgreSQL Database (port 5432)
```

**Simple features:**

```text
🎨 Frontend: React app with a form that sends data to the API
⚡ Backend:  Express API with a /api/health and /api/contact endpoint
🐘 Database: PostgreSQL table to store form submissions
```

---

## 📝 Step 1 — Create the Project Folder

Open your terminal on your **local computer** (not the server).

```bash
mkdir linux-server-project
cd linux-server-project
```

---

## 📝 Step 2 — Initialize Git

```bash
git init
```

---

## 📝 Step 3 — Create the Backend (Node.js/Express)

### 3.1 📁 Create the backend folder

```bash
mkdir backend
cd backend
```

### 3.2 📦 Initialize Node.js project

```bash
npm init -y
```

### 3.3 📥 Install dependencies

```bash
npm install express pg cors dotenv
```

**What each package does:**

```text
express  →  Web framework for the API
pg       →  PostgreSQL client for Node.js
cors     →  Allows the frontend to call the API
dotenv   →  Loads environment variables from .env
```

### 3.4 📝 Create the main server file

Create a file called `src/index.js`:

```bash
mkdir src
```

**Instructions — build this yourself:**

```text
Create src/index.js with these requirements:

1. Import express, pg (Pool), cors, dotenv
2. Load dotenv config
3. Create an Express app
4. Use cors() middleware
5. Use express.json() middleware
6. Create a PostgreSQL pool using DATABASE_URL from .env

7. Create route: GET /api/health
   - Returns { status: "ok", timestamp: new Date() }

8. Create route: POST /api/contact
   - Expects JSON body: { name, email, message }
   - Inserts into PostgreSQL "contacts" table
   - Returns { success: true, id: result.rows[0].id }
   - On error returns { success: false, error: message }

9. Create route: GET /api/contacts
   - Queries all rows from "contacts" table
   - Returns { contacts: result.rows }

10. Start server on PORT from .env (default 3000)
    - Log: "Server running on port XXXX"
```

### 3.5 📝 Create the database migration file

Create `src/init-db.js`:

**Instructions — build this yourself:**

```text
Create src/init-db.js with these requirements:

1. Import pg (Pool) and dotenv
2. Load dotenv config
3. Create a PostgreSQL pool using DATABASE_URL

4. Create SQL query:
   CREATE TABLE IF NOT EXISTS contacts (
     id SERIAL PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     email VARCHAR(100) NOT NULL,
     message TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   )

5. Run the query
6. Log "Database table created successfully"
7. Close the pool
```

### 3.6 📝 Update package.json scripts

Edit `package.json` and add/modify the scripts section:

```json
"scripts": {
  "start": "node src/index.js",
  "dev": "node --watch src/index.js",
  "init-db": "node src/init-db.js"
}
```

> 💡 `node --watch` auto-restarts on file changes (Node.js 18+).

### 3.7 📝 Create the .env file

```bash
cp ../../.env.example .env
```

Wait — the `.env.example` is in the root. Let's create it manually:

```bash
cat > .env << 'EOF'
PORT=3000
DATABASE_URL=postgresql://myapp_user:YOUR_DB_PASSWORD@localhost:5432/myapp_db
NODE_ENV=development
EOF
```

> ⚠️ Replace `YOUR_DB_PASSWORD` with a password you will use for PostgreSQL.

### 3.8 📝 Create .gitignore for backend

```bash
cat > .gitignore << 'EOF'
node_modules/
.env
EOF
```

### 3.9 ✅ Test the backend (optional — skip if no local PostgreSQL)

If you have PostgreSQL running locally:

```bash
npm run init-db
npm start
```

Then test:

```bash
curl http://localhost:3000/api/health
```

Expected: `{"status":"ok","timestamp":"..."}`

If you don't have PostgreSQL locally, that's fine — it will work on the server.

### 3.10 🚪 Go back to project root

```bash
cd ..
```

---

## 📝 Step 4 — Create the Frontend (React)

### 4.1 📁 Create the React app

```bash
npm create vite@latest frontend -- --template react
```

> 💡 Vite is a fast build tool for React. This creates a `frontend/` folder with a React project.

If prompted, select:

```text
Framework: React
Variant: JavaScript (or TypeScript if you prefer)
```

### 4.2 📥 Install dependencies

```bash
cd frontend
npm install
```

### 4.3 📝 Create the frontend .env

```bash
cat > .env << 'EOF'
VITE_API_URL=http://localhost:3000
EOF
```

> 💡 This will be changed to the production URL when deploying.

### 4.4 📝 Create the API service file

Create `src/api.js`:

**Instructions — build this yourself:**

```text
Create src/api.js with these requirements:

1. Get API_URL from import.meta.env.VITE_API_URL
   (or process.env.REACT_APP_API_URL for Create React App)

2. Export async function submitContact(data)
   - data = { name, email, message }
   - POST to ${API_URL}/api/contact
   - Send JSON body
   - Return the response JSON

3. Export async function getContacts()
   - GET ${API_URL}/api/contacts
   - Return the response JSON
```

### 4.5 📝 Create the main App component

Replace the contents of `src/App.jsx` (or `src/App.tsx`):

**Instructions — build this yourself:**

```text
Replace src/App.jsx with these requirements:

1. Import useState from react
2. Import submitContact and getContacts from ./api

3. Create state variables:
   - name, email, message (for form inputs)
   - contacts (for displaying submissions)
   - status (for success/error messages)

4. Create handleSubmit function:
   - Prevent default form submission
   - Call submitContact({ name, email, message })
   - On success: clear form, show "Message sent!" status
   - On error: show error message

5. Create loadContacts function:
   - Call getContacts()
   - Set contacts state with the result

6. Render:
   - A heading: "Contact Us"
   - A form with:
     - Input for name
     - Input for email
     - Textarea for message
     - Submit button
   - A status message area
   - A button "Load Messages" that calls loadContacts
   - A list showing contacts (if loaded)
```

### 4.6 📝 Clean up default files

Remove the default Vite/CSS files you don't need:

```bash
rm src/App.css src/index.css 2>/dev/null
```

### 4.7 📝 Update the .gitignore

The React template comes with a `.gitignore`. Make sure it includes:

```text
node_modules/
dist/
.env
```

### 4.8 ✅ Test the frontend (optional)

```bash
npm run dev
```

Open http://localhost:5173 in your browser. You should see your React app.

> 💡 The API calls won't work locally unless you also have the backend running. That's fine — we will test on the server.

### 4.9 🚪 Go back to project root

```bash
cd ..
```

---

## 📝 Step 5 — Create Root Files

### 5.1 📝 Root .gitignore

```bash
cat > .gitignore << 'EOF'
node_modules/
.env
dist/
build/
*.pem
*.key
.DS_Store
Thumbs.db
EOF
```

### 5.2 📝 Root .env.example

```bash
cat > .env.example << 'EOF'
PORT=3000
DATABASE_URL=postgresql://myapp_user:YOUR_DB_PASSWORD@localhost:5432/myapp_db
NODE_ENV=production
EOF
```

---

## 📝 Step 6 — Verify the Project Structure

```bash
find . -not -path '*/node_modules/*' -not -path '*/.git/*' | head -40
```

Expected structure:

```
linux-server-project/
├── .git/
├── .gitignore
├── .env.example
├── backend/
│   ├── package.json
│   ├── .gitignore
│   ├── .env
│   └── src/
│       ├── index.js
│       └── init-db.js
└── frontend/
    ├── package.json
    ├── .gitignore
    ├── .env
    ├── index.html
    └── src/
        ├── api.js
        ├── App.jsx
        └── main.jsx
```

---

## 📝 Step 7 — Push to GitHub

### 7.1 🌐 Create a new repository on GitHub

1. Go to https://github.com/new
2. Repository name: `linux-server-project`
3. Select **Public** or **Private**
4. Do NOT initialize with README (you already have files)
5. Click **Create repository**

### 7.2 🐙 Push your code

```bash
git add .
git commit -m "feat: initial project setup with React frontend and Node.js backend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/linux-server-project.git
git push -u origin main
```

> 💡 Replace `YOUR_USERNAME` with your GitHub username.

### 7.3 ✅ Verify on GitHub

Open your repository in a browser. You should see:

```
📁 backend/
📁 frontend/
📄 .gitignore
📄 .env.example
📄 README.md
```

---

## 📸 Screenshot Points

> 📸 **Screenshot:** Capture your terminal showing the project structure with `tree -L 2` or `find` output.

> 📸 **Screenshot:** Capture your GitHub repository showing the uploaded files.

---

## ✅ Checkpoint

At this point:

```text
[✓] 📁 Backend folder created with Express + PostgreSQL
[✓] 🎨 Frontend folder created with React (Vite)
[✓] 🔌 API routes: /api/health, /api/contact, /api/contacts
[✓] 📝 Database migration script ready
[✓] 🙈 .env files not tracked by Git
[✓] 🐙 Code pushed to GitHub
```

> 🎉 If all checks pass, continue to: [☁️ AWS EC2 Setup](02-aws-ec2-setup.md).

---

## 🔧 Troubleshooting

### ❓ "npm create vite@latest" fails

Try:

```bash
npx create-vite@latest frontend --template react
```

### ❓ "Module not found" errors

Make sure you installed dependencies:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### ❓ "Port 3000 already in use"

Kill the process:

```bash
# 🍎 Mac/Linux
lsof -ti:3000 | xargs kill -9

# 🪟 Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### ❓ "git push" asks for credentials

Set up authentication:

```bash
# Option 1: Use a personal access token
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/linux-server-project.git

# Option 2: Set up SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"
# Then add the public key to GitHub
```

---

## 🎉 Done

You have a working full-stack application ready to deploy! 🚀

**What you built:**

```text
🎨 React Frontend    →  Contact form UI
⚡ Node.js Backend   →  Express API with 3 endpoints
🐘 PostgreSQL        →  Contacts table for storing submissions
📦 Dependencies      →  express, pg, cors, dotenv
```

Next, you will create the AWS EC2 server to deploy it on. ☁️
