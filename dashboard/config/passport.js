const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);
});

module.exports = function (passport) {
  console.log(
    `The passport module has been successfully loaded.`,
  );
  passport.use(new LocalStrategy(
    function(username, password, done) {
      db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) {
          return done(err);
        }
        if (results.length === 0) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            return done(err);
          }
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
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
      if (err) {
        return done(err);
      }
      done(null, results[0]);
    });
  });
};
