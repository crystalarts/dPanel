// ------------------------------------------------------------ \\
// ----------- * Copyright 2024 © Jakub Burzyński * ----------- \\
// ------------------ * All rights reserved * ----------------- \\
// ------------------------------------------------------------ \\

const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../../database/models/user");
const bcrypt = require("bcrypt");

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.get("/register", (req, res, next) => {
  res.render("register");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/control",
    failureRedirect: "/panel/login",
    failureFlash: true,
  })(req, res, next);
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  let errors = [];
  if (!email || !password) {
    errors.push({ msg: "Please fill in all fields" });
  }

  if (password.length < 6) {
    errors.push({ msg: "password atleast 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors: errors,
      email: email,
      password: password,
    });
  } else {
    User.findOne({ email: email }).exec((err, user) => {
      if (user) {
        errors.push({ msg: "email already registered" });
        res.render("register", { errors, email, password });
      } else {
        const newUser = new User({
          email: email,
          password: password
        });

        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((value) => {
                req.flash("success_msg", "You have now registered!");
                res.redirect("/panel/login");
              })
              .catch((value) => console.log(value));
          })
        );
      }
    });
  }
});

module.exports = router