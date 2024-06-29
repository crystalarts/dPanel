// ------------------------------------------------------------ \\
// ----------- * Copyright 2024 © Jakub Burzyński * ----------- \\
// ------------------ * All rights reserved * ----------------- \\
// ------------------------------------------------------------ \\

const fs = require("fs");

module.exports = {
  name: "interactionCreate",

  execute: async (client, interaction) => {
    const command = client.collection_slash.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(client, interaction);
    } catch (err) {
      console.error(err);
    }
  },
};
