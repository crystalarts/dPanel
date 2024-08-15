const db = require("../../database/mysql-promise");

const firewallMiddleware = async (req, res, next) => {
  const clientIp = req.ip === "::1" ? "127.0.0.1" : req.ip;
  const protocol = req.protocol;

  try {
    const [rules] = await db.query("SELECT * FROM firewall WHERE `on` = 'on'");

    for (const rule of rules) {
      if (rule.interfaces === clientIp || rule.interfaces === "0.0.0.0") {
        if (
          rule.protocol === protocol &&
          (rule.direction === "in" || rule.direction === "both")
        ) {
          if (rule.type === "REJECT") {
            return res.status(403).send("Access denied by firewall");
          }
        }
      }
    }

    next();
  } catch (err) {
    console.error("Error in firewall middleware:", err);
    res.status(500).send("Server error");
  }
};

module.exports = firewallMiddleware;
