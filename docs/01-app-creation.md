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

Paste the **full code below** into `src/index.js`:

```js
import express from 'express';
import pkg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

// 🐘 Load dotenv config
dotenv.config();

const { Pool } = pkg;

// ⚡ Create an Express app
const app = express();

// 🔌 Use cors() middleware
app.use(cors());

// 📦 Use express.json() middleware
app.use(express.json());

// 🐘 Create a PostgreSQL pool using DATABASE_URL from .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 🖥️ Route: GET /api/health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date()
  });
});

// ✉️ Route: POST /api/contact
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const queryText = 'INSERT INTO contacts(name, email, message) VALUES($1, $2, $3) RETURNING id';
    const result = await pool.query(queryText, [name, email, message]);

    res.status(201).json({
      success: true,
      id: result.rows[0].id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 📋 Route: GET /api/contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contacts');

    res.json({
      contacts: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 🚀 Start server on PORT from .env (default 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 3.5 📝 Create the database migration file

Create `src/init-db.js`:

**Instructions — create this file by copying the full code below:**

```js
import pkg from 'pg';
import dotenv from 'dotenv';

// 🐘 Load dotenv config
dotenv.config();

const { Pool } = pkg;

// 🔌 Create a PostgreSQL pool using DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initDatabase() {
  // 📝 Create SQL query
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    // ▶️ Run the query
    await pool.query(createTableQuery);

    // ✅ Log success message
    console.log("Database table created successfully");
  } catch (error) {
    // ❌ Log error message
    console.error("Error creating database table:", error.message);
  } finally {
    // 🔚 Close the pool
    await pool.end();
  }
}

initDatabase();
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

> 💡 There is no `.env.example` in the project yet — we create `.env` directly here and add the root `.env.example` template later in Step 5.

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

Create `src/api.js` with the **full code below**:

```js
// 🎨 Get the backend API URL from the Vite environment variable.
const API_URL = import.meta.env.VITE_API_URL;

// 📤 Submit the contact form data to the backend.
export async function submitContact(data) {
  // Send a POST request to the contact API.
  const response = await fetch(`${API_URL}/api/contact`, {
    // ⚙️ Tell the server that we are sending data.
    method: "POST",

    // 📦 Tell the server that the request body is JSON.
    headers: {
      "Content-Type": "application/json",
    },

    // 🔁 Convert the JavaScript object into JSON.
    body: JSON.stringify(data),
  });

  // 🔄 Convert the server response from JSON to a JavaScript object.
  return response.json();
}

// 📋 Get all contacts from the backend.
export async function getContacts() {
  // Send a GET request to the contacts API.
  const response = await fetch(`${API_URL}/api/contacts`);

  // Convert the server response from JSON to a JavaScript object.
  return response.json();
}
```

### 4.5 📝 Create the main App component

Replace the contents of `src/App.jsx` (or `src/App.tsx`) with the **full code below**:

```jsx
// Import useState for managing component state.
import { useState } from "react";

// Import the API functions from api.js.
import { submitContact, getContacts } from "./api";

function App() {
  // 🏷️ Store the name input value.
  const [name, setName] = useState("");

  // 📧 Store the email input value.
  const [email, setEmail] = useState("");

  // 💬 Store the message input value.
  const [message, setMessage] = useState("");

  // 📋 Store the contacts received from the backend.
  const [contacts, setContacts] = useState([]);

  // 📊 Store success or error messages.
  const [status, setStatus] = useState("");

  // 🖱️ Handle the contact form submission.
  async function handleSubmit(event) {
    // ⏸️ Prevent the browser from refreshing the page.
    event.preventDefault();

    try {
      // 📤 Send the form data to the backend.
      await submitContact({ name, email, message });

      // 🧹 Clear the form inputs after successful submission.
      setName("");
      setEmail("");
      setMessage("");

      // ✅ Show a success message.
      setStatus({ type: "success", text: "Message sent successfully!" });
    } catch {
      // ❌ Show an error message if the request fails.
      setStatus({ type: "error", text: "Failed to send message. Please try again." });
    }
  }

  // 📥 Load all contacts from the backend.
  async function loadContacts() {
    try {
      // Get contacts from the backend API.
      const data = await getContacts();

      // 💾 Store the contacts in state.
      setContacts(data.contacts);
    } catch {
      // ❌ Show an error message if loading fails.
      setStatus({ type: "error", text: "Failed to load messages." });
    }
  }

  return (
    <div className="page">
      {/* 🔝 Page header. */}
      <header className="hero">
        <span className="hero-badge">Get in touch</span>
        <h1>Contact Us</h1>
        <p>Questions, feedback, or just saying hi — we'd love to hear from you.</p>
      </header>

      {/* 📝 Contact form. */}
      <form onSubmit={handleSubmit}>
        <div className="card">
          <h2 className="card-title">Send a message</h2>
          <p className="card-subtitle">We usually reply within one business day.</p>

          {/* 🏷️ Name input. */}
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Jane Doe"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

          {/* 📧 Email input. */}
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="jane@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          {/* 💬 Message textarea. */}
          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              placeholder="How can we help?"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
            />
          </div>

          {/* 📊 Display success or error status. */}
          {status && (
            <p className={`status status-${status.type}`}>{status.text}</p>
          )}

          {/* 📨 Submit the contact form. */}
          <button type="submit" className="btn btn-primary">
            Send Message
          </button>
        </div>
      </form>

      {/* 💾 Saved messages. */}
      <div className="card">
        <h2 className="card-title">Messages</h2>
        <p className="card-subtitle">Everything that has been submitted so far.</p>

        {/* 📥 Load contacts from the backend. */}
        <button type="button" onClick={loadContacts} className="btn btn-secondary">
          Load Messages
        </button>

        {/* 📋 Display contacts when they are loaded. */}
        {contacts.length > 0 && (
          <ul className="message-list">
            {contacts.map((contact) => (
              <li key={contact.id}>
                <div className="message-header">
                  <span className="message-name">{contact.name}</span>
                  <span className="message-email">{contact.email}</span>
                </div>
                <p className="message-body">{contact.message}</p>
              </li>
            ))}
          </ul>
        )}

        {contacts.length === 0 && (
          <p className="empty-state">No messages loaded yet — click the button above.</p>
        )}
      </div>

      {/* 🔚 Footer. */}
      <footer className="footer">© 2026 · Built with React &amp; Vite</footer>
    </div>
  );
}

export default App;
```

### 4.6 📝 Add the CSS styling

The App component uses CSS classes like `hero`, `card`, `field`, `btn`, and `message-list`. Replace the contents of `src/index.css` with the **full stylesheet below** (and remove the unused `src/App.css`):

```bash
rm src/App.css 2>/dev/null
```

```css
/* 🎨 Design tokens */
:root {
  --bg: #0f172a;
  --bg-soft: #16213e;
  --surface: #ffffff;
  --surface-muted: #f1f5f9;
  --border: #e2e8f0;
  --text: #0f172a;
  --text-muted: #64748b;
  --primary: #4f46e5;
  --primary-hover: #4338ca;
  --primary-soft: #eef2ff;
  --success: #15803d;
  --success-bg: #dcfce7;
  --error: #b91c1c;
  --error-bg: #fee2e2;
  --radius: 12px;
  --shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
}

/* 🔄 Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
  background: linear-gradient(160deg, var(--bg) 0%, var(--bg-soft) 55%, #1e3a5f 100%);
  min-height: 100vh;
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}

/* 📐 Page layout */
.page {
  max-width: 560px;
  margin: 0 auto;
  padding: 48px 20px 80px;
}

.hero {
  text-align: center;
  margin-bottom: 32px;
  color: #f8fafc;
}

.hero-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #c7d2fe;
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(129, 140, 248, 0.4);
  border-radius: 999px;
  padding: 6px 14px;
  margin-bottom: 16px;
}

.hero h1 {
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}

.hero p {
  color: #94a3b8;
  font-size: 1rem;
}

/* 🃏 Cards */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 28px;
  margin-bottom: 24px;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.card-subtitle {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 20px;
}

/* 📝 Form */
.field {
  margin-bottom: 16px;
}

.field label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--text);
}

.field input,
.field textarea {
  width: 100%;
  font: inherit;
  font-size: 0.95rem;
  color: var(--text);
  background: var(--surface-muted);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 14px;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}

.field textarea {
  resize: vertical;
  min-height: 110px;
}

.field input:focus,
.field textarea:focus {
  background: #ffffff;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
}

.field input::placeholder,
.field textarea::placeholder {
  color: #94a3b8;
}

/* 🔘 Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
}

.btn:active {
  transform: translateY(1px);
}

.btn-primary {
  width: 100%;
  color: #ffffff;
  background: var(--primary);
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);
}

.btn-primary:hover {
  background: var(--primary-hover);
}

.btn-secondary {
  width: 100%;
  color: var(--primary);
  background: var(--primary-soft);
  border: 1px solid #c7d2fe;
}

.btn-secondary:hover {
  background: #e0e7ff;
}

/* 📊 Status messages */
.status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 20px;
}

.status-success {
  color: var(--success);
  background: var(--success-bg);
}

.status-error {
  color: var(--error);
  background: var(--error-bg);
}

/* 💬 Message list */
.message-list {
  list-style: none;
}

.message-list li {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 12px;
  background: var(--surface-muted);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.message-list li:hover {
  border-color: #c7d2fe;
  box-shadow: 0 2px 10px rgba(79, 70, 229, 0.08);
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 6px;
}

.message-name {
  font-weight: 700;
}

.message-email {
  font-size: 0.8rem;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-body {
  font-size: 0.92rem;
  line-height: 1.5;
  color: #334155;
  white-space: pre-wrap;
}

.empty-state {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9rem;
  padding: 24px 0 4px;
}

/* 🔚 Footer */
.footer {
  text-align: center;
  color: #64748b;
  font-size: 0.8rem;
  margin-top: 40px;
}

/* 📱 Responsive */
@media (max-width: 480px) {
  .page {
    padding-top: 32px;
  }

  .hero h1 {
    font-size: 1.75rem;
  }

  .card {
    padding: 20px;
  }
}
```

> 💡 Keep `src/main.jsx` as generated by Vite (it imports `./index.css` and renders `<App />`).

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
2. Repository name: `simple-basic-application`
3. Select **Public** or **Private**
4. Do NOT initialize with README (you already have files)
5. Click **Create repository**

### 7.2 🐙 Push your code

```bash
git add .
git commit -m "feat: initial project setup with React frontend and Node.js backend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/simple-basic-application.git
git push -u origin main
```

> 💡 Replace `YOUR_USERNAME` with your GitHub username. Then your repo URL will look like `https://github.com/agravi987/simple-basic-application.git`.

### 7.3 ✅ Verify on GitHub

Open your repository in a browser. You should see:

```
📁 backend/
📁 frontend/
📄 .gitignore
📄 .env.example
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

> 🎉 If all checks pass, continue to: [🏗️ Project Setup](02-project-setup.md).

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
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/simple-basic-application.git

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
