const express = require("express");
const router = express.Router();
const db = require("../../database/mysql-promise");

const { ensureAuthenticated } = require("../../app/config/auth");
const firewallMiddleware = require("../../utils/system/firewallMiddleware");

router.get(
  "/admin/api",
  firewallMiddleware,
  ensureAuthenticated,
  async (req, res, next) => {
    try {
      if (req.user.admin === 0) {
        return res.render("errors/404");
      } else {
        const apiTokensQuery = "SELECT * FROM api_tokens";
        const [apiTokens] = await db.query(apiTokensQuery);

        res.render("storage/dashboard/api", {
          user: req.user,
          apiTokens: apiTokens,
        });
      }
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
