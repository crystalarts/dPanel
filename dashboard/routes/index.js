const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const os = require('os');
const db = require("../../mysql-promise");

function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (let iface in interfaces) {
    for (let i = 0; i < interfaces[iface].length; i++) {
      const alias = interfaces[iface][i];
      if (alias.family === 'IPv4' && !alias.internal) {
        addresses.push(alias.address);
      }
    }
  }
  return addresses;
}

router.get("/", ensureAuthenticated, async (req, res, next) => {
  try {
    const ips = getLocalIPs();
    const sql = `
      SELECT COUNT(*) AS total_indexes
      FROM INFORMATION_SCHEMA.STATISTICS
      WHERE TABLE_SCHEMA = 'dpanel'
      AND TABLE_NAME = 'user';
    `;

    const [results] = await db.query(sql);
    const index_user = results[0].total_indexes;

    res.render("dashboard", {
      user: req.user,
      iphost: ips,
      index_user: index_user
    });
  } catch (err) {
    next(err);
  }
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
