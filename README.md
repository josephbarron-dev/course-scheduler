# Aurora CS Course Scheduler

CSC3700 semester project, Milestone 2. Version 2.0.0.

A React app that shows the Aurora CS course catalog, tracks completed courses, and marks each course
**Completed**, **Available**, or **Locked** based on prerequisites. Course data and completion state are
stored in MySQL and served by a Node/Express API.

| Layer | Technology | Runs on |
|---|---|---|
| Front end | React + Vite + Bootstrap | http://localhost:5173 |
| API | Node + Express + mysql2 | http://localhost:3000 |
| Database | MySQL | Team database on the class server |

## Requirements

- Node.js 18 or newer
- A MySQL database you can connect to (host, user, password, database name)

## How to Run

You run two programs at the same time, in two terminals: the Express server and the React client.

### 1. Set up the server

```bash
cd server
cp .env.example .env
```

Open `server/.env` and fill in your database values:

```
PORT=3000
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
CLIENT_ORIGIN=http://localhost:5173
```

### 2. Create and seed the database

Run `schema.sql` first, then `seed.sql`, against your database. Either paste each file into phpMyAdmin's
SQL tab, or from the `server/` folder run:

```bash
mysql -h your_db_host -u your_db_user -p your_db_name < sql/schema.sql
mysql -h your_db_host -u your_db_user -p your_db_name < sql/seed.sql
```

`schema.sql` drops and recreates the tables, so running both scripts again resets the database.
After seeding there are 10 courses, 10 prerequisite rows, 1 user (`student1`), and 2 completions
(CSC1700 and CSC2200).

### 3. Start the server

Still inside `server/`:

```bash
npm install
npm run dev
```

You should see `Course Scheduler API running on http://localhost:3000`.

### 4. Start the client

In a **second terminal**, from the project root (not `server/`):

```bash
cp .env.example .env
npm install
npm run dev
```

The root `.env` contains `VITE_API_BASE_URL=http://localhost:3000`. Open http://localhost:5173.

## API

All routes return JSON.

| Method | Route | Purpose | Success | Errors |
|---|---|---|---|---|
| GET | `/api/courses` | All courses, each with a `prerequisites` array of ids | 200 | |
| GET | `/api/courses/:id` | One course | 200 | 404 |
| POST | `/api/courses` | Create a course and its prerequisite rows | 201 | 400 |
| PUT | `/api/courses/:id` | Update a course and replace its prerequisites | 200 | 400, 404 |
| DELETE | `/api/courses/:id` | Delete a course, returns the deleted course | 200 | 404 |
| GET | `/api/completions` | Array of completed course ids | 200 | |
| PUT | `/api/completions` | Replace the completed list with the array sent | 200 | 400 |

The server enforces prerequisites: `PUT /api/completions` returns 400 and saves nothing if any course
in the array is missing one of its prerequisites. M2 has no login, so every request uses user id 1.

`server/requests.http` (WebStorm HTTP Client) has a request for every route and for the error cases.
Reset the database with `schema.sql` and `seed.sql` before running it top to bottom.

## Project Structure

```
course-scheduler/
  server/                 Express API
    sql/                  schema.sql, seed.sql
    routes/               courses.js, completions.js
    util/                 database.js (mysql2 pool), courseData.js, validateCourse.js
    server.js             app setup, CORS, mounts routers under /api
    requests.http         API tests
    .env.example          server config keys (copy to .env)
  src/
    components/           CourseCard, CourseList, NavBar, ProgressSummary
    hooks/useFetch.js
    pages/                HomePage, AboutPage
  .env.example            VITE_API_BASE_URL (copy to .env)
```

`.env` and `server/.env` are gitignored and never committed.

## Author

Joseph Barron, CSC3700 Advanced Web Application Development, Fall 2026
