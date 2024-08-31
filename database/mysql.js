const mysql = require("mysql2");
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

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error(
      `*   \x1b[94m[${currentDateTime}]\x1b[0m : \x1b[31m[ERROR]\x1b[0m : Error connecting to the database:`,
      err.stack,
    );
    return;
  }
  console.log(
    `*   \x1b[94m[${currentDateTime}]\x1b[0m : \x1b[32m[SUCCESS]\x1b[0m : Connected to \x1b[33mMySQL\x1b[0m \x1b[90m➤\x1b[0m  \x1b[36m` +
      process.env.DB_USER +
      "@" +
      process.env.DB_HOST +
      "/" +
      process.env.DB_NAME +
      "\x1b[0m.",
  );
});

module.exports = db;
