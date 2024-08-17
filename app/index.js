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
const WebSocket = require("ws");
const fs = require('fs-extra');
const ping = require("ping");
const i18n = require("i18n");
const helmet = require('helmet');
const morgan = require('morgan');
const firewallMiddleware = require("../utils/system/firewallMiddleware");
const generalLimiter = require("../security/generalLimiter");
const Redis = require('ioredis');
const RedisStore = require('connect-redis')(session);

const redisClient = new Redis();

const app = express();

i18n.configure({
  locales: ["en", "pl", "de"],
  directory: path.join(__dirname, "../locales"),
  defaultLocale: "en",
  cookie: "lang",
});

app.use(i18n.init);

app.set("views", path.join(__dirname, "public/views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookies.express("a", "b", "c"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(`${__dirname}/public/assets`));
app.locals.basedir = `${__dirname}/public/assets`;

const logStream = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), { flags: 'a' });

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use((req, res, next) => {
  let lang = req.query.lang;
  if (lang) {
    res.cookie("lang", lang);
    res.setLocale(lang);
  }
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(cors());

require("./config/passport")(passport);

app.use("/", require("../routes/index"));
app.use("/", require("../routes/panel"));

// --- ADMIN ROUTES --- \\
app.use("/", require("../routes/admin"));
app.use("/", require("../routes/adminEggs"));
app.use("/", require("../routes/adminDatabase"));

// --- INCLUDES ROUTES --- \\
app.use("/", require("../routes/includes/firewall"));
app.use(firewallMiddleware);
app.use("/", require("../routes/includes/users"));

app.all("*", (req, res) => res.render("errors/404"));

const server = app.listen(3000, () => {
  console.log(
    `*   \x1b[32m[SUCCESS]\x1b[0m : The server is listening on port \x1b[90m➤\x1b[0m  \x1b[36m3000\x1b[0m.`,
  );
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  const pingInterval = setInterval(async () => {
    try {
      const res = await ping.promise.probe("8.8.8.8");
      if (res.alive) {
        const msg = JSON.stringify({ ping: res.time });
        ws.send(msg);
      } else {
        ws.send(JSON.stringify({ error: "Host is unreachable" }));
      }
    } catch (error) {
      console.error("Ping error:", error);
      ws.send(JSON.stringify({ error: "Ping error" }));
    }
  }, 1000);

  ws.on("close", () => {
    clearInterval(pingInterval);
  });
});


// --- SECURITY WARNING --- \\
app.use(generalLimiter);
app.use(morgan('combined', { stream: logStream }));
app.use(helmet());

const BLOCKED_IP_PREFIX = 'blocked_ip:';

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: 'supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true, maxAge: 60000 }
}));

app.use(async (req, res, next) => {
  const isBlocked = await redisClient.get(`${BLOCKED_IP_PREFIX}${req.ip}`);
  if (isBlocked) {
    return res.status(403).send('Your IP address has been blocked.');
  }
  next();
});