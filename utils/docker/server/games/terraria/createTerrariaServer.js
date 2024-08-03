const generateUniqueName = require("../../../manager/generateUniqueName");
const db = require("../../../../../mysql-promise");

const Docker = require("dockerode");
const docker = new Docker();

const createTerrariaServer = async (config) => {
  const connection = db;

  try {
    const { ownerToken, memory, cpus, ports, duration } = config;

    const name = await generateUniqueName("terraria");

    const memoryBytes = memory * 1024 * 1024;

    const now = new Date();
    const timeoutDate = new Date(
      now.getTime() + duration * 24 * 60 * 60 * 1000,
    );

    await docker.pull("pangubot/terraria", (err, stream) => {
      if (err) throw err;
      docker.modem.followProgress(stream, (event) => console.log(event));
    });

    const container = await docker.createContainer({
      Image: "pangubot/terraria",
      name: name,
      Tty: true,
      ExposedPorts: {
        [`${ports.tcp}/tcp`]: {},
      },
      HostConfig: {
        PortBindings: {
          [`${ports.tcp}/tcp`]: [
            {
              HostPort: ports.tcp.toString(),
            },
          ],
        },
        Memory: memoryBytes,
        NanoCPUs: cpus * 1e9,
      },
      Env: [`TCP_PORT=${ports.tcp}`],
    });

    await container.start();

    const serverId = container.id;
    await connection.execute(
      "INSERT INTO dpanel-server (name, id, owner, timestart, timeout) VALUES (?, ?, ?, ?, ?)",
      [name, serverId, ownerToken, now, timeoutDate],
    );
  } catch (error) {
    console.error("Error creating Terraria server:", error);
  }
};

module.exports = { createTerrariaServer };
