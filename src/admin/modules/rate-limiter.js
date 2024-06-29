// ------------------------------------------------------------ \\
// ----------- * Copyright 2024 © Jakub Burzyński * ----------- \\
// ------------------ * All rights reserved * ----------------- \\
// ------------------------------------------------------------ \\

const rateLimit = require("express-rate-limit");
const RateLimitStore = require("rate-limit-mongo");
const mongourl = require("../../config/database.json").MONGODB_URL;

module.exports = rateLimit({
  max: 300,
  message: "You are being rate limited.",
  store: new RateLimitStore({ uri: mongourl }),
  windowMs: 60 * 1000,
});
