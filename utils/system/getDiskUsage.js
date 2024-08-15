const os = require("os");
const { exec } = require("child_process");

function getDiskUsage(callback) {
  if (os.platform() === "win32") {
    exec(
      "powershell \"Get-PSDrive C | Select-Object Used,Free, @{Name='Total';Expression={$_.Used + $_.Free}} | Format-Table -HideTableHeaders\"",
      (error, stdout, stderr) => {
        if (error) {
          console.error("Error executing PowerShell command:", error);
          return callback(error);
        }

        const lines = stdout.trim().split("\n");
        const diskInfo = lines[lines.length - 1].trim().split(/\s+/);
        const usedDisk = parseFloat(diskInfo[0]) / (1024 * 1024 * 1024);
        const totalDisk = parseFloat(diskInfo[2]) / (1024 * 1024 * 1024);
        const usagePercent = (usedDisk / totalDisk) * 100;

        callback(null, {
          usagePercent: usagePercent.toFixed(2),
          totalDisk: (totalDisk / 1024).toFixed(2),
          usedDisk: (usedDisk / 1024).toFixed(2),
        });
      },
    );
  } else {
    exec(`df -h /`, (error, stdout, stderr) => {
      if (error) {
        console.error("Error executing df command:", error);
        return callback(error);
      }

      const lines = stdout.trim().split("\n");
      const diskInfo = lines[lines.length - 1].split(/\s+/);
      const totalDisk = parseFloat(diskInfo[1].replace(/[A-Za-z]/g, ""));
      const usedDisk = parseFloat(diskInfo[2].replace(/[A-Za-z]/g, ""));
      const usagePercent = parseFloat(diskInfo[4].replace("%", ""));

      callback(null, {
        usagePercent: usagePercent.toFixed(2),
        totalDisk: totalDisk.toFixed(2),
        usedDisk: usedDisk.toFixed(2),
      });
    });
  }
}

module.exports = getDiskUsage;
