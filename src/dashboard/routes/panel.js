// ------------------------------------------------------------ \\
// ----------- * Copyright 2024 © Jakub Burzyński * ----------- \\
// ------------------ * All rights reserved * ----------------- \\
// ------------------------------------------------------------ \\

const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../../database/models/user");
const Server = require("../../database/models/server");
const bcrypt = require("bcrypt");

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.get("/register", (req, res, next) => {
  res.render("register");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
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
    User.findOne({ email: email }).exec(async (err, user) => {
      if (user) {
        errors.push({ msg: "email already registered" });
        res.render("register", { errors, email, password });
      } else {
        const availableServer = await Server.findOne({ userCount: { $lt: 100 } })
          .sort({ userCount: 1 });

        if (!availableServer) {
          errors.push({ msg: "No available servers" });
          res.render("register", { errors, email, password });
        }
        
        const newUser = new User({
          email: email,
          password: password,
          server: availableServer.serverNumber
        });

        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(async (value) => {
                req.flash("success_msg", "You have now registered!");

                availableServer.userCount += 1;
                await availableServer.save();

                res.redirect("/login");
              })
              .catch((value) => console.log(value));
          })
        );
      }
    });
  }
});

module.exports = router