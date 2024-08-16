const express = require("express");
const router = express.Router();
const db = require("../../database/mysql-promise");
const bcrypt = require("bcrypt");

router.post('/add-user', async (req, res) => {
  try {
    const { name, email, password, verified } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query('INSERT INTO user (name, email, password, verify) VALUES (?, ?, ?, ?)', 
    [name, email, hashedPassword, verified === '1']);
    
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/edit-user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, verified } = req.body;

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await db.query('UPDATE user SET name = ?, email = ?, password = ?, verify = ? WHERE id = ?', 
    [name, email, hashedPassword || password, verified === '1', id]);
    
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/delete-user/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM user WHERE id = ?', [id]);
    
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
