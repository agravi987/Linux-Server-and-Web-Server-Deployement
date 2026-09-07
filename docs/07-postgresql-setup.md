# 07 — 🐘 PostgreSQL Setup

> **Last Updated:** September 7, 2026

---

## 🎯 Goal

Create a database and user for the application.

## ✅ Prerequisites

```text
[ ] 🐘 PostgreSQL installed (from 04-linux-server-setup.md)
[ ] 📦 Application code on server (from 05-github-and-application-setup.md)
```

## 💡 What is PostgreSQL?

PostgreSQL is a relational database. It stores structured data in tables and is queried using SQL.

---

## 📝 Step 1 — Verify PostgreSQL is Running

```bash
systemctl status postgresql
```

Expected:

```text
🟢 Active: active (running)
```

If not running:

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

---

## 📝 Step 2 — Access the PostgreSQL Shell

PostgreSQL uses a system user called `postgres` for administration.

```bash
sudo -u postgres psql
```

You should see:

```text
🐘 postgres=#
```

This is the PostgreSQL interactive terminal.

---

## 📝 Step 3 — Create a Database

```sql
CREATE DATABASE myapp_db;
```

Expected:

```text
✅ CREATE DATABASE
```

---

## 📝 Step 4 — Create a Database User

```sql
CREATE USER myapp_user WITH PASSWORD 'YOUR_DB_PASSWORD';
```

> ⚠️ Replace `YOUR_DB_PASSWORD` with a strong password. Remember it — you will need it for the `.env` file.

Expected:

```text
✅ CREATE ROLE
```

---

## 📝 Step 5 — Configure Database User Permissions

```sql
ALTER USER myapp_user CREATEDB;
```

**💡 Why:** Allows the application user to create databases (needed by many ORMs for migrations).

Expected:

```text
✅ ALTER ROLE
```

---

## 📝 Step 6 — Set Locale for the User

```sql
ALTER USER myapp_user SET client_encoding TO 'utf8';
ALTER USER myapp_user SET default_transaction_isolation TO 'read committed';
ALTER USER myapp_user SET timezone TO 'UTC';
```

---

## 📝 Step 7 — Grant Privileges

```sql
GRANT ALL PRIVILEGES ON DATABASE myapp_db TO myapp_user;
```

Expected:

```text
✅ GRANT
```

---

## 📝 Step 8 — Exit PostgreSQL

```sql
\q
```

---

## 📝 Step 9 — Test the Connection

Test connecting as the new user:

```bash
psql -U myapp_user -d myapp_db -h localhost
```

Enter the password when prompted.

Expected:

```text
🐘 myapp_db=>
```

Type `\q` to exit.

---

## 📝 Step 10 — Update .env with Database URL

Edit the `.env` file:

```bash
nano ~/YOUR_REPO/backend/.env
```

Update the `DATABASE_URL` line:

```env
DATABASE_URL=postgresql://myapp_user:YOUR_DB_PASSWORD@localhost:5432/myapp_db
```

> 💡 Replace `YOUR_DB_PASSWORD` with the password you set in Step 4.

---

## 📝 Step 11 — Run Database Migrations (If Applicable)

If your application uses an ORM (Sequelize, Prisma, TypeORM, Knex, etc.), run migrations:

```bash
cd ~/YOUR_REPO/backend

# 🐘 For Sequelize
npx sequelize db:migrate

# 💎 For Prisma
npx prisma migrate deploy

# 🏗️ For TypeORM
npx typeorm migration:run

# 🔧 For Knex
npx knex migrate:latest
```

> 💡 Check your project documentation for the exact command.

If your app does not use migrations, skip this step.

---

## 📝 Step 12 — Test the Backend with Database

Start the backend:

```bash
cd ~/YOUR_REPO/backend
npm start &
```

Test the API:

```bash
curl http://localhost:3000
```

If the database was the issue before, it should now work. ✅

---

## 📝 Step 13 — Stop the Background Process

```bash
kill $(pgrep -f "node src/index.js")
```

---

## ✅ Checkpoint

At this point:

```text
[✓] 🐘 PostgreSQL is running
[✓] 📦 myapp_db database created
[✓] 👤 myapp_user created with password
[✓] 🔐 DATABASE_URL configured in .env
[✓] 🏗️ Migrations run (if applicable)
[✓] ⚡ Backend connects to database
```

> 🎉 If all checks pass, continue to: [🎨 React Frontend Deployment](08-react-frontend-deployment.md).

---

## 📖 Useful PostgreSQL Commands

```bash
# 🐘 Access the database shell
sudo -u postgres psql

# 📋 List databases
\l

# 🔌 Connect to a database
\c myapp_db

# 📋 List tables
\dt

# 📝 Describe a table
\d table_name

# 📄 Run a SQL file
\i /path/to/file.sql

# 🚪 Exit
\q
```

---

## 🔧 Troubleshooting

### ❓ "psql: error: connection refused"

🐘 PostgreSQL is not running:

```bash
sudo systemctl start postgresql
```

### ❓ "password authentication failed"

The password in `.env` doesn't match what you set. Reset it:

```bash
sudo -u postgres psql
ALTER USER myapp_user WITH PASSWORD 'new_password';
\q
```

Then update `.env` with the new password.

### ❓ "role myapp_user does not exist"

The user wasn't created. Create it:

```bash
sudo -u postgres psql
CREATE USER myapp_user WITH PASSWORD 'YOUR_DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE myapp_db TO myapp_user;
\q
```

### ❓ "database myapp_db does not exist"

Create it:

```bash
sudo -u postgres psql
CREATE DATABASE myapp_db;
GRANT ALL PRIVILEGES ON DATABASE myapp_db TO myapp_user;
\q
```

### ❓ "FATAL: Peer authentication failed"

Edit PostgreSQL authentication config:

```bash
sudo nano /etc/postgresql/16/main/pg_hba.conf
```

Find this line:

```text
local   all   all   peer
```

Change it to:

```text
local   all   all   md5
```

Restart PostgreSQL:

```bash
sudo systemctl restart postgresql
```

---

## 🎉 Done

PostgreSQL is configured with a database and user for the application. Next, you will build and deploy the React frontend. 🎨
