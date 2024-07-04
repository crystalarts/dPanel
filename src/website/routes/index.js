// ------------------------------------------------------------ \\
// ----------- * Copyright 2024 © Jakub Burzyński * ----------- \\
// ------------------ * All rights reserved * ----------------- \\
// ------------------------------------------------------------ \\

const express = require("express");
const router = express.Router();
const axios = require('axios');

const CLOUDFLARE_API_URL = require('../../config/cloudflare').CLOUDFLARE_API_URL;
const CLOUDFLARE_ZONE_ID = require('../../config/cloudflare').CLOUDFLARE_ZONE_ID;;
const CLOUDFLARE_API_TOKEN = require('../../config/cloudflare').CLOUDFLARE_API_TOKEN;;

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