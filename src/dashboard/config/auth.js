// ------------------------------------------------------------ \\
// ----------- * Copyright 2024 © Jakub Burzyński * ----------- \\
// ------------------ * All rights reserved * ----------------- \\
// ------------------------------------------------------------ \\

module.exports = {
  ensureAuthenticated: async function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "please login to view this resource");
    res.redirect("/panel/login");
  },
};
