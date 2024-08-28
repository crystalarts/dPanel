const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../app/config/auth");
const db = require("../database/mysql-promise");
const getLocalIPs = require("../utils/system/getLocalIP");
const { getDiskInfo } = require("node-disk-info");
const si = require("systeminformation");

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
        const ips = getLocalIPs();
        const sql = `
        SELECT COUNT(*) AS total_indexes
        FROM INFORMATION_SCHEMA.STATISTICS
        WHERE TABLE_SCHEMA = 'dpanel'
        AND TABLE_NAME = 'user';
      `;

        const [results] = await db.query(sql);
        const index_user = results[0].total_indexes;

        const query = `
        SELECT COUNT(*) AS downloadCount
        FROM eggs
        WHERE download = 'true'
      `;

        const [downeggs] = await db.query(query);
        const downloadCount = downeggs[0].downloadCount;

        const querys = "SELECT * FROM settings";
        const [settings] = await db.query(querys);

        const firewall = "SELECT * FROM firewall";
        const [firewalls] = await db.query(firewall);

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

        const notesQuery = "SELECT content FROM notes";
        const [notes] = await db.query(notesQuery);

        const apiTokensQuery = "SELECT * FROM api_tokens";
        const [apiTokens] = await db.query(apiTokensQuery);

        const disks = await getDiskInfo();

        const temperatures = await si.diskLayout();

        const diskData = disks.map((disk) => {
          const tempInfo = temperatures.find((t) => t.device === disk.mounted);
          return {
            name: disk.filesystem,
            partition: disk.mounted,
            capacity: disk.blocks / 1024 ** 3,
            used: disk.used / 1024 ** 3,
            available: disk.available / 1024 ** 3,
            temperature: tempInfo ? tempInfo.temperature : "N/A",
            type: tempInfo ? tempInfo.type : "Unknown",
          };
        });

        res.render("dashboard", {
          user: req.user,
          iphost: ips,
          index_user: index_user,
          eggsdown: downloadCount,
          settings: settings,
          users: userResults,
          notes: notes,
          firewalls: firewalls,
          apiTokens: apiTokens,
          disks: diskData,
        });
      }
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
