const express = require("express");
const tradesRouter = express.Router();
const { loadTradesController } = require("../controllers/tradesController");

tradesRouter.post("/loadTrades", loadTradesController);

module.exports = { tradesRouter };
