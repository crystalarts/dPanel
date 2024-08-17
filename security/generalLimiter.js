const rateLimit = require('express-rate-limit');
const Redis = require('ioredis');
const fs = require('fs-extra');

const logStream = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), { flags: 'a' });

const redisClient = new Redis();

const BLOCKED_IP_PREFIX = 'blocked_ip:';

const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  handler: async (req, res) => {
    await redisClient.set(`${BLOCKED_IP_PREFIX}${req.ip}`, true, 'EX', 60 * 60);
    logStream.write(`Blocked IP: ${req.ip} on ${new Date()}\n`);
    res.status(429).send('Too many requests, please try again in a minute.');
  }
});

module.exports = generalLimiter;