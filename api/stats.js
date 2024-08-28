const express = require("express");
const router = express.Router();

const getCPUUsage = require("../utils/system/getCPUUsage");
const getRAMUsage = require("../utils/system/getRAMUsage");
const getDiskUsage = require("../utils/system/getDiskUsage");
const getNetworkUsage = require("../utils/system/getNetworkUsage");

router.get("/admin/_api/v1/stats", async (req, res) => {
  try {
    const cpu = await getCPUUsage();
    const memory = await getRAMUsage();

    getDiskUsage((err, disk) => {
      if (err) {
        console.error("Failed to get disk usage:", err.message);
        return res.status(500).json({ error: "Failed to get disk usage" });
      }

      getNetworkUsage()
        .then((network) => {
          res.json({ cpu, memory, disk, network });
        })
        .catch((err) => {
          console.error("Failed to get network usage:", err.message);
          res.status(500).json({ error: "Failed to get network usage" });
        });
    });
  } catch (err) {
    console.error("Failed to get system stats:", err.message);
    res.status(500).json({ error: "Failed to get system stats" });
  }
});

module.exports = router;
