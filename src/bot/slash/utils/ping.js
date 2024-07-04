// ------------------------------------------------------------ \\
// ----------- * Copyright 2024 © Jakub Burzyński * ----------- \\
// ------------------ * All rights reserved * ----------------- \\
// ------------------------------------------------------------ \\

const { SlashCommandBuilder } = require("@discordjs/builders");
const mongoose = require("mongoose");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Sprawdź obecne opóźnienie"),

  async execute(client, interaction) {
    const startTime = Date.now();
    const wsPing = client.ws.ping;

    const mongoPing = await new Promise((resolve, reject) => {
      const startMongo = Date.now();
      mongoose.connection.db.admin().ping((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(Date.now() - startMongo);
        }
      });
    });

    const endTime = Date.now();
    const botPing = endTime - startTime;

    const embed = new MessageEmbed()
      .addFields({
        name: "Opóźnienie bota:",
        value: `・Opóźnienie (bot): \`${botPing} ms\`\n・Opóźnienie (WebSocket): \`${wsPing} ms\`\n・Opóźnienie (MongoDB): \`${mongoPing} ms\``,
      })
      .setColor("#2f3136");

    await interaction.reply({ embeds: [embed] });
  },
};
