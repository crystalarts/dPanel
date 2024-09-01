const express = require("express");
const router = express.Router();
const db = require("../../database/mysql-promise");
const bcrypt = require("bcrypt");

router.post("/add-user", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO user (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
    );

    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/edit-user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await db.query(
      "UPDATE user SET name = ?, email = ?, password = ? WHERE id = ?",
      [name, email, hashedPassword || password, id],
    );

    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/edit-useroauth/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await db.query(
      "UPDATE users_oauth SET name = ?, email = ?, password = ? WHERE id = ?",
      [name, email, hashedPassword || password, id],
    );

    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/delete-user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM user WHERE id = ?", [id]);

    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/delete-useroauth/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM users_oauth WHERE id = ?", [id]);

    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
