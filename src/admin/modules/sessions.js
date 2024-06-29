// ------------------------------------------------------------ \\
// ----------- * Copyright 2024 © Jakub Burzyński * ----------- \\
// ------------------ * All rights reserved * ----------------- \\
// ------------------------------------------------------------ \\

const authClient = require("./auth-client");
const client = require("../../bot/index");

const sessions = new Map();

function get(key) {
  return sessions.get(key) ?? create(key);
}

async function create(key) {
  await update(key);

  return sessions.get(key);
}

async function update(key) {
  const { authUser, guilds } = await getUserAndGuilds(key);

  sessions.set(key, {
    authUser: authUser,
    guilds: guilds,
  });
}

async function getUserAndGuilds(key) {
  const authUser = await authClient.getUser(key);
  const authGuilds = await authClient.getGuilds(key);
  const guilds = getManageableGuilds(authGuilds);

  return { authUser, guilds };
}

function getManageableGuilds(authGuilds) {
  const guilds = [];
  for (const id of authGuilds.keys()) {
    const isManager = authGuilds.get(id).permissions.includes("MANAGE_GUILD");
    const guild = client.guilds.cache.get(id);
    if (guild && isManager) {
      guilds.push(guild);
    }
  }
  return guilds;
}

module.exports.get = get;
module.exports.update = update;
