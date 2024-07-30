const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const db = require("../../mysql");
const { v4: uuidv4 } = require('uuid');
const send_verify = require("../../utils/smtp/verify");
const send_verify_completed = require("../../utils/smtp/verify-completed");

router.get("/login", (req, res, next) => {
  const email = res._login_email
  const password = res._login_password

  res.render("login", {
    email,
    password,
    message: req.flash('error') 
  });
});

router.get("/register", (req, res, next) => {
  const email = res._login_email
  const password = res._login_password

  res.render("register", {
    email,
    password,
    message: req.flash('error') 
  });
});

router.post('/login', 
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('Error checking email:', err);
      req.flash('error', 'Error checking email.');
      return res.redirect('/register');
    }
    
    if (results.length > 0) {
      req.flash('error', 'Email already registered.');
      return res.redirect('/register');
    } else {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const uuid = uuidv4();

        db.query('INSERT INTO user (name, email, password, admin, servers, verify, token) VALUES (?, ?, ?, ?, ?, ?, ?)', 
          [name, email, hashedPassword, false, JSON.stringify({}), false, uuid], 
          (err, results) => {
            if (err) {
              console.error('Error registering user:', err);
              req.flash('error', 'Error registering user.');
              return res.redirect('/register');
            }

            send_verify(email, uuid);
            req.flash('success', 'Registration successful. Please check your email for verification.');
            res.redirect('/login');
          }
        );
      } catch (error) {
        console.error('Error hashing password:', error);
        req.flash('error', 'Error hashing password.');
        res.redirect('/register');
      }
    }
  });
});


router.get('/verify', (req, res) => {
  const token = req.query.token;
  const email = req.query.email;

  if (!token) {
    return res.status(400).send('Brak tokena w zapytaniu');
  }
  const query = 'UPDATE user SET verify = 1 WHERE token = ? AND verify = 0';

  db.query(query, [token], (error, results) => {
    if (error) {
      console.error('Query error:', error);
      return res.status(500).send('Server error');
    }

    if (results.affectedRows === 0) {
      return res.status(404).send('The token is invalid or already verified');
    }

    res.send('Your account has been successfully verified');
    send_verify_completed(email);
  });
});

module.exports = router;
