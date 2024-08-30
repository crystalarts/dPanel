const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../../app/config/auth");
const db = require("../../database/mysql-promise");

const firewallMiddleware = require("../../utils/system/firewallMiddleware");

router.get(
  "/admin/firewall",
  firewallMiddleware,
  ensureAuthenticated,
  async (req, res, next) => {
    try {
      if (req.user.admin === 0) {
        return res.render("errors/404");
      } else {
        const firewall = "SELECT * FROM firewall";
        const [firewalls] = await db.query(firewall);

        res.render("storage/dashboard/firewall", {
          user: req.user,
          firewalls: firewalls,
        });
      }
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
