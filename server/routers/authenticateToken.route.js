const express = require("express");
const authenticateTokenRoute = express.Router();

const { authenticateToken } = require("../controllers/authenticateToken.js");


authenticateTokenRoute.get(
  "/protected-route",
  authenticateToken,
  (req, res) => {
    res.send("Access to protected data");
  }
);

module.exports = { authenticateTokenRoute };
