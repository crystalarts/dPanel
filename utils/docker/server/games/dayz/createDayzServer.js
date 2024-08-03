const generateUniqueName = require("../../../manager/generateUniqueName");
const db = require("../../../../../mysql-promise");

const Docker = require("dockerode");
const docker = new Docker();

const createDayzServer = async (config) => {
  const connection = db;

  try {
    const { ownerToken, memory, cpus, port, duration } = config;

    const name = await generateUniqueName("dayz");

    const memoryBytes = memory * 1024 * 1024;

    const now = new Date();
    const timeoutDate = new Date(
      now.getTime() + duration * 24 * 60 * 60 * 1000,
    );

    await docker.pull("didstopia/dayz-server", (err, stream) => {
      if (err) throw err;
      docker.modem.followProgress(stream, (event) => console.log(event));
    });

    const container = await docker.createContainer({
      Image: "didstopia/dayz-server",
      name: name,
      Tty: true,
      ExposedPorts: {
        "2302/udp": {},
        "27016/tcp": {},
      },
      HostConfig: {
        PortBindings: {
          "2302/udp": [
            {
              HostPort: port.toString(),
            },
          ],
          "27016/tcp": [
            {
              HostPort: (port + 1).toString(),
            },
          ],
        },
        Memory: memoryBytes,
        NanoCPUs: cpus * 1e9,
      },
      Env: [`PORT=${port}`],
    });

    await container.start();

    const serverId = container.id;
    await connection.execute(
      "INSERT INTO dpanel-server (name, id, owner, timestart, timeout) VALUES (?, ?, ?, ?, ?)",
      [name, serverId, ownerToken, now, timeoutDate],
    );
  } catch (error) {
    console.error("Error creating DayZ server:", error);
  } finally {
  }
};

module.exports = { createDayzServer };
