// ------------------------------------------------------------ \\
// ----------- * Copyright 2024 © Jakub Burzyński * ----------- \\
// ------------------ * All rights reserved * ----------------- \\
// ------------------------------------------------------------ \\

const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const DEFAULT_URL = require("../../config/website.json").DEFAULT_URL;

router.get("/", (req, res, next) => {
  res.redirect(DEFAULT_URL);
});

router.get("/control", ensureAuthenticated, async (req, res, next) => {
  res.render("dashboard", {
    user: req.user,
  });
});

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/panel/login");
  });
  req.flash("success_msg", "Now logged out");
});

module.exports = router