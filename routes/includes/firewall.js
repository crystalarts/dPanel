const express = require("express");
const router = express.Router();
const db = require("../../database/mysql-promise");

router.post('/save', async (req, res) => {
    const { on, direction, type, interfaces, protocol, comment, id } = req.body;
    if (!interfaces) {
        return res.status(400).json({ success: false, message: 'Pole interfaces jest wymagane' });
    }

    let query;
    const queryParams = [on, type, interfaces, direction, protocol, comment];

    try {
        if (!id) {
            query = `
                INSERT INTO firewall (\`on\`, type, interfaces, direction, protocol, comment)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            await db.query(query, queryParams);
        } else {
            query = `
                UPDATE firewall 
                SET \`on\` = ?, type = ?, interfaces = ?, direction = ?, protocol = ?, comment = ?
                WHERE id = ?
            `;
            queryParams.push(id);
            await db.query(query, queryParams);
        }
        res.json({ success: true, message: 'Dane zostały zapisane pomyślnie' });
    } catch (err) {
        console.error('Błąd przy zapisie do bazy:', err);
        res.status(500).json({ success: false, message: 'Błąd serwera' });
    }
});

router.post("/delete/:id", async (req, res) => {
    const id = req.params.id;

    try {
        await db.query("DELETE FROM firewall WHERE id = ?", [id]);
        res.json({ success: true, message: "Firewall usunięty." });
    } catch (err) {
        console.error('Błąd przy usuwaniu z bazy:', err);
        res.status(500).json({ success: false, message: "Błąd serwera przy usuwaniu firewalla." });
    }
});

module.exports = router;
