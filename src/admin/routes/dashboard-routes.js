// ------------------------------------------------------------ \\
// ----------- * Copyright 2024 © Jakub Burzyński * ----------- \\
// ------------------ * All rights reserved * ----------------- \\
// ------------------------------------------------------------ \\

const express = require("express");
const { validateUser } = require("../modules/middleware");
const client = require("../../bot/index");
const moment = require("moment");

const Stats = require("../../database/models/stats");
const Server = require("../../database/models/server");
const Staff = require("../../database/models/staff");
const User = require("../../database/models/user");

const guildId = require("../../config/robot.json").SERVER_ID;
const roleId = require("../../config/robot.json").ACCESS_ROLE;
const websitename = require("../../config/website.json").WEBSITE_NAME;

const router = express.Router();

const rolesOfInterest = ['Maintainer', 'Manager', 'Contributor', 'Moderator', 'Support'];

function formatStorage(size) {
  if (size >= 1024 * 1024 * 1024) {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  } else if (size >= 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + ' MB';
  } else if (size >= 1024) {
    return (size / 1024).toFixed(2) + ' KB';
  } else {
    return size + ' B';
  }
}

router.get("/guilds", validateUser, async (req, res) => {
  try {
    const guild = await client.guilds.fetch(guildId);
    const member = await guild.members.fetch(res.locals.user.id);
    const hasRole = member.roles.cache.has(roleId);

    const members = await guild.members.fetch();
    const usersWithRoles = [];

    members.forEach(async member => {
      const userRoles = member.roles.cache.filter(role => rolesOfInterest.includes(role.name));
      let staffInfo = await Staff.findOne({ id: member.user.id }).exec();

      function formatUptime(seconds) {
          const days = Math.floor(seconds / (24 * 60 * 60));
          const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
          const minutes = Math.floor((seconds % (60 * 60)) / 60);
          const remainingSeconds = seconds % 60;

          let formattedTime = '';

          if (days > 0) {
              formattedTime += `${days}d `;
          }
          if (hours > 0) {
              formattedTime += `${hours}h `;
          }
          if (minutes > 0) {
              formattedTime += `${minutes}m `;
          }
          if (remainingSeconds > 0 || formattedTime === '') {
              formattedTime += `${remainingSeconds}s`;
          }

          return formattedTime.trim();
      }

      function calculateActivityPercentage(uptime, messageCount) {
        if (messageCount === 0) return 0;
        return percentage = (messageCount / uptime) * 100;
      }

      if (userRoles.size > 0) {
        usersWithRoles.push({
          id: member.user.id,
          username: member.user.username,
          avatar: member.user.displayAvatarURL(),
          roles: userRoles.map(role => role.name),
          info: staffInfo,
          uptime: formatUptime(staffInfo.uptime),
          uptimeOffline: formatUptime(staffInfo.uptimeOffline),
          activity: calculateActivityPercentage(staffInfo.uptime, staffInfo.message).toFixed(2),
          activityOffline: calculateActivityPercentage(staffInfo.uptimeOffline, staffInfo.uptime).toFixed(2),
          join: moment(member.joinedAt).format('DD.MM.YYYY HH:mm')
        });
      }
    });

    let stats = await Stats.findOne({id: "595091014287611393"}).exec();
    let server = await Server.countDocuments({});
    let user = await User.countDocuments({});

    async function fetchServers() {
      const servers = await Server.find();

      servers.forEach(server => {
        server.storageUsedFormatted = formatStorage(server.storageUsed);
        server.storageLimitFormatted = formatStorage(server.storageLimit);
      });
      return servers;
    } 

    if (!hasRole) {
      return res.status(403).send("Forbidden");
    }

    let staff = await Staff.findOne({ id: res.locals.user.id }).exec();
    
    if (!staff) {
      staff = new Staff({
        id: res.locals.user.id,
      });

      await staff.save();
    }

    const userRoles = member.roles.cache;
    const userRolesOfInterest = userRoles.filter(role => rolesOfInterest.includes(role.name));
    const accountCreationDate = member.user.createdAt;
    const joinDate = member.joinedAt;

    const formattedCreateDate = moment(accountCreationDate).format('DD.MM.YYYY HH:mm');
    const formattedJoinDate = moment(joinDate).format('DD.MM.YYYY HH:mm');

    const completionPercentage = (staff.points / staff.limitPoints) * 100;

    const servers = await fetchServers();

    res.render("dashboard/index", {
      user: res.locals.user,
      role: userRolesOfInterest.first().name,
      dateCreate: formattedCreateDate,
      dateJoin: formattedJoinDate,
      stats: stats,
      serverCount: server,
      staff: usersWithRoles,
      points: staff,
      completion: completionPercentage,
      namewebsite: websitename,
      reguser: user,
      servers
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
