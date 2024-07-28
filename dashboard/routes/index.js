const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

router.get("/", ensureAuthenticated, async (req, res, next) => {
  try {
    res.render("dashboard", {
      user: req.user
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
