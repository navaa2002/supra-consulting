const express = require("express");

module.exports = function (pool) {
  const router = express.Router();

  // GET settings
  router.get("/", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM settings LIMIT 1");
      res.json(rows[0] || {});
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // UPDATE settings
  router.put("/", async (req, res) => {
    try {

      const {
        company_name,
        company_tagline,
        phone,
        whatsapp,
        email,
        address,
        logo,
        favicon,
        facebook,
        linkedin,
        instagram,
        tiktok,
        youtube,
        twitter,

        google_maps
      } = req.body;
const [rows] = await pool.query(
    "SELECT id FROM settings WHERE id=1"
);

if (rows.length === 0) {

    await pool.query(
        "INSERT INTO settings (id) VALUES (1)"
    );

}
      await pool.query(
        `UPDATE settings SET
          company_name=?,
          company_tagline=?,
          phone=?,
          whatsapp=?,
          email=?,
          address=?,
          logo=?,
          favicon=?,
          facebook=?,
          linkedin=?,
          instagram=?,
          youtube=?,
          twitter=?,
          tiktok=?,
          google_maps=?
         WHERE id=1`,
[
company_name,
company_tagline,
phone,
whatsapp,
email,
address,
logo,
favicon,

facebook,
linkedin,
instagram,
youtube,
twitter,
tiktok,
google_maps
]
      );

      res.json({
        success: true,
        message: "Settings updated successfully"
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message
      });

    }
  });

  return router;
};