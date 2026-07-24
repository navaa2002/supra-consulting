const express = require("express");
const bcrypt = require("bcrypt");
const { upload } = require("../middleware/upload");

module.exports = function (pool) {
  const router = express.Router();

  // Login
  router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      const [rows] = await pool.query(
        "SELECT * FROM admin WHERE username=? LIMIT 1",
        [username]
      );

      if (!rows.length) {
        return res.status(401).json({
          success: false,
          message: "Invalid username or password"
        });
      }

      const admin = rows[0];

      const ok = await bcrypt.compare(password, admin.password);

      if (!ok) {
        return res.status(401).json({
          success: false,
          message: "Invalid username or password"
        });
      }

      res.json({
        success: true,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          username: admin.username
        }
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message
      });

    }
  });

  // GET profile
router.get("/profile", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, username, name, email,photo FROM admin WHERE id=1"
);

    res.json(rows[0]);

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// UPDATE profile
router.put(
    "/profile",
    upload.single("photo"),
    async (req, res) => {

        try {



            const { name, email } = req.body;

            let sql =
                "UPDATE admin SET name=?, email=?";

            let params = [
                name,
                email
            ];

            if (req.file) {

                sql += ", photo=?";

                params.push("/uploads/" + req.file.filename);

            }

            sql += " WHERE id=1";

            await pool.query(sql, params);

            res.json({

                success: true,
                message: "Profile updated successfully",

                 photo: req.file
        ? "/uploads/" + req.file.filename
        : null

});

        } catch (err) {

            res.status(500).json({

                success: false,
                message: err.message

            });

        }

    }
);

router.put("/password", async (req, res) => {

    try {

        const { currentPassword, newPassword } = req.body;

        const [rows] = await pool.query(
            "SELECT * FROM admin WHERE id=1"
        );

        if (!rows.length) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        const admin = rows[0];

        const match = await bcrypt.compare(currentPassword, admin.password);

        if (!match) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.query(
            "UPDATE admin SET password=? WHERE id=1",
            [hashedPassword]
        );

        res.json({
            success: true,
            message: "Password changed successfully"
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