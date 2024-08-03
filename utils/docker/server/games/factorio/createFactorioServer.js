const generateUniqueName = require("../../../manager/generateUniqueName");
const db = require("../../../../../mysql-promise");

const Docker = require("dockerode");
const docker = new Docker();

const createFactorioServer = async (config) => {
  const connection = db;

  try {
    const { ownerToken, memory, cpus, port, duration } = config;

    const name = await generateUniqueName("factorio");

    const memoryBytes = memory * 1024 * 1024;

    const now = new Date();
    const timeoutDate = new Date(
      now.getTime() + duration * 24 * 60 * 60 * 1000,
    );

    await docker.pull("factoriotools/factorio", (err, stream) => {
      if (err) throw err;
      docker.modem.followProgress(stream, (event) => console.log(event));
    });

    const container = await docker.createContainer({
      Image: "factoriotools/factorio",
      name: name,
      Tty: true,
      ExposedPorts: {
        "34197/udp": {},
      },
      HostConfig: {
        PortBindings: {
          "34197/udp": [
            {
              HostPort: port.toString(),
            },
          ],
        },
        Memory: memoryBytes,
        NanoCPUs: cpus * 1e9,
      },
      Env: [`PORT=${port}`, `MAX_PLAYERS=16`],
    });
    await container.start();

    const serverId = container.id;
    await connection.execute(
      "INSERT INTO dpanel-server (name, id, owner, timestart, timeout) VALUES (?, ?, ?, ?, ?)",
      [name, serverId, ownerToken, now, timeoutDate],
    );
  } catch (error) {
    console.error("Error creating Factorio server:", error);
  } finally {
  }
};

module.exports = { createFactorioServer };
