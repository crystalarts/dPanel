// ------------------------------------------------------------ \\
// ----------- * Copyright 2024 © Jakub Burzyński * ----------- \\
// ------------------ * All rights reserved * ----------------- \\
// ------------------------------------------------------------ \\

const sessions = require("./sessions");

module.exports.updateGuilds = async (req, res, next) => {
  try {
    const key = res.cookies.get("key");
    if (key) {
      const { guilds } = await sessions.get(key);
      res.locals.guilds = guilds;
    }
  } finally {
    return next();
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const key = res.cookies.get("key");
    if (key) {
      const { authUser } = await sessions.get(key);
      res.locals.user = authUser;
    }
  } finally {
    return next();
  }
};

module.exports.validateGuild = (req, res, next) => {
  const guild = res.locals.guilds.find((g) => g.id === req.params.id);
  if (guild) {
    res.locals.guild = guild;
    return next();
  } else {
    res.render("errors/404");
  }
};

module.exports.validateUser = (req, res, next) => {
  if (res.locals.user) {
    return next();
  }

  if (res.locals.user === "undefined") {
    res.render("errors/401");
  }
};
