const cors = require('cors');
const bodyParser = require("body-parser");
const cookies = require("cookies");
const express = require("express");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const WebSocket = require('ws');
const ping = require('ping');
const PORT_DASHBOARD = require("../config/website.json").PORT_DASHBOARD;

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
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(cors());

require("./config/passport")(passport);

app.use("/", require("./routes/index"));
app.use("/", require("./routes/panel"));

app.all("*", (req, res) => res.render("errors/404"));

const server = app.listen(PORT_DASHBOARD, () => {
  console.log(`[DASHBOARD] : SUCCESS : The server is listening on port ${PORT_DASHBOARD}.`);
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  const pingInterval = setInterval(async () => {
    try {
      const res = await ping.promise.probe('8.8.8.8');
      if (res.alive) {
        const msg = JSON.stringify({ ping: res.time });
        ws.send(msg);
      } else {
        ws.send(JSON.stringify({ error: 'Host is unreachable' }));
      }
    } catch (error) {
      console.error('Ping error:', error);
      ws.send(JSON.stringify({ error: 'Ping error' }));
    }
  }, 1000);

  ws.on('close', () => {
    clearInterval(pingInterval);
  });
});