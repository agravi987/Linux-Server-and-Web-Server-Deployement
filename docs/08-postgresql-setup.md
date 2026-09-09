# 08 — 🐘 PostgreSQL Setup

> **Last Updated:** September 7, 2026

---

## 🎯 Goal

Create a database and user for the application.

## ✅ Prerequisites

```text
[ ] 🐘 PostgreSQL installed (from 05-linux-server-setup.md)
[ ] 📦 Application code on server (from 06-github-and-application-setup.md)
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

**💡 Why:** Grants the user full access to the database.

Expected:

```text
✅ GRANT
```

---

## 📝 Step 7.1 — Grant Schema Permissions

**⚠️ Important:** You must connect to the `myapp_db` database first, otherwise these commands will run in the wrong database and permissions won't apply.

```sql
-- Connect to the target database first
\c myapp_db

-- Now grant schema permissions inside myapp_db
GRANT ALL PRIVILEGES ON SCHEMA public TO myapp_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO myapp_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO myapp_user;
```

**💡 Why:** PostgreSQL 15+ removed default `CREATE` permission on the `public` schema. Without this, you will get `permission denied for schema public` when running `CREATE TABLE`.

> ⚠️ **Common Mistake:** Running these GRANT commands while in the default `postgres` database (before `\c myapp_db`) will silently succeed but not apply to `myapp_db`. Always run `\c myapp_db` first.

Expected:

```text
✅ GRANT
✅ ALTER DEFAULT PRIVILEGES
✅ ALTER DEFAULT PRIVILEGES
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
nano ~/simple-basic-application/backend/.env
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
cd ~/simple-basic-application/backend

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

> 💡 The app we built in guide 01 does not use an ORM — instead it has a migration script. Run it once:

```bash
npm run init-db
```

Expected:

```text
✅ Database table created successfully
```

---

## 📝 Step 12 — Test the Backend with Database

Start the backend:

```bash
cd ~/simple-basic-application/backend
npm start &
```

Test the API:

```bash
curl http://localhost:3000/api/health
```

Expected:

```json
{"status":"ok","timestamp":"..."}
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

> 📸 **Screenshot:** Capture the PostgreSQL shell showing `CREATE DATABASE` and `CREATE ROLE` success messages.

> 🎉 If all checks pass, continue to: [🎨 React Frontend Deployment](09-react-frontend-deployment.md).

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

### ❓ "permission denied for schema public"

The user has database privileges but no `CREATE` permission on the `public` schema. This is the default since PostgreSQL 15.

**Common Cause:** You ran the GRANT commands while in the default `postgres` database instead of `myapp_db`.

**Fix:** Connect to the correct database first, then grant schema privileges:

```bash
sudo -u postgres psql
\c myapp_db
GRANT ALL PRIVILEGES ON SCHEMA public TO myapp_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO myapp_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO myapp_user;
ALTER DATABASE myapp_db OWNER TO myapp_user;
\q
```

> ⚠️ **Key Point:** Always run `\c myapp_db` before the GRANT commands. Running GRANT while in the `postgres` database will silently succeed but won't apply to your application database.

> 💡 This is also covered in **Step 7.1** above.

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
