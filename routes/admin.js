const express = require("express");
const router = express.Router();

const { ensureAuthenticated } = require("../app/config/auth");
const firewallMiddleware = require("../utils/system/firewallMiddleware");

router.get(
  "/admin",
  firewallMiddleware,
  ensureAuthenticated,
  async (req, res, next) => {
    try {
      if (req.user.admin === 0) {
        return res.render("errors/404");
      } else {
        res.render("dashboard", {
          user: req.user,
        });
      }
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
