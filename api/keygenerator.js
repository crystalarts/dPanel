const { v4: uuidv4 } = require("uuid");

const db = require("../database/mysql-promise");
const express = require("express");
const router = express.Router();

router.post("/_api/v1/keygenerator/create", async (req, res) => {
  const {
    servers,
    nodes,
    allocations,
    dbhost,
    users,
    mounts,
    dbservers,
    whitelistIpv4,
    description,
  } = req.body;

  if (!req.user || !req.user.admin === 1) {
    return res.status(401).send("Unauthorized");
  }

  const apiKey = uuidv4();

  const lastUsed = null;
  const created = new Date();
  const createdBy = req.user.name;

  const query = `
        INSERT INTO api_tokens (\`key\`, description, last_used, created, created_by, servers, nodes, allocations, users, dbhost, dbservers, mounts)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  const values = [
    apiKey,
    description,
    lastUsed,
    created,
    createdBy,
    servers,
    nodes,
    allocations,
    users,
    dbhost,
    dbservers,
    mounts,
  ];

  await db
    .query(query, values)
    .then(res.status(200).send("API Key deleted successfully"))
    .catch((err) => res.status(500).send("Error deleting API Key"));
});

router.delete("/_api/v1/keygenerator/delete", async (req, res) => {
  const { key } = req.query;

  if (!key) {
    console.error("API key is required");
    return res.status(400).send("API key is required");
  }

  const query = "DELETE FROM api_tokens WHERE `key` = ?";

  await db
    .query(query, [key])
    .then(res.status(200).send("API Key deleted successfully"))
    .catch((err) => res.status(500).send("Error deleting API Key"));
});

router.get("/_api/v1/keygenerator/edit", async (req, res) => {});

module.exports = router;
