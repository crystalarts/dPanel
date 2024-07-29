const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const os = require('os');

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
    res.render("dashboard", {
      user: req.user,
      iphost: ips
    });
  } catch (err) {
    next(err);
  }
});

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
  req.flash("success_msg", "Now logged out");
});

module.exports = router;
