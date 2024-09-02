require("dotenv").config();
const mysql = require("../../database/mysql-promise");
const { v4: uuidv4 } = require("uuid");

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
      "INSERT INTO users_oauth (oauth_provider, oauth_id, username, email, admin, servers, verify, token, twofa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        provider,
        profile.id,
        profile.username || profile.displayName,
        (profile.emails && profile.emails[0] && profile.emails[0].value) || "",
        0,
        JSON.stringify([]),
        1,
        uuidv4(),
        0,
      ],
    );

    if (!result.insertId) {
      throw new Error("Błąd podczas wstawiania użytkownika - brak insertId");
    }

    const [newUser] = await mysql.execute(
      "SELECT * FROM users_oauth WHERE id = ?",
      [result.insertId],
    );

    if (newUser.length === 0) {
      throw new Error("Nie znaleziono nowo wstawionego użytkownika");
    }

    done(null, newUser[0]);
  } catch (err) {
    console.error("Błąd podczas findOrCreateUser:", err);
    done(err);
  }
}

module.exports = findOrCreateUser;
