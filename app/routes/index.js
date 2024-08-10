const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const db = require("../../mysql-promise");
const getLocalIPs = require("../../utils/system/getLocalIP");
require("dotenv").config();

router.get("/", ensureAuthenticated, async (req, res, next) => {
  try {
    res.render("panel", {
      user: req.user,
    });
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

module.exports = router;
