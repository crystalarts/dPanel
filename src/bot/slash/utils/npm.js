const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("npm")
    .setDescription("Sprawdz informacje o podanej bibliotece npm")
    .addStringOption((option) =>
      option
        .setName("biblioteka")
        .setDescription("Podaj nazwę biblioteki do wyszukania")
        .setRequired(true)
    ),

  async execute(client, interaction) {
    const names = interaction.options.getString("biblioteka").slice(0, 100);

    try {
      const response = await axios.get(
        `https://registry.npmjs.com/${encodeURIComponent(names)}`
      );
      const data = await response.data;

      const {
        name,
        description,
        version,
        homepage,
        repository,
        author,
        license,
      } = data;

      const downloadsResponse = await axios.get(
        `https://api.npmjs.org/downloads/point/last-week/${names}`
      );
      const downloadsData = await downloadsResponse.data;
      const weeklyDownloads = downloadsData.downloads || 0;

      const embed = new MessageEmbed()
        .setTitle(name)
        .setDescription(description || "Brak opisu")
        .addFields({
          name: "Informacje:",
          value: `・Wersja: \`${
            version || "Brak informacji"
          }\`\n・Strona domowa: \`${
            homepage || "Brak informacji"
          }\`\n・Repozytorium: \`${
            repository ? repository.url : "Brak informacji"
          }\`\n・Autor: \`${
            author ? author.name : "Brak informacji"
          }\`\n・Licencja: \`${
            license || "Brak informacji"
          }\`\n・Liczba pobrań (ostatnie 7 dni): \`${weeklyDownloads}\``,
        })
        .setColor("#2f3136");
      interaction.reply({ embeds: [embed] });
    } catch (error) {
      interaction.reply(
        "Wystąpił błąd podczas pobierania informacji o bibliotece!"
      );
    }
  },
};
