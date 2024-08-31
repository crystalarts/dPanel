require("dotenv").config();
const passport = require("passport");
const findOrCreateUser = require("../../utils/system/findOrCreateUser");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

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
  `*   \x1b[94m[${currentDateTime}]\x1b[0m : \x1b[32m[SUCCESS]\x1b[0m : \x1b[33mGoogle-OAuth2\x1b[0m passport \x1b[32msuccessfully\x1b[0m loaded.`,
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      findOrCreateUser("google", profile, done);
    },
  ),
);

module.exports = passport;
