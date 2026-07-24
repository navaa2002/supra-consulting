/**
 * SUPRA CONSULTING — API Server
 * ---------------------------------------------------------------------
 * Entry point only: environment/config loading, middleware, route
 * mounting and startup. Actual business logic lives in ./routes/*, the
 * DB connection lives in ./config/db.js, and file-upload config lives in
 * ./middleware/upload.js — keeping this file short and easy to scan.
 * ---------------------------------------------------------------------
 */
const express = require("express");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

const { pool, testConnection } = require("./config/db");
const { UPLOAD_DIR } = require("./middleware/upload");
const createCrudRouter = require("./routes/crudFactory");

const createProjectsRouter = require("./routes/projects.routes");
const createContactRouter = require("./routes/contact.routes");
const createMessagesRouter = require("./routes/messages.routes");
const createUploadRouter = require("./routes/upload.routes");
const createSettingsRouter = require("./routes/settings.routes");
const createAdminRouter = require("./routes/admin.routes");

const app = express();
const PORT = process.env.PORT || 5000;

/* ------------------------------- Middleware ------------------------------ */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(
    express.static(
        path.join(__dirname, "..")
    )
);

// Serve uploaded images statically at /uploads/<filename>
app.use("/uploads", express.static(UPLOAD_DIR));

/* --------------------------------- Routes -------------------------------- */
app.get("/", (req, res) => {

    res.sendFile(

        path.join(__dirname, "..", "index.html")

    );

});

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ success: true, database: "connected" });
  } catch (err) {
    res.status(500).json({ success: false, database: "disconnected", error: err.message });
  }
});

// Contact form + admin inbox
app.use("/api/contact", createContactRouter(pool));
app.use("/api/messages", createMessagesRouter(pool));

// Image upload (shared by every admin module)
app.use("/api/upload", createUploadRouter());

// Projects (has its own file for the extra /count endpoint)
app.use("/api/projects", createProjectsRouter(pool));
app.use("/api/admin", createAdminRouter(pool));
app.use("/api/settings", createSettingsRouter(pool));


// Services / Gallery / Testimonials / Team — identical CRUD shape, built
// from the shared factory to avoid duplicating the same handlers 4 times.
app.use(
  "/api/services",
  createCrudRouter(pool, { table: "services", columns: [      "title",
      "category",
      "heading",
      "intro",
      "feature1",
      "feature2",
      "feature3",
      "feature4",
      "button_text",
      "button_link",
      "sort_order",
      "description",
      "image",
      "status"] })
);
app.use(
  "/api/gallery",
  createCrudRouter(pool, { table: "gallery", columns: ["image", "caption", "status"] })
);
app.use(
  "/api/testimonials",
  createCrudRouter(pool, {
    table: "testimonials",
    columns: ["client_name", "company", "role", "rating", "quote", "avatar", "status"],
  })
);
app.use(
  "/api/team",
  createCrudRouter(pool, { table: "team", columns: ["name", "role", "photo", "social_link", "status"] })
);

/* ------------------------------ 404 handler ------------------------------ */
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

/* --------------------------- Global error handler ------------------------- */
// Catches multer errors (bad file type, file too large) and anything else
// thrown/rejected inside a route so the client always gets clean JSON
// instead of an HTML stack trace or a hung request.
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err) {
    console.error("[server] Unhandled error:", err.message);
    return res.status(500).json({ success: false, message: "Something went wrong on the server." });
  }
  next();
});

/* --------------------------------- Startup -------------------------------- */
app.listen(PORT, () => {
  console.log(`Supra Consulting API running on http://localhost:${PORT}`);
  testConnection();
});

module.exports = app;
