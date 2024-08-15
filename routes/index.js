const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../app/config/auth");
const firewallMiddleware = require("../utils/system/firewallMiddleware");

router.get(
  "/",
  firewallMiddleware,
  ensureAuthenticated,
  async (req, res, next) => {
    try {
      res.render("panel", {
        user: req.user,
      });
    } catch (err) {
      next(err);
    }
  },
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
