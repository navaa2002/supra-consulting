/**
 * Generic image-upload endpoint, used by every admin CRUD modal
 * (Projects, Services, Gallery, Testimonials, Team) so there is exactly
 * one upload implementation instead of one per module.
 */
const express = require("express");
const { upload } = require("../middleware/upload");

function createUploadRouter() {
  const router = express.Router();

  // POST /api/upload  (multipart/form-data, field name: "image")
  router.post("/", (req, res) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        // Covers both multer's own errors (file too large) and the
        // fileFilter's "not an image" rejection.
        return res.status(400).json({ success: false, message: err.message });
      }
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded." });
      }
      res.json({ success: true, image: `/uploads/${req.file.filename}` });
    });
  });

  return router;
}

module.exports = createUploadRouter;
