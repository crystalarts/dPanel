const generateUniqueName = require("../../../manager/generateUniqueName");
const db = require("../../../../../mysql-promise");

const Docker = require("dockerode");
const docker = new Docker();

const createGarrysModServer = async (config) => {
  const connection = db;

  try {
    const { ownerToken, memory, cpus, port, duration } = config;

    const name = await generateUniqueName("garrysmod");

    const memoryBytes = memory * 1024 * 1024;

    const now = new Date();
    const timeoutDate = new Date(
      now.getTime() + duration * 24 * 60 * 60 * 1000,
    );

    await docker.pull("cm2network/garrysmod", (err, stream) => {
      if (err) throw err;
      docker.modem.followProgress(stream, (event) => console.log(event));
    });

    const container = await docker.createContainer({
      Image: "cm2network/garrysmod",
      name: name,
      Tty: true,
      ExposedPorts: {
        "27015/tcp": {},
        "27015/udp": {},
      },
      HostConfig: {
        PortBindings: {
          "27015/tcp": [{ HostPort: port.toString() }],
          "27015/udp": [{ HostPort: port.toString() }],
        },
        Memory: memoryBytes,
        NanoCPUs: cpus * 1e9,
      },
      Env: [
        `SRCDS_TOKEN=your_token`,
        `SRCDS_PORT=${port}`,
        `SRCDS_MAXPLAYERS=16`,
        `SRCDS_MAP=gm_flatgrass`,
      ],
    });

    await container.start();

    const serverId = container.id;
    await connection.execute(
      "INSERT INTO dpanel-server (name, id, owner, timestart, timeout) VALUES (?, ?, ?, ?, ?)",
      [name, serverId, ownerToken, now, timeoutDate],
    );
  } catch (error) {
    console.error("Error creating Garry's Mod server:", error);
  } finally {
  }
};

module.exports = { createGarrysModServer };
