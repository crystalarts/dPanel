const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../app/config/auth");
const db = require("../database/mysql-promise");
const dbs = require("../database/mysql");
const getLocalIPs = require("../utils/system/getLocalIP");

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

module.exports = router;
