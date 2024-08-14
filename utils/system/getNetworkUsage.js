const { exec } = require('child_process');
const os = require('os');
const path = '/proc/net/dev';

function getLinuxNetworkUsage() {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }

            console.log('Linux network stats raw data:', data);

            const lines = data.split('\n');
            const stats = [];

            for (let i = 2; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const parts = line.split(/\s+/);
                if (parts.length >= 10) {
                    const iface = parts[0].replace(':', '');
                    const rxBytes = parseInt(parts[1], 10);
                    const txBytes = parseInt(parts[9], 10);

                    console.log(`Interface: ${iface}, RX: ${rxBytes}, TX: ${txBytes}`);

                    stats.push({
                        interface: iface,
                        received: (rxBytes / (1024 * 1024)).toFixed(2),
                        sent: (txBytes / (1024 * 1024)).toFixed(2)
                    });
                }
            }

            resolve(stats);
        });
    });
}

function getWindowsNetworkUsage() {
    return new Promise((resolve, reject) => {
        exec('powershell -Command "Get-NetAdapterStatistics | Select-Object -Property Name,ReceivedBytes,SentBytes | ConvertTo-Json"', (err, stdout, stderr) => {
            if (err) {
                return reject(err);
            }

            try {
                const data = JSON.parse(stdout);
                if (Array.isArray(data)) {
                    const stats = data.map(entry => ({
                        interface: entry.Name,
                        received: (entry.ReceivedBytes / (1024 * 1024)).toFixed(2),
                        sent: (entry.SentBytes / (1024 * 1024)).toFixed(2)
                    }));
                    resolve(stats);
                } else {
                    const stats = [{
                        interface: data.Name,
                        received: (data.ReceivedBytes / (1024 * 1024)).toFixed(2),
                        sent: (data.SentBytes / (1024 * 1024)).toFixed(2)
                    }];
                    resolve(stats);
                }
            } catch (parseErr) {
                reject(parseErr);
            }
        });
    });
}


async function getNetworkUsage() {
    try {
        if (os.platform() === 'win32') {
            return await getWindowsNetworkUsage();
        } else if (os.platform() === 'linux') {
            return await getLinuxNetworkUsage();
        } else {
            throw new Error('Unsupported platform');
        }
    } catch (error) {
        console.error('Error getting network usage:', error.message);
        return [];
    }
}

module.exports = getNetworkUsage;