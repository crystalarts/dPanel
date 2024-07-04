const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("activity")
    .setDescription("Sprawdz swój bądź kogoś status aktywności")
    .addUserOption((option) =>
      option
        .setName("username")
        .setDescription("Wybierz odpowiedniego użytkownika!")
    ),

  async execute(client, interaction) {
    const user = interaction.options.getUser("username") || interaction.user;

    const guild = client.guilds.cache.get(interaction.guild.id);

    if (
      !guild.members.cache.get(user.id).presence ||
      !guild.members.cache.get(user.id).presence.activities ||
      guild.members.cache.get(user.id).presence.activities.length === 0
    ) {
      await interaction.reply(
        `Użytkownik \`${user.username}\` nie ma żadnej aktywności`
      );
    } else {
      const activities = guild.members.cache
        .get(user.id)
        .presence.activities.map((activity, index) => ({
          name: `Activity ${index + 1}`,
          type: activity.type,
          name: activity.name,
          details: activity.details || "Brak",
          state: activity.state || "Brak",
          emoji: activity.emoji ? activity.emoji.toString() : "Brak",
          url: activity.url || "Brak",
          id: activity.id,
          timestamp: activity.timestamps,
          platform: activity.platform || "Brak",
          party: activity.party || "Brak",
          createdTimestamp: activity.createdTimestamp,
        }));

      const embed = new MessageEmbed()
        .setAuthor({
          name: `Status aktywności dla ${user.username}`,
          iconURL: client.user.displayAvatarURL({ dynamic: true, size: 1024 }),
        })
        .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setDescription(`Wyświetlane aktywności \`${activities.length}\``)
        .setColor("#2f3136");

      activities.forEach((activity) => {
        embed.addFields({
          name: `${activity.name}`,
          value: `・Typ statusu: \`${activity.type}\`\n・Nazwa: \`${
            activity.name
          }\`\n・Szczegóły: \`${activity.details}\`\n・Stan: \`${
            activity.state
          }\`\n・Emoji: ${activity.emoji}\n・URL: \`${
            activity.url
          }\`\n・Platforma: \`${activity.platform}\`\n・Party: \`${
            activity.party
          }\`\n・Rozpoczęto: <t:${Math.floor(
            activity.createdTimestamp / 1000
          )}:d> (<t:${Math.floor(activity.createdTimestamp / 1000)}:R>)
          `,
        });
      });

      await interaction.reply({ embeds: [embed] });
    }
  },
};
