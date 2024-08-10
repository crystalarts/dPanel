const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../app/config/auth");
const db = require("../database/mysql-promise");
const getLocalIPs = require("../utils/system/getLocalIP");

router.get("/admin/users", ensureAuthenticated, async (req, res, next) => {
  try {
    if (req.user.admin === 0) {
      return res.render("errors/404");
    } else {
      const ips = getLocalIPs();
      const sql = `
        SELECT COUNT(*) AS total_indexes
        FROM INFORMATION_SCHEMA.STATISTICS
        WHERE TABLE_SCHEMA = 'dpanel'
        AND TABLE_NAME = 'user';
      `;

      const query = `
        SELECT COUNT(*) AS downloadCount
        FROM eggs
        WHERE download = 'true'
      `;

      const [downeggs] = await db.query(query);
      const downloadCount = downeggs[0].downloadCount;

      const [results] = await db.query(sql);
      const index_user = results[0].total_indexes;

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

      res.render("dashboard-user", {
        user: req.user,
        iphost: ips,
        index_user: index_user,
        users: userResults,
        eggsdown: downloadCount,
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
