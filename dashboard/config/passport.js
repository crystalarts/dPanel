const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const db = require("../../mysql");

module.exports = function (passport) {
  console.log(
    `The passport module has been successfully loaded.`,
  );
  passport.use(new LocalStrategy(
      { usernameField: 'email' },
      (email, password, done) => {
          db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
              if (err) { return done(err); }
              if (results.length === 0) {
                  return done(null, false, { message: 'Incorrect email.' });
              }

              const user = results[0];

              bcrypt.compare(password, user.password, (err, isMatch) => {
                  if (err) { return done(err); }
                  if (isMatch) {
                      return done(null, user);
                  } else {
                      return done(null, false, { message: 'Incorrect password.' });
                  }
              });
          });
      }
  ));

  passport.serializeUser((user, done) => {
      done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
      db.query('SELECT * FROM user WHERE id = ?', [id], (err, results) => {
          if (err) { return done(err); }
          done(null, results[0]);
      });
  });
};
