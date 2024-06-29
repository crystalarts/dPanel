// ------------------------------------------------------------ \\
// ----------- * Copyright 2024 © Jakub Burzyński * ----------- \\
// ------------------ * All rights reserved * ----------------- \\
// ------------------------------------------------------------ \\

const bodyParser = require("body-parser");
const cookies = require("cookies");
const express = require("express");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const path = require("path");

const PORT_ADMIN = require("../config/website.json").PORT_ADMIN;

const middleware = require("./modules/middleware");
const rateLimit = require("./modules/rate-limiter");

const authRoutes = require("./routes/auth-routes");
const dashboardRoutes = require("./routes/dashboard-routes");
const rootRoutes = require("./routes/root-routes");

const app = express();

app.set("views", path.join(__dirname, "public/views"));
app.set("view engine", "pug");

app.use(rateLimit);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookies.express("a", "b", "c"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/public/assets`));
app.locals.basedir = `${__dirname}/public/assets`;

app.use(
  "/",
  middleware.updateUser,
  rootRoutes,
  authRoutes,
  middleware.validateUser,
  middleware.updateGuilds,
  dashboardRoutes
);
app.all("*", (req, res) => res.render("errors/404"));

app.listen(PORT_ADMIN, () =>
  console.log(
    `[ADMINPANEL] : SUCCESS : The server is listening on port ${PORT_ADMIN}.`
  )
);
