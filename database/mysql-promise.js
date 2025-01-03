const mysql = require("mysql2/promise");
require("dotenv").config();

const now = new Date();
const currentDateTime = now.toLocaleString("pl-PL", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

(async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log(
      `*   \x1b[94m[${currentDateTime}]\x1b[0m : \x1b[32m[SUCCESS]\x1b[0m : Connected to \x1b[33mMySQL/promise\x1b[0m \x1b[90m➤\x1b[0m  \x1b[36m` +
        process.env.DB_USER +
        "@" +
        process.env.DB_HOST +
        "/" +
        process.env.DB_NAME +
        "\x1b[0m.",
    );
    connection.release();
  } catch (err) {
    console.error(
      `*   \x1b[94m[${currentDateTime}]\x1b[0m : \x1b[31m[ERROR]\x1b[0m : Error connecting to the database:`,
      err.stack,
    );
  }
})();

module.exports = db;
