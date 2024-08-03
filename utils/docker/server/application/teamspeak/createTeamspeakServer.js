const generateUniqueName = require("../../../manager/generateUniqueName");
const db = require("../../../../../mysql-promise");

const Docker = require("dockerode");
const docker = new Docker();

const createTeamspeakServer = async (config) => {
  const connection = db;

  try {
    const { ownerToken, memory, cpus, ports, duration } = config;

    const name = await generateUniqueName("teamspeak");

    const memoryBytes = memory * 1024 * 1024;

    const now = new Date();
    const timeoutDate = new Date(
      now.getTime() + duration * 24 * 60 * 60 * 1000,
    );

    await docker.pull("teamspeak", (err, stream) => {
      if (err) throw err;
      docker.modem.followProgress(stream, (event) => console.log(event));
    });

    const container = await docker.createContainer({
      Image: "teamspeak",
      name: name,
      Tty: true,
      ExposedPorts: {
        [`${ports.server}/tcp`]: {},
        [`${ports.query}/tcp`]: {},
      },
      HostConfig: {
        PortBindings: {
          [`${ports.server}/tcp`]: [
            {
              HostPort: ports.server.toString(),
            },
          ],
          [`${ports.query}/tcp`]: [
            {
              HostPort: ports.query.toString(),
            },
          ],
        },
        Memory: memoryBytes,
        NanoCPUs: cpus * 1e9,
      },
      Env: [`SERVER_PORT=${ports.server}`, `QUERY_PORT=${ports.query}`],
    });

    await container.start();

    const serverId = container.id;
    await connection.execute(
      "INSERT INTO dpanel-server (name, id, owner, timestart, timeout) VALUES (?, ?, ?, ?, ?)",
      [name, serverId, ownerToken, now, timeoutDate],
    );
  } catch (error) {
    console.error("Error creating TeamSpeak server:", error);
  }
};

module.exports = { createTeamspeakServer };
