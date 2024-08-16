const express = require("express");
const router = express.Router();
const db = require("../../database/mysql-promise");

router.post('/add-user', (req, res) => {
  const { name, email, password, verified } = req.body;
  db.query('INSERT INTO user (name, email, password, verify) VALUES (?, ?, ?, ?)', 
  [name, email, password, verified === '1'], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

router.post('/edit-user/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, password, verified } = req.body;
  db.query('UPDATE user SET name = ?, email = ?, password = ?, verify = ? WHERE id = ?', 
  [name, email, password, verified === '1', id], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

router.post('/delete-user/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM user WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

module.exports = router;