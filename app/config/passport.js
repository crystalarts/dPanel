const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const db = require("../../database/mysql");

module.exports = function (passport) {
  console.log(
    `*   \x1b[32m[SUCCESS]\x1b[0m : The passport module has been \x1b[32msuccessfully\x1b[0m loaded.`,
  );
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      db.query(
        "SELECT * FROM user WHERE email = ?",
        [email],
        (err, results) => {
          if (err) {
            return done(err);
          }
          if (results.length === 0) {
            return done(null, false, { message: "Incorrect email." });
          }

          const user = results[0];

          if (user.verify === "0") {
            return done(null, false, { message: "Account not verified." });
          }

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              return done(err);
            }
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Incorrect password." });
            }
          });
        },
      );
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    db.query("SELECT * FROM user WHERE id = ?", [id], (err, results) => {
      if (err) {
        return done(err);
      }
      done(null, results[0]);
    });
  });
};
