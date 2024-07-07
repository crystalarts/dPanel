const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("welcome");
});

router.get("/privacy-policy", (req, res, next) => {
  res.render("privacy-policy");
});

router.get("/terms-of-service", (req, res, next) => {
  res.render("tos");
});

module.exports = router