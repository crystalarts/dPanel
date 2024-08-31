require("dotenv").config();
const passport = require("passport");
const findOrCreateUser = require("../../utils/system/findOrCreateUser");
const GitHubStrategy = require("passport-github2").Strategy;

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
  `*   \x1b[94m[${currentDateTime}]\x1b[0m : \x1b[32m[SUCCESS]\x1b[0m : \x1b[33mGitHub-OAuth2\x1b[0m passport \x1b[32msuccessfully\x1b[0m loaded.`,
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      findOrCreateUser("github", profile, done);
    },
  ),
);

module.exports = passport;
