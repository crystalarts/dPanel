const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

(async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('Connected to MySQL/promise : ' + process.env.DB_USER + '@' + process.env.DB_HOST + '/' + process.env.DB_NAME);
    connection.release();
  } catch (err) {
    console.error('Error connecting to the database:', err.stack);
  }
})();

module.exports = db;