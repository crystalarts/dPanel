const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../../app/config/auth");
const db = require("../../database/mysql-promise");

const firewallMiddleware = require("../../utils/system/firewallMiddleware");

router.get(
  "/admin/users",
  firewallMiddleware,
  ensureAuthenticated,
  async (req, res, next) => {
    try {
      if (req.user.admin === 0) {
        return res.render("errors/404");
      } else {
        const sqlUsers =
          "SELECT id, name, email, admin, servers, verify FROM user";
        const [userResults] = await db.query(sqlUsers);

        userResults.forEach((user) => {
          try {
            const serversData =
              typeof user.servers === "string"
                ? JSON.parse(user.servers)
                : user.servers;
            user.serversCount = Array.isArray(serversData)
              ? serversData.length
              : 0;
          } catch (e) {
            console.error("Error parsing JSON for user servers:", e);
            user.serversCount = 0;
          }
        });

        res.render("storage/dashboard/user", {
          user: req.user,
          users: userResults,
        });
      }
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
