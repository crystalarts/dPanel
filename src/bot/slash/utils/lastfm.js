const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const axios = require("axios");
const moment = require("moment-timezone");
const lastfm_key = require("../../../config/robot.json").LASTFM_API_KEY;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lastfm")
    .setDescription("Sprawdz konto lastfm podanego użytkownika")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("Podaj nazwę lastfm")
        .setRequired(true)
    ),

  async execute(client, interaction) {
    const lastfmApiKey = lastfm_key;
    moment.locale(`pl`);
    const username = interaction.options.getString("username").slice(0, 100);
    try {
      const response = await axios.get(
        `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${encodeURIComponent(
          username
        )}&api_key=${lastfmApiKey}&format=json`
      );
      const response1 = await axios.get(
        `https://ws.audioscrobbler.com/2.0/?method=user.getTopArtists&user=${encodeURIComponent(
          username
        )}&api_key=${lastfmApiKey}&format=json`
      );
      const response2 = await axios.get(
        `https://ws.audioscrobbler.com/2.0/?method=user.getTopTracks&user=${encodeURIComponent(
          username
        )}&api_key=${lastfmApiKey}&format=json`
      );

      const response3 = await axios.get(
        `https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${encodeURIComponent(
          username
        )}&api_key=${lastfmApiKey}&format=json`
      );

      const data = await response.data;
      const data1 = await response1.data;
      const data2 = await response2.data;
      const data3 = await response3.data;

      const topArtist = data1.topartists.artist[0];
      const artistName = topArtist.name;
      const artistPlaycount = topArtist.playcount;

      const topTracks = data2.toptracks.track;

      const favoriteTracksList = topTracks
        .slice(0, 1)
        .map((track, index) => `${track.name} \`(${track.artist.name})\``);

      const recentTracks = data3.recenttracks.track;
      const recentScrobblesList = recentTracks
        .slice(0, 1)
        .map((track, index) => `${track.name} \`(${track.artist["#text"]})\``);

      const action = new MessageActionRow();

      const url = new MessageButton()
        .setLabel("URL")
        .setStyle("LINK")
        .setURL(data.user.url);
      action.addComponents(url);

      const embed = new MessageEmbed()
        .setAuthor({
          name: "Znaleziono konto użytkownika " + data.user.name,
          iconURL: client.user.displayAvatarURL({ dynamic: true, size: 1024 }),
        })
        .setColor("#2f3136")
        .setThumbnail(data.user.image[3]["#text"])
        .addFields(
          {
            name: "Informacje:",
            value: `・Data dołączenia: <t:${data.user.registered["#text"]}:d>\n・Liczba scrobbli: \`${data.user.playcount}\`\n・Liczba wykonawców: \`${data.user.artist_count}\`\n・Liczba albumów: \`${data.user.album_count}\`\n・Liczba utworów: \`${data.user.track_count}\``,
          },
          {
            name: `Ulubiony artysta:`,
            value: `・Nazwa: \`${artistName}\`\n・Liczba odsłuchań: \`${artistPlaycount}\``,
          },
          {
            name: `Ulubiony utwor:`,
            value: "・" + favoriteTracksList.join(""),
          },
          {
            name: `Najnowszy scrobbles:`,
            value: "・" + recentScrobblesList.join(""),
          }
        );
      interaction.reply({ embeds: [embed], components: [action] });
    } catch (error) {
      interaction.reply(
        "Wystąpił błąd podczas pobierania informacji o użytkowniku Last.fm."
      );
    }
  },
};
