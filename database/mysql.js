const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error(
      "*   \x1b[31m[ERROR]\x1b[0m : Error connecting to the database:",
      err.stack,
    );
    return;
  }
  console.log(
    "*   \x1b[32m[SUCCESS]\x1b[0m : Connected to MySQL \x1b[90m➤\x1b[0m  \x1b[36m" +
      process.env.DB_USER +
      "@" +
      process.env.DB_HOST +
      "/" +
      process.env.DB_NAME +
      "\x1b[0m.",
  );
});

module.exports = db;
