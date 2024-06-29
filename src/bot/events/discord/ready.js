// ------------------------------------------------------------ \\
// ----------- * Copyright 2024 © Jakub Burzyński * ----------- \\
// ------------------ * All rights reserved * ----------------- \\
// ------------------------------------------------------------ \\

const commands = [];
const { Routes } = require("discord-api-types/v9");
const { REST } = require("@discordjs/rest");
const fs = require("fs");

const token = require("../../../config/robot.json").DISCORD_TOKEN;
const id = require("../../../config/robot.json").DISCORD_CLIENT_ID;

const Staff = require("../../../database/models/staff");

module.exports = {
  name: "ready",

  execute: async (client) => {
    console.log(
      "[ROBOT] : SUCCESS : The bot has been successfully launched."
    );

    client.user.setPresence({
      activities: [
        {
          name: "https://icrux.net/",
          type: "WATCHING",
        },
      ],
    });

    fs.readdirSync("./src/bot/slash").forEach((dirs) => {
      const files = fs
        .readdirSync(`./src/bot/slash/${dirs}`)
        .filter((files) => files.endsWith(".js"));
      for (const file of files) {
        const slash = require(`../../slash/${dirs}/${file}`);
        commands.push(slash.data.toJSON());
      }
    });

    const rest = new REST({ version: "10" }).setToken(token);

    (async () => {
      try {
        await rest
          .put(Routes.applicationCommands(id), { body: commands })
          .catch((err) => console.log(err));

        console.log(
          "[ROBOT SLASH] : SUCCESS : Application commands successfully reloaded."
        );
      } catch (error) {
        console.error(error);
      }
    })();

    const rolesToTrack = ['Maintainer', 'Manager', 'Contributor', 'Moderator', 'Support'];

    setInterval(async () => {
        const guild = client.guilds.cache.first();
        const members = await guild.members.fetch();

        members.forEach(async member => {
            if (rolesToTrack.some(role => member.roles.cache.some(r => r.name === role))) {
                const status = member.presence?.status || 'offline';

                if (['online', 'idle', 'dnd'].includes(status)) {
                    const userActivity = await Staff.findOneAndUpdate(
                        { id: member.id },
                        {
                            $inc: { uptime: "1" },
                            status: "online",
                            lastSeen: Date.now()
                        },
                        { upsert: true, new: true }
                    );

                    const uptimeString = userActivity.uptime.toString();
                    userActivity.uptime = uptimeString;
                    await userActivity.save();
                } else {
                    await Staff.findOneAndUpdate(
                        { id: member.id },
                        { 
                          $inc: { uptimeOffline: "1" },
                          status: 'offline', 
                          lastSeen: Date.now() 
                        },
                        { upsert: true, new: true }
                    );
                }
            }
        });
    }, 1000);
  },
};
