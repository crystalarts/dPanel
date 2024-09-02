const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../../app/config/auth");
const db = require("../../database/mysql-promise");

const firewallMiddleware = require("../../utils/system/firewallMiddleware");
const getLocalIPs = require("../../utils/system/getLocalIP");

router.get(
  "/admin/options",
  firewallMiddleware,
  ensureAuthenticated,
  async (req, res, next) => {
    try {
      if (req.user.admin === 0) {
        return res.render("errors/404");
      } else {
        const ips = getLocalIPs();
        res.render("storage/dashboard/options", {
          user: req.user,
          ip: ips,
        });
      }
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
