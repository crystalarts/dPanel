// --- PACKAGE --- \\
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
const fs = require("fs-extra");
const ping = require("ping");
const i18n = require("i18n");
const helmet = require("helmet");
const morgan = require("morgan");
const firewallMiddleware = require("../utils/system/firewallMiddleware");
// const generalLimiter = require("../security/generalLimiter");
// const Redis = require('ioredis');
// const RedisStore = require('connect-redis').default;
//
// const redisClient = new Redis();

const now = new Date();
const currentDateTime = now.toLocaleString("pl-PL", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const app = express();

// --- TRANSLATE --- \\
i18n.configure({
  locales: ["en", "pl", "de"],
  directory: path.join(__dirname, "../locales"),
  defaultLocale: "en",
  cookie: "lang",
});

app.use(i18n.init);

// --- EXPRESS CONFIG --- \\
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

const logStream = fs.createWriteStream(
  path.resolve(__dirname, "../security/logs/access.log"),
  { flags: "a" },
);

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

// --- FLASH & CORS --- \\
app.use(flash());
app.use(cors());

// --- PASSPORT --- \\
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);
require("../oauth/google/passport-google");
require("../oauth/github/passport-github");
require("../oauth/discord/passport-discord");

// --- GENERAL ROUTES --- \\
app.use("/", require("../routes/index"));
app.use("/", require("../routes/panel"));

// --- ADMIN ROUTES --- \\
app.use("/", require("../routes/admin"));
app.use("/", require("../routes/adminEggs"));
app.use("/", require("../routes/adminDatabase"));

// --- ADMIN DASHBOARD ROUTES --- \\
app.use("/", require("../routes/dashboard/api"));
app.use("/", require("../routes/dashboard/firewall"));
app.use("/", require("../routes/dashboard/notes"));
app.use("/", require("../routes/dashboard/storage"));
app.use("/", require("../routes/dashboard/support"));
app.use("/", require("../routes/dashboard/user"));

// --- INCLUDES ROUTES --- \\
app.use("/", require("../routes/includes/firewall"));
app.use(firewallMiddleware);
app.use("/", require("../routes/includes/users"));

// --- API ROUTES --- \\
app.use("/", require("../api/allocations"));
app.use("/", require("../api/dbhost"));
app.use("/", require("../api/dbserver"));
app.use("/", require("../api/mounts"));
app.use("/", require("../api/nodes"));
app.use("/", require("../api/servers"));
app.use("/", require("../api/users"));
app.use("/", require("../api/notes"));
app.use("/", require("../api/stats"));
app.use("/", require("../api/keygenerator"));

// --- OAUTH ROUTES --- \\
app.use("/", require("../oauth/google/router-google"));
app.use("/", require("../oauth/github/router-github"));
app.use("/", require("../oauth/discord/router-discord"));

// --- OTHER ROUTES --- \\
app.all("*", (req, res) => res.render("errors/404"));

// --- WEB SERVER START --- \\
const server = app.listen(3000, () => {
  console.log(
    `*   \x1b[94m[${currentDateTime}]\x1b[0m : \x1b[32m[SUCCESS]\x1b[0m : The \x1b[33mserver\x1b[0m is listening on port \x1b[90m➤\x1b[0m  \x1b[36m3000\x1b[0m.`,
  );
});

// --- WEBSOCKET --- \\
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
// app.use(generalLimiter);
// app.use(morgan('combined', { stream: logStream }));
// app.use(helmet());
//
// const BLOCKED_IP_PREFIX = 'blocked_ip:';
//
// app.use(session({
//   store: new RedisStore({ client: redisClient }),
//   secret: 'supersecret',
//   resave: false,
//   saveUninitialized: false,
//   cookie: { secure: true, maxAge: 60000 }
// }));
//
// app.use(async (req, res, next) => {
//   const isBlocked = await redisClient.get(`${BLOCKED_IP_PREFIX}${req.ip}`);
//   if (isBlocked) {
//     return res.status(403).send('Your IP address has been blocked.');
//   }
//   next();
// });
