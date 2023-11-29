const express = require("express");
const getUserTradeStatisticsRoute = express.Router();
const {
  tradeStatisticsController,
} = require("../controllers/getUserTradeStatistics.controller.js");

getUserTradeStatisticsRoute.get(
  "/user/:userId/statistics",
  tradeStatisticsController
);

module.exports = { getUserTradeStatisticsRoute };
