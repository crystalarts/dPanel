const generateUniqueName = require("../../../manager/generateUniqueName");
const db = require("../../../../../mysql-promise");

const Docker = require("dockerode");
const docker = new Docker();

const createNginxServer = async (config) => {
  const connection = db;

  try {
    const { ownerToken, ports, duration } = config;

    const name = await generateUniqueName("nginx");

    const now = new Date();
    const timeoutDate = new Date(
      now.getTime() + duration * 24 * 60 * 60 * 1000,
    );

    await docker.pull("nginx", (err, stream) => {
      if (err) throw err;
      docker.modem.followProgress(stream, (event) => console.log(event));
    });

    const container = await docker.createContainer({
      Image: "nginx",
      name: name,
      ExposedPorts: {
        [`${ports.http}/tcp`]: {},
      },
      HostConfig: {
        PortBindings: {
          [`${ports.http}/tcp`]: [
            {
              HostPort: ports.http.toString(),
            },
          ],
        },
      },
    });

    await container.start();

    const serverId = container.id;
    await connection.execute(
      "INSERT INTO dpanel-server (name, id, owner, timestart, timeout) VALUES (?, ?, ?, ?, ?)",
      [name, serverId, ownerToken, now, timeoutDate],
    );
  } catch (error) {
    console.error("Error creating NGINX server:", error);
  }
};

module.exports = { createNginxServer };
