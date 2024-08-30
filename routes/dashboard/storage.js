const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../../app/config/auth");
const { getDiskInfo } = require("node-disk-info");
const si = require("systeminformation");

const firewallMiddleware = require("../../utils/system/firewallMiddleware");

router.get(
  "/admin/storage",
  firewallMiddleware,
  ensureAuthenticated,
  async (req, res, next) => {
    try {
      if (req.user.admin === 0) {
        return res.render("errors/404");
      } else {
        let totalCapacity = 0;
        let totalUsed = 0;
        let totalAvailable = 0;

        const disks = await getDiskInfo();

        const temperatures = await si.diskLayout();

        const diskData = disks.map((disk) => {
          const tempInfo = temperatures.find((t) => t.device === disk.mounted);
          const capacity = disk.blocks / 1024 ** 3;
          const used = disk.used / 1024 ** 3;
          const available = disk.available / 1024 ** 3;

          totalCapacity += capacity;
          totalUsed += used;
          totalAvailable += available;

          return {
            name: disk.filesystem,
            partition: disk.mounted,
            capacity: capacity,
            used: used,
            available: available,
            temperature: tempInfo ? tempInfo.temperature : "N/A",
            type: tempInfo ? tempInfo.type : "Unknown",
          };
        });

        res.render("storage/dashboard/storage", {
          user: req.user,
          disks: diskData,
          totalCapacity,
          totalUsed,
          totalAvailable,
        });
      }
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
