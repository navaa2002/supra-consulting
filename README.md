# Supra Consulting — Website + Admin CMS

A full-stack corporate website for **Supra Consulting** (Engineering,
Surveying, Project Management & Professional Consulting): a static
HTML/CSS/vanilla-JS front end, a **Node.js + Express + MySQL API**, and an
**admin dashboard** that manages every piece of public content.

Everything in `admin.html` is now backed by real database tables — adding,
editing or deleting a Project, Service, Gallery image, Testimonial or Team
member there updates MySQL and is reflected on the public site immediately.

## Project structure

```
supra-consulting/
├── index.html, about.html, services.html, projects.html,
│   gallery.html, testimonials.html, contact.html   ← public site pages
├── admin.html                                       ← admin dashboard (CMS)
├── assets/
│   ├── css/style.css                                ← all styling (unchanged)
│   ├── js/api.js                                    ← shared fetch helper + API_BASE
│   └── js/main.js                                   ← nav/footer/widgets + dynamic content
└── backend/
    ├── server.js                                    ← entry point (routes wiring only)
    ├── config/db.js                                  ← MySQL connection pool
    ├── middleware/upload.js                          ← multer image-upload config
    ├── routes/
    │   ├── crudFactory.js                            ← generic CRUD builder (Services/Gallery/Testimonials/Team)
    │   ├── projects.routes.js                        ← Projects CRUD (+ /count)
    │   ├── contact.routes.js                         ← public contact-form submission
    │   ├── messages.routes.js                        ← admin inbox (list/delete)
    │   └── upload.routes.js                          ← shared image upload endpoint
    ├── db/schema.sql                                 ← CREATE TABLE + starter content
    ├── uploads/                                      ← uploaded images are stored here
    ├── .env                                          ← DB credentials (edit this)
    └── package.json
```

## Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Create the database

Import the schema (creates the `supra_db` database, all tables, and seed
content matching what the site shipped with):

```bash
mysql -u root -p < db/schema.sql
```

### 3. Configure credentials

Edit `backend/.env`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=supra_db
PORT=5000
```

(`.env.example` is provided as a template.)

### 4. Start the API

```bash
npm start          # production
npm run dev        # auto-restart on changes (nodemon)
```

You should see:

```
Supra Consulting API running on http://localhost:5000
[db] MySQL connected: supra_db
```

Check it's healthy: `curl http://localhost:5000/api/health`

### 5. Open the site

Serve the project root with any static file server, e.g.:

```bash
cd ..                     # back to the project root
python3 -m http.server 8080
```

Then open `http://localhost:8080/index.html` (public site) and
`http://localhost:8080/admin.html` (admin — any username/password logs in;
the login screen is a front-end gate, see **Security** below).

> `assets/js/api.js` points to `http://localhost:5000` when the site is
> opened on `localhost`. If you deploy the API elsewhere, update the one
> line at the top of that file.

## API reference

| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/health` | DB connectivity check |
| GET/POST | `/api/projects` | `?status=Published` filters for the public site |
| GET/PUT/DELETE | `/api/projects/:id` | |
| GET | `/api/projects/count` | Used for admin KPI |
| GET/POST | `/api/services` | Same shape for gallery/testimonials/team below |
| GET/PUT/DELETE | `/api/services/:id` | |
| GET/POST/PUT/DELETE | `/api/gallery`, `/api/gallery/:id` | |
| GET/POST/PUT/DELETE | `/api/testimonials`, `/api/testimonials/:id` | |
| GET/POST/PUT/DELETE | `/api/team`, `/api/team/:id` | |
| POST | `/api/contact` | Public quote-request form |
| GET/DELETE | `/api/messages`, `/api/messages/:id` | Admin inbox |
| POST | `/api/upload` | `multipart/form-data`, field `image` → `{ image: "/uploads/…" }` |

All list endpoints accept `?status=Published` to return only published
records (used by the public pages); the admin panel calls them without the
filter to see everything, including drafts.

## What was fixed / built (summary)

See the full change log in the chat response, but in short:
- **Backend** rewritten from one 380-line file into a modular structure
  (`config/`, `middleware/`, `routes/`) with a connection **pool** instead of
  a single connection, consistent JSON error responses, a 404 handler, and a
  global error handler (so bad uploads return clean errors instead of
  crashing).
- **Services, Gallery, Testimonials, Team** — brand-new CRUD tables + admin
  UI + public-facing rendering. Previously these were either static HTML
  or had no backend at all.
- **Projects & image upload** — fixed and hardened (file-type validation,
  size limits, generated filenames, `/uploads` static serving).
- **Frontend** — `main.js`'s hard-coded `PROJECTS`/`GALLERY` arrays replaced
  with live API calls; the same for Services/Testimonials/Team, which were
  previously hand-written HTML with no data source at all.
- **Duplicate/dead code removed** — the contact form had two competing
  submit handlers (one fake, one real); services/gallery/testimonials/team
  admin panels shared near-identical CRUD logic now generated from one
  factory instead of copy-pasted per module; debug routes (`/test`,
  `/hello`) and stray `console.log`s removed.

## Deploying it live (GitHub Pages + Render + TiDB Cloud, all free)

GitHub Pages only serves static files — it can't run the Node/Express
backend or MySQL. So the site is split across three free services:

| Piece | Where |
|---|---|
| Frontend (html/css/js) | GitHub Pages |
| Backend (Express API) | Render |
| Database (MySQL-compatible) | TiDB Cloud (Serverless, free tier) |

### 1. Push this repo to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

### 2. Create the database on TiDB Cloud

1. Sign up at https://tidbcloud.com and create a free **Serverless** cluster.
2. From the cluster's **Connect** panel, copy the host, port, user, and
   password (TiDB requires TLS, which this project already supports).
3. Use the SQL console (or `mysql` client with those credentials) to run
   the contents of `backend/db/schema.sql`.

### 3. Deploy the backend on Render

1. Sign up at https://render.com and choose **New → Web Service**, pointing
   at your GitHub repo. Render will read `render.yaml` automatically, or set
   manually: **Root Directory** `backend`, **Build Command** `npm install`,
   **Start Command** `npm start`.
2. Add the environment variables Render asks for (from step 2):
   `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and
   `DB_SSL=true`.
3. Deploy, then check `https://<your-service>.onrender.com/api/health`
   returns `{"success":true,"database":"connected"}`.

> Render's free tier spins down after inactivity, so the first request
> after a while takes ~30–60s to wake up — normal for the free plan.
>
> Its disk is also ephemeral: images uploaded through the admin panel
> won't survive a redeploy/restart. Fine for a demo; for real production
> use, swap the upload destination in `backend/middleware/upload.js` for
> a service like Cloudinary (free tier) instead of local disk.

### 4. Point the frontend at the live backend

Edit `assets/js/api.js` and set:

```js
const PRODUCTION_API_BASE = "https://<your-service>.onrender.com";
```

Commit and push that change.

### 5. Turn on GitHub Pages

Repo → **Settings → Pages** → Source: `main` branch, `/ (root)` folder →
Save. The site will be live at
`https://<your-username>.github.io/<your-repo>/`.

## Security note

The admin login screen is a **front-end gate only** (any username/password
combination works) — there is no server-side authentication yet. Anyone who
can reach `/api/*` can call it directly. Before deploying publicly, add
real auth (e.g. a `/api/login` route issuing a JWT, and an `authMiddleware`
that protects every write route) — this was out of scope for this pass but
is the natural next step.

## Customizing

- Manage all content (Projects, Services, Gallery, Testimonials, Team,
  Messages) from `admin.html` — no code edits needed.
- Business details (phone, email, address, map) live in `contact.html` and
  the footer template in `assets/js/main.js`.
- Colors/fonts/layout live entirely in `assets/css/style.css`, untouched by
  this pass — the visual design is unchanged.
