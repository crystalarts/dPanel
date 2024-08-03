const generateUniqueName = require("../../../manager/generateUniqueName");
const db = require("../../../../../mysql-promise");

const Docker = require("dockerode");
const docker = new Docker();

const createProjectZomboidServer = async (config) => {
  const connection = db;

  try {
    const { ownerToken, memory, cpus, ports, duration } = config;

    const name = await generateUniqueName("projectzomboid");

    const memoryBytes = memory * 1024 * 1024;

    const now = new Date();
    const timeoutDate = new Date(
      now.getTime() + duration * 24 * 60 * 60 * 1000,
    );

    await docker.pull("zomboid/project-zomboid-server", (err, stream) => {
      if (err) throw err;
      docker.modem.followProgress(stream, (event) => console.log(event));
    });

    const container = await docker.createContainer({
      Image: "zomboid/project-zomboid-server",
      name: name,
      Tty: true,
      ExposedPorts: {
        [`${ports.tcp}/tcp`]: {},
        [`${ports.udp}/udp`]: {},
      },
      HostConfig: {
        PortBindings: {
          [`${ports.tcp}/tcp`]: [
            {
              HostPort: ports.tcp.toString(),
            },
          ],
          [`${ports.udp}/udp`]: [
            {
              HostPort: ports.udp.toString(),
            },
          ],
        },
        Memory: memoryBytes,
        NanoCPUs: cpus * 1e9,
      },
      Env: [`TCP_PORT=${ports.tcp}`, `UDP_PORT=${ports.udp}`],
    });

    await container.start();

    const serverId = container.id;
    await connection.execute(
      "INSERT INTO dpanel-server (name, id, owner, timestart, timeout) VALUES (?, ?, ?, ?, ?)",
      [name, serverId, ownerToken, now, timeoutDate],
    );
  } catch (error) {
    console.error("Error creating Project Zomboid server:", error);
  } finally {
  }
};

module.exports = { createProjectZomboidServer };
