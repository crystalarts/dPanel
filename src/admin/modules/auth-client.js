// ------------------------------------------------------------ \\
// ----------- * Copyright 2024 © Jakub Burzyński * ----------- \\
// ------------------ * All rights reserved * ----------------- \\
// ------------------------------------------------------------ \\

const OAuthClient = require('disco-oauth');

const id = require('../../config/robot.json').DISCORD_CLIENT_ID;
const secret = require('../../config/robot.json').DISCORD_SECRET;
const url = require('../../config/robot.json').AUTHORIZATION_URL;

const client = new OAuthClient(id, secret);
client.setRedirect(`${url}/auth`);
client.setScopes('identify', 'guilds');

module.exports = client;