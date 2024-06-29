// ------------------------------------------------------------ \\
// ----------- * Copyright 2024 © Jakub Burzyński * ----------- \\
// ------------------ * All rights reserved * ----------------- \\
// ------------------------------------------------------------ \\

const { Client, Collection } = require("discord.js");
const client = new Client({ intents: 32767 });
const fs = require("fs");
const Staff = require("../database/models/staff");

const token = require("../config/robot.json").DISCORD_TOKEN;

client.login(token);

process.on("uncaughtException", console.log);

client.collection_slash = new Collection();

module.exports = client;

fs.readdirSync("./src/bot/slash").forEach((dirs) => {
  const files = fs
    .readdirSync(`./src/bot/slash/${dirs}`)
    .filter((files) => files.endsWith(".js"));
  for (const file of files) {
    const slash = require(`./slash/${dirs}/${file}`);
    client.collection_slash.set(slash.data.name, slash);
  }
});

fs.readdirSync("./src/bot/events").forEach((dirs) => {
  const files = fs
    .readdirSync(`./src/bot/events/${dirs}`)
    .filter((files) => files.endsWith(".js"));
  for (const file of files) {
    const event = require(`./events/${dirs}/${file}`);
    client.on(event.name, (...args) => event.execute(client, ...args));
  }
});

client.on('messageCreate', async message => {
    if (message.guild.id !== "1249245314225930320") return;

    let staffInfo = await Staff.findOne({ id: message.author.id }).exec();

    if (staffInfo) {
      if (staffInfo.status === "online") {
        await Staff.findOneAndUpdate(
            { id: message.author.id },
            { $inc: { message: 1 } },
            { upsert: true, new: true }
        );
      }
    }
});

module.exports = client;