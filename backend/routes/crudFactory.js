/**
 * Generic CRUD router factory.
 *
 * Services, Gallery, Testimonials and Team all follow the exact same
 * pattern (list / get one / create / update / delete against a single
 * table), so instead of copy-pasting near-identical handlers four times
 * (as the original code did for Projects/Services) we build the router
 * once from a small config object. This keeps server.js and each route
 * file short, and any bug fix here benefits every module at once.
 *
 * @param {import('mysql2/promise').Pool} pool
 * @param {Object} options
 * @param {string} options.table - table name (must be a trusted, hard-coded value — never user input)
 * @param {string[]} options.columns - insertable/updatable column names, in the order the frontend sends them
 * @param {string} [options.orderBy] - ORDER BY clause (defaults to "created_at DESC")
 */
const express = require("express");

function createCrudRouter(pool, { table, columns, orderBy = "created_at DESC" }) {
  const router = express.Router();

  // Build "col1 = ?, col2 = ?, ..." once for reuse in UPDATE statements.
  const setClause = columns.map((c) => `${c} = ?`).join(", ");
  const insertCols = columns.join(", ");
  const insertPlaceholders = columns.map(() => "?").join(", ");

  // GET /api/<table>  — list everything (admin uses this as-is; public
  // pages filter status=Published client-side or via ?status=Published)
  router.get("/", async (req, res) => {
    try {
      const { status } = req.query;
      let sql = `SELECT * FROM ${table}`;
      const params = [];
      if (status) {
        sql += " WHERE status = ?";
        params.push(status);
      }
      sql += ` ORDER BY ${orderBy}`;
      const [rows] = await pool.query(sql, params);
      res.json(rows);
    } catch (err) {
      console.error(`[${table}] list error:`, err.message);
      res.status(500).json({ success: false, message: "Failed to load records." });
    }
  });

  // GET /api/<table>/:id — single record
  router.get("/:id", async (req, res) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
      if (!rows.length) {
        return res.status(404).json({ success: false, message: "Not found." });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error(`[${table}] get error:`, err.message);
      res.status(500).json({ success: false, message: "Failed to load record." });
    }
  });

  // POST /api/<table> — create
  router.post("/", async (req, res) => {
    try {
      const values = columns.map((c) => (req.body[c] === undefined ? null : req.body[c]));
      const [result] = await pool.query(
        `INSERT INTO ${table} (${insertCols}) VALUES (${insertPlaceholders})`,
        values
      );
      res.status(201).json({ success: true, id: result.insertId });
    } catch (err) {
      console.error(`[${table}] create error:`, err.message);
      res.status(500).json({ success: false, message: "Failed to create record." });
    }
  });

  // PUT /api/<table>/:id — update
  router.put("/:id", async (req, res) => {
    try {
      const values = columns.map((c) => (req.body[c] === undefined ? null : req.body[c]));
      const [result] = await pool.query(`UPDATE ${table} SET ${setClause} WHERE id = ?`, [
        ...values,
        req.params.id,
      ]);
      if (!result.affectedRows) {
        return res.status(404).json({ success: false, message: "Not found." });
      }
      res.json({ success: true });
    } catch (err) {
      console.error(`[${table}] update error:`, err.message);
      res.status(500).json({ success: false, message: "Failed to update record." });
    }
  });

  // DELETE /api/<table>/:id
  router.delete("/:id", async (req, res) => {
    try {
      const [result] = await pool.query(`DELETE FROM ${table} WHERE id = ?`, [req.params.id]);
      if (!result.affectedRows) {
        return res.status(404).json({ success: false, message: "Not found." });
      }
      res.json({ success: true });
    } catch (err) {
      console.error(`[${table}] delete error:`, err.message);
      res.status(500).json({ success: false, message: "Failed to delete record." });
    }
  });

  return router;
}

module.exports = createCrudRouter;
