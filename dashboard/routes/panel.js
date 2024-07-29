const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const db = require("../../mysql");

router.get("/login", (req, res, next) => {
  const email = res._login_email
  const password = res._login_password

  res.render("login", {
    email,
    password
  });
});

router.get("/register", (req, res, next) => {
  const email = res._login_email
  const password = res._login_password

  res.render("register", {
    email,
    password
  });
});

router.post('/login', 
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Error checking email:', err);
      return res.send('Error checking email.');
    }
    
    if (results.length > 0) {
      return res.send('Email already registered.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO user (name, email, password, admin, servers) VALUES (?, ?, ?, ?, ?)', 
      [name, email, hashedPassword, false, JSON.stringify({})], 
      (err, results) => {
        if (err) {
          console.error('Error registering user:', err);
          return res.send('Error registering user.');
        }
        res.redirect('/login');
      }
    );
  });
});

module.exports = router;
