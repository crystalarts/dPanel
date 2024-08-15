const db = require("../database/mysql-promise");

const firewallMiddleware = async (req, res, next) => {
    const clientIp = req.ip;
    const protocol = req.protocol;
    const method = req.method.toLowerCase();

    try {
        const [rules] = await db.query("SELECT * FROM firewall WHERE `on` = 'on'");
        
        let accessAllowed = false;

        for (const rule of rules) {
            if (rule.interfaces === clientIp || rule.interfaces === '0.0.0.0') {
                if (rule.protocol === protocol && (rule.direction === 'in' || rule.direction === 'both')) {
                    accessAllowed = true;
                    break;
                }
            }
        }

        if (accessAllowed) {
            next();
        } else {
            res.status(403).send('Access denied by firewall');
        }
    } catch (err) {
        console.error('Błąd w middleware firewalla:', err);
        res.status(500).send('Błąd serwera');
    }
};

module.exports = firewallMiddleware;
