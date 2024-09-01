const express = require("express");
const router = express.Router();
const passport = require("passport");

const now = new Date();
const currentDateTime = now.toLocaleString("pl-PL", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

console.log(
  `*   \x1b[94m[${currentDateTime}]\x1b[0m : \x1b[32m[SUCCESS]\x1b[0m : \x1b[33mGoogle-OAuth2\x1b[0m router \x1b[32msuccessfully\x1b[0m loaded.`,
);

router.get(
  "/_auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
router.get(
  "/_auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => res.redirect("/"),
);

module.exports = router;
