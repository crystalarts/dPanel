const express = require("express");
const router = express.Router();

const db = require("../database/mysql-promise");

router.post("/admin/_api/v1/notes", firewallMiddleware, ensureAuthenticated, async (req, res) => {
  if (req.user.admin === 0) {
    return res.render("errors/404");
  } else {
    const note = req.body.content;

    try {
      if (note === undefined || note === null || note === "") {
        const deleteQuery = "DELETE FROM notes";
        await db.query(deleteQuery);
        return res.send("Note deleted successfully.");
      } else {
        const countQuery = "SELECT COUNT(*) AS count FROM notes";
        const [countResult] = await db.query(countQuery);
        const noteCount = countResult[0].count;
  
        if (noteCount === 0) {
          const insertQuery = "INSERT INTO notes (content) VALUES (?)";
          await db.query(insertQuery, [note]);
  
          return res.send("Note added successfully.");
        } else {
          const updateQuery = "UPDATE notes SET content = ?";
          const result = await db.query(updateQuery, [note]);
  
          if (result.affectedRows === 0) {
            return res.status(404).send("No note found to update.");
          }
  
          return res.send("Note updated successfully.");
        }
      }
    } catch (err) {
      return res
        .status(500)
        .send("An error occurred while processing the request.");
    }
  }
});

module.exports = router;