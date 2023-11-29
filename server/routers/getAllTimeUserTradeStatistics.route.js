const express = require("express");
const getAllTimeUserTradeStatisticsRoute = express.Router();
const {
  getAllTimeTradeStatistics,
} = require("../controllers/getAllTimeUserTradeStatistics.controller.js");

getAllTimeUserTradeStatisticsRoute.get(
  "/user/:userId/trade-statistics",
  getAllTimeTradeStatistics
);

module.exports = { getAllTimeUserTradeStatisticsRoute };
