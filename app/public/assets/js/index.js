function updateCircle(circleId, percent) {
    const circle = document.getElementById(circleId);
    circle.style.background = `conic-gradient(#d9e5fc 0% ${percent}%, #1e1f27 ${percent}% 100%)`;
}
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function updateStats() {
    fetch('/admin/_api/v1/stats')
        .then(response => response.json())
        .then(data => {
            document.getElementById('cpu-percent').textContent = `${data.cpu.usagePercent}%`;
            document.getElementById('cpu-cores').textContent = `of ${data.cpu.numCores} CPU(s)`;
            updateCircle('cpu-circle', data.cpu.usagePercent);

            document.getElementById('memory-percent').textContent = `${data.memory.usagePercent}%`;
            document.getElementById('memory-details').textContent = `${formatBytes(data.memory.usedMem * 1024 * 1024 * 1024)} of ${formatBytes(data.memory.totalMem * 1024 * 1024 * 1024)}`;
            updateCircle('memory-circle', data.memory.usagePercent);

            document.getElementById('storage-percent').textContent = `${data.disk.usagePercent}%`;
            document.getElementById('storage-details').textContent = `${formatBytes(data.disk.usedDisk * 1024 * 1024 * 1024 * 1024)} of ${formatBytes(data.disk.totalDisk * 1024 * 1024 * 1024 * 1024)}`;
            updateCircle('storage-circle', data.disk.usagePercent);

            if (data.network.length > 0) {
                const network = data.network[0];
                document.getElementById('network-received').textContent = formatBytes(network.received * 1024 * 1024);
                document.getElementById('network-sent').textContent = formatBytes(network.sent * 1024 * 1024);
                updateCircle('network-receiveds', "100");
                updateCircle('network-sents', "100");
            } else {
                document.getElementById('network-received').textContent = `No data`;
                document.getElementById('network-sent').textContent = `No data`;
            }
        });
}

function measurePing() {
    const startTime = new Date().getTime();

    fetch(window.location.href)
        .then(response => {
            const endTime = new Date().getTime();
            const ping = endTime - startTime;
            document.getElementById("ping").innerText = ping + "ms";
            updateCircle('ping-circle', "100");
        })
        .catch(error => {
            console.error("Błąd podczas mierzenia pingu:", error);
            updateCircle('ping-circle', "0");
        });
}

setInterval(measurePing, 5000);
setInterval(updateStats, 5000);

updateStats();