/**
 * Projects module.
 *
 * Built on the same CRUD pattern as Services/Gallery/Testimonials/Team, but
 * kept as its own file (rather than the generic factory) because it needs
 * one extra endpoint — GET /count — used by the admin dashboard KPI card.
 */
const express = require("express");

const PROJECT_COLUMNS = ["title", "category", "location", "year", "description", "image", "status"];

function createProjectsRouter(pool) {
  const router = express.Router();

  // GET /api/projects/count — used by the admin Overview KPI card.
  // Registered before "/:id" so "count" is never swallowed as an id param.
  router.get("/count", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT COUNT(*) AS total FROM projects");
      res.json(rows[0]);
    } catch (err) {
      console.error("[projects] count error:", err.message);
      res.status(500).json({ success: false, message: "Failed to count projects." });
    }
  });

  // GET /api/projects — list (optionally filtered by ?status=Published for the public site)
  router.get("/", async (req, res) => {
    try {
      const { status, category } = req.query;
      const clauses = [];
      const params = [];
      if (status) {
        clauses.push("status = ?");
        params.push(status);
      }
      if (category) {
        clauses.push("category = ?");
        params.push(category);
      }
      const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
      const [rows] = await pool.query(
        `SELECT * FROM projects ${where} ORDER BY created_at DESC`,
        params
      );
      res.json(rows);
    } catch (err) {
      console.error("[projects] list error:", err.message);
      res.status(500).json({ success: false, message: "Failed to load projects." });
    }
  });

  // GET /api/projects/:id
  router.get("/:id", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM projects WHERE id = ?", [req.params.id]);
      if (!rows.length) return res.status(404).json({ success: false, message: "Not found." });
      res.json(rows[0]);
    } catch (err) {
      console.error("[projects] get error:", err.message);
      res.status(500).json({ success: false, message: "Failed to load project." });
    }
  });

  // POST /api/projects
  router.post("/", async (req, res) => {
    try {
      const { title, category } = req.body;
      if (!title || !category) {
        return res.status(400).json({ success: false, message: "Title and category are required." });
      }
      const values = PROJECT_COLUMNS.map((c) => (req.body[c] === undefined ? null : req.body[c]));
      const [result] = await pool.query(
        `INSERT INTO projects (${PROJECT_COLUMNS.join(", ")}) VALUES (${PROJECT_COLUMNS.map(() => "?").join(", ")})`,
        values
      );
      res.status(201).json({ success: true, id: result.insertId });
    } catch (err) {
      console.error("[projects] create error:", err.message);
      res.status(500).json({ success: false, message: "Failed to save project." });
    }
  });

  // PUT /api/projects/:id
  router.put("/:id", async (req, res) => {
    try {
      const values = PROJECT_COLUMNS.map((c) => (req.body[c] === undefined ? null : req.body[c]));
      const [result] = await pool.query(
        `UPDATE projects SET ${PROJECT_COLUMNS.map((c) => `${c} = ?`).join(", ")} WHERE id = ?`,
        [...values, req.params.id]
      );
      if (!result.affectedRows) return res.status(404).json({ success: false, message: "Not found." });
      res.json({ success: true });
    } catch (err) {
      console.error("[projects] update error:", err.message);
      res.status(500).json({ success: false, message: "Failed to update project." });
    }
  });

  // DELETE /api/projects/:id
  router.delete("/:id", async (req, res) => {
    try {
      const [result] = await pool.query("DELETE FROM projects WHERE id = ?", [req.params.id]);
      if (!result.affectedRows) return res.status(404).json({ success: false, message: "Not found." });
      res.json({ success: true });
    } catch (err) {
      console.error("[projects] delete error:", err.message);
      res.status(500).json({ success: false, message: "Failed to delete project." });
    }
  });

  return router;
}

module.exports = createProjectsRouter;
