const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const os = require("os");
const db = require("../../mysql-promise");
const dbs = require("../../mysql");
require("dotenv").config();

function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (let iface in interfaces) {
    for (let i = 0; i < interfaces[iface].length; i++) {
      const alias = interfaces[iface][i];
      if (alias.family === "IPv4" && !alias.internal) {
        addresses.push(alias.address);
      }
    }
  }
  return addresses;
}

router.get("/", ensureAuthenticated, async (req, res, next) => {
  try {
    res.render("panel", {
      user: req.user,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/admin", ensureAuthenticated, async (req, res, next) => {
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

      res.render("dashboard", {
        user: req.user,
        iphost: ips,
        index_user: index_user,
        eggsdown: downloadCount,
      });
    }
  } catch (err) {
    next(err);
  }
});

router.get("/admin/eggs", ensureAuthenticated, async (req, res, next) => {
  try {
    if (req.user.admin === 0) {
      return res.render("errors/404");
    } else {
      const query = "SELECT * FROM eggs ORDER BY name ASC";

      const [eggs] = await db.query(query);

      const processedEggs = eggs.map((egg) => {
        if (egg.name === "armathree") {
          egg.name = "Arma 3";
        }
        if (egg.name === "assettocorsa") {
          egg.name = "Assetto Corsa";
        }
        if (egg.name === "astroneer") {
          egg.name = "Astroneer";
        }
        if (egg.name === "dayz") {
          egg.name = "DayZ";
        }
        if (egg.name === "factorio") {
          egg.name = "Factorio";
        }
        if (egg.name === "fivem") {
          egg.name = "FiveM";
        }
        if (egg.name === "garrysmod") {
          egg.name = "Garry's Mod";
        }
        if (egg.name === "minecraft") {
          egg.name = "Minecraft";
        }
        if (egg.name === "nginx") {
          egg.name = "Nginx";
        }
        if (egg.name === "palworld") {
          egg.name = "Palworld";
        }
        if (egg.name === "projectzomboid") {
          egg.name = "Project Zomboid";
        }
        if (egg.name === "raft") {
          egg.name = "Raft";
        }
        if (egg.name === "rust") {
          egg.name = "Rust";
        }
        if (egg.name === "teamspeak") {
          egg.name = "TeamSpeak";
        }
        if (egg.name === "terraria") {
          egg.name = "Terraria";
        }
        if (egg.name === "theforest") {
          egg.name = "The Forest";
        }
        if (egg.name === "valheim") {
          egg.name = "Valheim";
        }
        return egg;
      });

      const ips = getLocalIPs();
      const sql = `
        SELECT COUNT(*) AS total_indexes
        FROM INFORMATION_SCHEMA.STATISTICS
        WHERE TABLE_SCHEMA = 'dpanel'
        AND TABLE_NAME = 'user';
      `;

      const [results] = await db.query(sql);
      const index_user = results[0].total_indexes;

      const querys = `
        SELECT COUNT(*) AS downloadCount
        FROM eggs
        WHERE download = 'true'
      `;

      const [downeggs] = await db.query(querys);
      const downloadCount = downeggs[0].downloadCount;

      res.render("dashboard-eggs", {
        user: req.user,
        iphost: ips,
        index_user: index_user,
        eggs: processedEggs,
        eggsdown: downloadCount,
      });
    }
  } catch (err) {
    next(err);
  }
});

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

router.get("/admin/eggs/download/:id", ensureAuthenticated, (req, res) => {
  if (req.user.admin === 0) {
    return res.render("errors/404");
  } else {
    const { id } = req.params;

    const query = `
      UPDATE eggs
      SET download = 'true'
      WHERE id = ? AND download = 'false'
    `;

    dbs.query(query, [id], (error, results) => {
      if (error) {
        console.error("Query error:", error);
        return res.status(500).send("Server error");
      }

      res.redirect("/admin/eggs");
    });
  }
});

router.get("/admin/eggs/uninstall/:id", ensureAuthenticated, (req, res) => {
  if (req.user.admin === 0) {
    return res.render("errors/404");
  } else {
    const { id } = req.params;

    const query = `
      UPDATE eggs
      SET download = 'false'
      WHERE id = ? AND download = 'true'
    `;

    dbs.query(query, [id], (error, results) => {
      if (error) {
        console.error("Query error:", error);
        return res.status(500).send("Server error");
      }

      res.redirect("/admin/eggs");
    });
  }
});

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

      const [tables] = await db.query('SHOW TABLES');
      const tableNames = tables.map(table => Object.values(table)[0]);

      res.render("dashboard-database", {
        user: req.user,
        iphost: ips,
        index_user: index_user,
        tables: tableNames,
        eggsdown: downloadCount,
        dbhost: process.env.DB_HOST,
        dbuser: process.env.DB_USER
      });
    }
  } catch (err) {
    next(err);
  }
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get('/api/table/:name', async (req, res) => {
    const tableName = req.params.name;
    try {
        const [results] = await db.query(`SELECT * FROM ${tableName}`);
        
        const cleanResults = results.map(user => {
          const { password, token, servers, ...cleanUser } = user;

          if (servers) {
            if (typeof servers === 'string') {
              try {
                const parsedServers = JSON.parse(servers);
                if (typeof parsedServers === 'object' && parsedServers !== null) {
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
            } else if (typeof servers === 'object' && servers !== null) {
              cleanUser.servers = Array.isArray(servers) ? servers.length : Object.keys(servers).length;
            }
          } else {
            delete cleanUser.servers;
          }
        
          if (cleanUser.servers === 0) {
            cleanUser.servers = 0;
          }
        
          return cleanUser;
        })

        res.json(cleanResults);
    } catch (err) {
        console.error('Error querying the database:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
