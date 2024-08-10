const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const db = require("../../mysql-promise");
const getLocalIPs = require("../../utils/system/getLocalIP");

router.get("/admin/database", ensureAuthenticated, async (req, res, next) => {
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

      const [tables] = await db.query("SHOW TABLES");
      const tableNames = tables.map((table) => Object.values(table)[0]);

      res.render("dashboard-database", {
        user: req.user,
        iphost: ips,
        index_user: index_user,
        tables: tableNames,
        eggsdown: downloadCount,
        dbhost: process.env.DB_HOST,
        dbuser: process.env.DB_USER,
      });
    }
  } catch (err) {
    next(err);
  }
});

router.get("/api/table/:name", async (req, res) => {
  const tableName = req.params.name;
  try {
    const [results] = await db.query(`SELECT * FROM ${tableName}`);

    const cleanResults = results.map((user) => {
      const { password, token, servers, ...cleanUser } = user;

      if (servers) {
        if (typeof servers === "string") {
          try {
            const parsedServers = JSON.parse(servers);
            if (typeof parsedServers === "object" && parsedServers !== null) {
              if (Array.isArray(parsedServers)) {
                cleanUser.servers = parsedServers.length;
              } else {
                cleanUser.servers = Object.keys(parsedServers).length;
              }
            }
          } catch (error) {
            console.error("Failed to parse servers JSON:", error);
            cleanUser.servers = 0;
          }
        } else if (typeof servers === "object" && servers !== null) {
          cleanUser.servers = Array.isArray(servers)
            ? servers.length
            : Object.keys(servers).length;
        }
      } else {
        delete cleanUser.servers;
      }

      if (cleanUser.servers === 0) {
        cleanUser.servers = 0;
      }

      return cleanUser;
    });

    res.json(cleanResults);
  } catch (err) {
    console.error("Error querying the database:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;