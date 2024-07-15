const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const User = require("../../database/models/user");

async function fetchCities(id) {
  try {
    const docs = await User.find({ user_id: id }, 'weather.city');
    const allCities = docs.reduce((cities, doc) => {
      if (Array.isArray(doc.weather) && doc.weather.length > 0 && Array.isArray(doc.weather[0].city)) {
        return cities.concat(doc.weather[0].city);
      }
      return cities;
    }, []);
    return allCities;
  } catch (err) {
    console.error(err);
  }
}

router.get("/", ensureAuthenticated, async (req, res, next) => {
  const { overview, desktop, weather } = req.cookies;
  const ogTitle = res.__web_title
  const ogDescription = res.__web_description

  try {
    res.render("dashboard", {
      user: req.user, 
      cities: await fetchCities(req.user.user_id),
      overview, 
      desktop, 
      weather,
      ogTitle,
      ogDescription
    });
  } catch (err) {
    next(err);
  }
});

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
  req.flash("success_msg", "Now logged out");
});

module.exports = router;
