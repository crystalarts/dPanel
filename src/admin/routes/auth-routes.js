const id = require('../../config/robot.json').DISCORD_CLIENT_ID;
const url = require('../../config/robot.json').AUTHORIZATION_URL;

const express = require("express");
const authClient = require("../modules/auth-client");

const router = express.Router();

router.get("/login", (req, res) =>
  res.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${id}&redirect_uri=${url}/auth&response_type=code&scope=identify guilds&prompt=none`
  )
);

router.get("/auth", async (req, res) => {
  try {
    const code = req.query.code;
    const key = await authClient.getAccess(code);

    res.cookie("key", key, { maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.redirect("/guilds");
  } catch {
    res.redirect("/");
  }
});

router.get("/logout", (req, res) => {
  res.cookies.set("key", "");
  res.redirect("/");
});

module.exports = router;
