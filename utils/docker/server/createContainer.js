const Docker = require('dockerode');
const docker = new Docker();

async function createContainer() {
    try {
        const container = await docker.createContainer({
            Image: 'alpine',
            name: 'my_container',
            HostConfig: {
                PortBindings: {
                    "8080/tcp": [
                        {
                            "HostPort": "8080"
                        }
                    ]
                },
                CpuPeriod: 100000,
                CpuQuota: 50000,
                Memory: 512 * 1024 * 1024,
                MemorySwap: 1024 * 1024 * 1024,
                Binds: [
                    '/path/to/host/directory:/path/to/container/directory'
                ],
                DiskQuota: 1024 * 1024 * 1024
            },
            Cmd: ['sh'] 
        });

        console.log('Container created with ID:', container.id);

        // Start the container
        await container.start();
        console.log('Container started.');
    } catch (err) {
        console.error('Error creating container:', err);
    }
}