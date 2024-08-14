const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../app/config/auth");
const db = require("../database/mysql-promise");
const getLocalIPs = require("../utils/system/getLocalIP");

const getCPUUsage = require("../utils/system/getCPUUsage");
const getRAMUsage = require("../utils/system/getRAMUsage");
const getDiskUsage = require("../utils/system/getDiskUsage");
const getNetworkUsage = require("../utils/system/getNetworkUsage");

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

      const querys = 'SELECT * FROM settings';
      const [settings] = await db.query(querys);

      res.render("dashboard", {
        user: req.user,
        iphost: ips,
        index_user: index_user,
        eggsdown: downloadCount,
        settings: settings,
      });
    }
  } catch (err) {
    next(err);
  }
});

router.get('/admin/_api/v1/notes', (req, res) => {
  const query = 'SELECT * FROM notes';

  db.query(query)
    .then(([results]) => {
      const contents = results.map(row => row.content);
      res.json(contents);
    })
    .catch(err => {
      console.error('Error retrieving notes:', err);
      res.status(500).send('An error occurred while retrieving the notes');
    });
});

router.post('/admin/_api/v1/notes', async (req, res) => {
  const note = req.body.content;

  try {
    if (!note) {
      const deleteQuery = 'DELETE FROM notes';
      await db.query(deleteQuery);
      return res.send('All notes deleted successfully.');
    } else {
      const insertQuery = 'INSERT INTO notes (content) VALUES (?)';
      await db.query(insertQuery, [note]);
      return res.send('Note saved successfully');
    }
  } catch (err) {
    return res.status(500).send('An error occurred while processing the request.');
  }
});

router.get('/admin/_api/v1/stats', async (req, res) => {
  try {
        const cpu = await getCPUUsage();
        const memory = await getRAMUsage();
        
        getDiskUsage((err, disk) => {
            if (err) {
                console.error('Failed to get disk usage:', err.message);
                return res.status(500).json({ error: 'Failed to get disk usage' });
            }

            getNetworkUsage().then(network => {
                res.json({ cpu, memory, disk, network });
            }).catch(err => {
                console.error('Failed to get network usage:', err.message);
                res.status(500).json({ error: 'Failed to get network usage' });
            });
        });
    } catch (err) {
        console.error('Failed to get system stats:', err.message);
        res.status(500).json({ error: 'Failed to get system stats' });
    }
});

module.exports = router;
