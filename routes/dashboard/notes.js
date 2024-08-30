const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../../app/config/auth");
const db = require("../../database/mysql-promise");

const firewallMiddleware = require("../../utils/system/firewallMiddleware");

router.get(
  "/admin/notes",
  firewallMiddleware,
  ensureAuthenticated,
  async (req, res, next) => {
    try {
      if (req.user.admin === 0) {
        return res.render("errors/404");
      } else {
        const notesQuery = "SELECT content FROM notes";
        const [notes] = await db.query(notesQuery);

        res.render("storage/dashboard/notes", {
          user: req.user,
          notes: notes,
        });
      }
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
