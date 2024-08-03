const generateUniqueName = require("../../../manager/generateUniqueName");
const db = require("../../../../../mysql-promise");

const Docker = require("dockerode");
const docker = new Docker();

const createMinecraftServer = async (config) => {
  const connection = db;

  try {
    const { ownerToken, memory, cpus, port, duration } = config;

    const name = await generateUniqueName("minecraft");

    const memoryBytes = memory * 1024 * 1024;
    const now = new Date();
    const timeoutDate = new Date(
      now.getTime() + duration * 24 * 60 * 60 * 1000,
    );

    await docker.pull("itzg/minecraft-server", (err, stream) => {
      if (err) throw err;
      docker.modem.followProgress(stream, (event) => console.log(event));
    });

    const container = await docker.createContainer({
      Image: "itzg/minecraft-server",
      name: name,
      Tty: true,
      ExposedPorts: {
        "25565/tcp": {},
      },
      HostConfig: {
        PortBindings: {
          "25565/tcp": [
            {
              HostPort: port.toString(),
            },
          ],
        },
        Memory: memoryBytes,
        NanoCPUs: cpus * 1e9,
      },
      Env: ["EULA=TRUE", `MEMORY=${memory}M`],
    });

    await container.start();

    const serverId = container.id;
    await connection.execute(
      "INSERT INTO dpanel-server (name, id, owner, timestart, timeout) VALUES (?, ?, ?, ?, ?)",
      [name, serverId, ownerToken, now, timeoutDate],
    );
  } catch (error) {
    console.error("Error creating Minecraft server:", error);
  } finally {
  }
};

module.exports = {
  createMinecraftServer,
};
