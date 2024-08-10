const { v4: uuidv4 } = require("uuid");
const db = require("../../../database/mysql-promise");

async function generateUniqueName(nameserver) {
  let isUnique = false;
  let name;
  while (!isUnique) {
    name = `${nameserver}_${uuidv4()}`;
    const [rows] = await db.execute(
      "SELECT COUNT(*) AS count FROM server WHERE name = ?",
      [name],
    );
    if (rows[0].count === 0) {
      isUnique = true;
    }
  }
  return name;
}

module.exports = generateUniqueName;
