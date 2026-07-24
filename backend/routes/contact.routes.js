/**
 * Contact module — public quote-request form submission (contact.html).
 * Admin inbox (list/delete) lives in messages.routes.js, mounted at
 * /api/messages, to match the endpoint the admin panel already calls.
 */
const express = require("express");

function createContactRouter(pool) {
  const router = express.Router();

  // POST /api/contact — public form submission
  router.post("/", async (req, res) => {
    try {
      const { name, email, phone, service, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: "Name, email and message are required." });
      }

      await pool.query(
        "INSERT INTO contacts (name, email, phone, service, message) VALUES (?, ?, ?, ?, ?)",
        [name, email, phone || null, service || null, message]
      );

      res.status(201).json({ success: true, message: "Message saved successfully." });
    } catch (err) {

    console.error(err);

    res.status(500).json({
        success: false,
        message: err.message
    });

}
  });

  return router;
}

module.exports = createContactRouter;
