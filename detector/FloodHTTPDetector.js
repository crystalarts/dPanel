const axios = require("axios");
const express = require("express");
const app = express();
const convertIPv6toIPv4 = require("../tools/convertIPv6toIPv4");
require("dotenv").config();

const requestCounts = {};
const requestLimit = 15;
const timeWindow = 10 * 1000;
const blockDuration = 30 * 60 * 1000;

const activeAttacks = {};
const discordWebhookURL = process.env.DISCORD_WEBHOOK;

const now = new Date();
const currentDateTime = now.toLocaleString("pl-PL", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

console.log(
  `*   \x1b[94m[${currentDateTime}]\x1b[0m : \x1b[32m[SUCCESS]\x1b[0m : \x1b[33mFlood HTTP Detector\x1b[0m \x1b[32msuccessfully\x1b[0m loaded.`,
);

async function sendDiscordEmbed(data) {
  const embed = {
    embeds: [
      {
        title: data.title,
        description: data.description,
        color: parseInt(data.color.replace("#", ""), 16),
        fields: data.fields,
        timestamp: new Date().toISOString(),
        footer: {
          text: "Flood HTTP Detector by Jakub Burzyński",
        },
      },
    ],
  };

  try {
    await axios.post(discordWebhookURL, embed);
  } catch (error) {
    console.error("Failed to send Discord embed:", error);
  }
}
app.use((req, res, next) => {
  const clientIP = convertIPv6toIPv4(req.ip);
  const currentPath = req.path;
  const currentTime = Date.now();

  if (!requestCounts[clientIP]) {
    requestCounts[clientIP] = {};
  }

  if (!requestCounts[clientIP][currentPath]) {
    requestCounts[clientIP][currentPath] = [];
  }

  requestCounts[clientIP][currentPath] = requestCounts[clientIP][
    currentPath
  ].filter((timestamp) => currentTime - timestamp < timeWindow);

  requestCounts[clientIP][currentPath].push(currentTime);

  if (requestCounts[clientIP][currentPath].length > requestLimit) {
    if (!activeAttacks[clientIP]) {
      activeAttacks[clientIP] = {
        startTime: currentTime,
        totalRequests: 0,
      };

      sendDiscordEmbed({
        title: "Flood Attack Detected",
        description: `An attack was detected from IP: **${clientIP}** on path: **${currentPath}**`,
        color: "#ff6363",
        fields: [
          {
            name: "➥ IP Address:",
            value: "• __" + clientIP + "__",
            inline: true,
          },
          { name: "➥ Path:", value: "• __" + currentPath + "__", inline: true },
          {
            name: "➥ Time:",
            value: "• __" + new Date().toLocaleString() + "__",
            inline: false,
          },
        ],
      });
    }

    activeAttacks[clientIP].totalRequests++;
    return res.status(429).send("Too many requests - please try again later.");
  } else {
    next();
  }
});

setInterval(() => {
  const currentTime = Date.now();

  for (const ip in activeAttacks) {
    if (currentTime - activeAttacks[ip].startTime > blockDuration) {
      sendDiscordEmbed({
        title: "Flood Attack Ended",
        description: `The attack from IP: **${ip}** has ended.`,
        color: "#52f78c",
        fields: [
          { name: "➥ IP Address:", value: "• __" + ip + "__", inline: true },
          {
            name: "➥ Total Blocked Requests:",
            value: "• __" + activeAttacks[ip].totalRequests.toString() + "__",
            inline: true,
          },
          {
            name: "➥ End Time:",
            value: "• __" + new Date().toLocaleString() + "__",
            inline: false,
          },
        ],
      });

      delete activeAttacks[ip];
    }
  }
}, 10000);

module.exports = app;
