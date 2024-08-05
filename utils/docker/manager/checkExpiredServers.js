const db = require("../../../mysql-promise");

async function checkExpiredServers() {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM server WHERE timeout < NOW()",
    );
    for (const row of rows) {
      const container = docker.getContainer(row.id);
      await container.stop();
      await container.remove();
      await db.execute("DELETE FROM server WHERE id = ?", [row.id]);
    }
  } catch (error) {
    console.error("Error checking for expired servers:", error);
  }
}

module.exports = checkExpiredServers;
