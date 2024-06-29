// ------------------------------------------------------------ \\
// ----------- * Copyright 2024 © Jakub Burzyński * ----------- \\
// ------------------ * All rights reserved * ----------------- \\
// ------------------------------------------------------------ \\

const cors = require('cors');
const bodyParser = require("body-parser");
const cookies = require("cookies");
const express = require("express");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const PORT_API = require("../config/website.json").PORT_API;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookies.express("a", "b", "c"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(cors());

app.use("/", require("./routes/index"));

app.use("/api", (req, res) => res.json({ hello: "earth" }));
app.use("/api/*", (req, res) =>
  sendError(res, { code: 404, message: "Not found." })
);

app.listen(PORT_API, () => {
  console.log(`[API] : SUCCESS : The server is listening on port ${PORT_API}.`);
});