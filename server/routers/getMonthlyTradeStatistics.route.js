const express = require("express");
const getMonthlyTradeStatsRoute = express.Router();
const {
  getMonthlyTradeStatsController,
} = require("../controllers/getMonthlyTradeStatistics.controller");

getMonthlyTradeStatsRoute.get("/", getMonthlyTradeStatsController);

module.exports = { getMonthlyTradeStatsRoute };
