/**
 * Messages module — admin inbox view of contact-form submissions.
 * Mounted at /api/messages (kept as its own path, separate from
 * /api/contact, to match what the existing admin.html JS already calls).
 */
const express = require("express");

function createMessagesRouter(pool) {
  const router = express.Router();

 // GET /api/messages?search=&status=
router.get("/", async (req, res) => {
  try {

    const search = (req.query.search || "").trim();
    const status = req.query.status || "all";

    let sql = "SELECT * FROM contacts WHERE 1=1";
    const params = [];

    if (search) {
      sql += `
        AND (
          name LIKE ?
          OR email LIKE ?
          OR service LIKE ?
          OR message LIKE ?
        )
      `;

      const keyword = `%${search}%`;

      params.push(keyword, keyword, keyword, keyword);
    }

    if (status === "new") {
      sql += " AND is_read = 0";
    }

    if (status === "read") {
      sql += " AND is_read = 1";
    }

    sql += " ORDER BY created_at DESC";

    const [rows] = await pool.query(sql, params);

    res.json(rows);

  } catch (err) {

    console.error("[messages] search error:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to load messages."
    });

  }
});

router.get("/export", async (req, res) => {

    try {

        const ExcelJS = require("exceljs");

        const [rows] = await pool.query(`
            SELECT
                name,
                email,
                phone,
                service,
                message,
                is_read,
                created_at
            FROM contacts
            ORDER BY created_at DESC
        `);

        const workbook = new ExcelJS.Workbook();

        const sheet = workbook.addWorksheet("Messages");

        sheet.columns = [

            {header:"Name",key:"name",width:25},

            {header:"Email",key:"email",width:30},

            {header:"Phone",key:"phone",width:20},

            {header:"Service",key:"service",width:35},

            {header:"Message",key:"message",width:60},

            {header:"Status",key:"status",width:15},

            {header:"Date",key:"date",width:25}

        ];

        rows.forEach(r=>{

            sheet.addRow({

                name:r.name,

                email:r.email,

                phone:r.phone,

                service:r.service,

                message:r.message,

                status:r.is_read ? "Read":"Unread",

                date:r.created_at

            });

        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=messages.xlsx"
        );

        await workbook.xlsx.write(res);

        res.end();

    } catch(err){

        console.error(err);

        res.status(500).json({
            success:false,
            message:"Export failed"
        });

    }

});

// GET /api/messages/:id
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM contacts WHERE id = ?",
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Message not found."
      });
    }

    res.json(rows[0]);

  } catch (err) {
    console.error("[messages] view error:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to load message."
    });
  }
});

// PUT /api/messages/:id/read
router.put("/:id/read", async (req, res) => {
  try {

    const [result] = await pool.query(
      "UPDATE contacts SET is_read = 1 WHERE id = ?",
      [req.params.id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Message not found."
      });
    }

    res.json({
      success: true
    });

  } catch (err) {

    console.error("[messages] mark read error:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to update message."
    });

  }
});

  // DELETE /api/messages/:id
  router.delete("/:id", async (req, res) => {
    try {
      const [result] = await pool.query("DELETE FROM contacts WHERE id = ?", [req.params.id]);
      if (!result.affectedRows) return res.status(404).json({ success: false, message: "Not found." });
      res.json({ success: true });
    } catch (err) {
      console.error("[messages] delete error:", err.message);
      res.status(500).json({ success: false, message: "Failed to delete message." });
    }
  });

  return router;
}

module.exports = createMessagesRouter;
