# Aurora CS Course Scheduler

CSC3700 Milestone 2 (v2.0.0). React front end with a Node/Express API and MySQL database.
Tracks completed CS courses and shows which courses are Completed, Available, or Locked.

Requires Node.js 18+ and access to a MySQL database.

## How to Run

Run the server and the client in two separate terminals.

### 1. Server

```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your database host, user, password, and database name.

Run `sql/schema.sql`, then `sql/seed.sql`, against your database (phpMyAdmin SQL tab, or):

```bash
mysql -h your_db_host -u your_db_user -p your_db_name < sql/schema.sql
mysql -h your_db_host -u your_db_user -p your_db_name < sql/seed.sql
```

Then start the API (http://localhost:3000):

```bash
npm install
npm run dev
```

### 2. Client

From the project root in a second terminal:

```bash
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173.

## API

- `GET /api/courses`, `GET /api/courses/:id`
- `POST /api/courses`, `PUT /api/courses/:id`, `DELETE /api/courses/:id`
- `GET /api/completions`, `PUT /api/completions`

The server rejects a completions list that breaks a prerequisite (400). All requests use user id 1 until login is added in M3.
Tests for every route are in `server/requests.http`. Rerun `schema.sql` and `seed.sql` to reset the database.

Joseph Barron, Fall 2026
