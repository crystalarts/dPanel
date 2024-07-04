const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("statuscount")
    .setDescription("Sprawdz ile osób ma status aktywności"),

  async execute(client, interaction) {
    const guild = interaction.guild;
    const members = guild.members.cache;
    const totalMembers = members.size;

    const statusy = {
      online: "<:online:1129016019659272263>",
      idle: "<:idle:1129016023778066613>",
      dnd: "<:dnd:1129016013585915977>",
      offline: "<:offline:1129016016232530021>",
      null: "<:offline:1129016016232530021> ",
    };

    const statusCount = {
      online: 0,
      offline: 0,
      idle: 0,
      dnd: 0,
    };

    members.forEach((member) => {
      const presence = member.presence;
      if (presence && presence.status !== "offline") {
        const status = presence.status;
        statusCount[status]++;
      } else {
        statusCount.offline++;
      }
    });

    let response = `** Statusy aktywności członków na serwerze:**\n\n`;

    for (const [status, count] of Object.entries(statusCount)) {
      const procentage = ((count / totalMembers) * 100).toFixed(2);
      response += `${
        statusy[status.toLowerCase()]
      } ・ \`${count}\` (${procentage}%)\n`;
    }

    interaction.reply({
      allowedMentions: { repliedUser: false },
      embeds: [new MessageEmbed().setDescription(response).setColor("#2f3136")],
    });
  },
};
