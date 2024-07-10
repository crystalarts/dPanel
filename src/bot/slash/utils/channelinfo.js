const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("channelinfo")
    .setDescription("Sprawdź informacje o danym kanale")
    .addChannelOption((option) =>
      option.setName("channel").setDescription("Wybierz odpowiedni kanał!"),
    ),

  async execute(client, interaction) {
    const channel =
      interaction.options.getChannel("channel") || interaction.channel;

    const createdTimestamp = Math.floor(channel.createdTimestamp / 1000);

    const embed = new MessageEmbed().addFields({
      name: `Informacje:`,
      value: `・Nazwa kanału: \`${channel.name}\`\n・ID kanału: \`${
        channel.id
      }\`\n・Typ kanału: \`${channel.type.toUpperCase()}\`\n・Serwer: \`${
        channel.guild.name
      }\`\n・Pozycja: \`${
        channel.rawPosition
      }\`\n・Stworzony: <t:${createdTimestamp}:d>`,
    });

    if (channel.type === "GUILD_TEXT") {
      const topic = channel.topic || "Brak";
      embed.addFields({
        name: "Inne:",
        value: `・Opis kanału: \`${topic}\`\n・NSFW: ${
          channel.nsfw
            ? "<:emoji_55:1124634222058024980>"
            : "<:emoji_56:1124634306518712330>"
        }`,
      });
    }

    await interaction.reply({
      embeds: [embed],
      allowedMentions: { repliedUser: false },
    });
  },
};
