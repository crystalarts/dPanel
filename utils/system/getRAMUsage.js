const os = require('os');

function getRAMUsage() {
    const totalMem = os.totalmem() / (1024 * 1024 * 1024);
    const freeMem = os.freemem() / (1024 * 1024 * 1024);
    const usedMem = totalMem - freeMem;
    const usagePercent = (usedMem / totalMem) * 100;

    return {
        usagePercent: usagePercent.toFixed(2),
        totalMem: totalMem.toFixed(2),
        usedMem: usedMem.toFixed(2)
    };
}

module.exports = getRAMUsage;