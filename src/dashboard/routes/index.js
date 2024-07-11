const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const User = require("../../database/models/user");

router.get("/", ensureAuthenticated, (req, res, next) => {
  const { overview, desktop, weather } = req.cookies;
  res.render("dashboard", {
    user: req.user, 
    overview, 
    desktop, 
    weather
  });
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
