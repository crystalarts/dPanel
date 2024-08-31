require("dotenv").config();
const mysql = require("../../database/mysql-promise");

async function findOrCreateUser(provider, profile, done) {
  try {
    const [rows] = await mysql.execute(
      "SELECT * FROM users_oauth WHERE oauth_provider = ? AND oauth_id = ?",
      [provider, profile.id],
    );
    if (rows.length > 0) {
      return done(null, rows[0]);
    }

    const [result] = await mysql.execute(
      "INSERT INTO users_oauth (oauth_provider, oauth_id, username, email) VALUES (?, ?, ?, ?)",
      [
        provider,
        profile.id,
        profile.username || profile.displayName,
        profile.emails[0].value,
      ],
    );

    const [newUser] = await mysql.execute(
      "SELECT * FROM users_oauth WHERE id = ?",
      [result.insertId],
    );
    done(null, newUser[0]);
  } catch (err) {
    done(err);
  }
}

module.exports = findOrCreateUser;
