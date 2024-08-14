const os = require('os');

function getCPUUsage() {
    const cpus = os.cpus();
    const numCores = cpus.length;
    let totalIdle = 0, totalTick = 0;

    cpus.forEach(cpu => {
        for (let type in cpu.times) {
            totalTick += cpu.times[type];
        }
        totalIdle += cpu.times.idle;
    });

    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    const usagePercent = ((total - idle) / total) * 100;

    return {
        usagePercent: usagePercent.toFixed(2),
        numCores: numCores
    };
}

module.exports = getCPUUsage;