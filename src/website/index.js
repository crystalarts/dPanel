const cors = require("cors");
const bodyParser = require("body-parser");
const cookies = require("cookies");
const express = require("express");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const PORT_WEBSITE = require("../config/website.json").PORT_WEBSITE;

const app = express();

app.set("views", path.join(__dirname, "public/views"));
app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookies.express("a", "b", "c"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/public/assets`));
app.locals.basedir = `${__dirname}/public/assets`;
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(cors());

app.use("/", require("./routes/index"));

app.all("*", (req, res) => res.render("errors/404"));

app.listen(PORT_WEBSITE, () => {
  console.log(
    `[WEBSITE] : SUCCESS : The server is listening on port ${PORT_WEBSITE}.`,
  );
});
