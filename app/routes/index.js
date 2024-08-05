const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const os = require("os");
const db = require("../../mysql-promise");
const dbs = require("../../mysql");

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

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
