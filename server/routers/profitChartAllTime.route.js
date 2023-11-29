const express = require("express");
const getProfitForUserAllTimeRouter = express.Router();
const {
  getProfitForUserAllTime,
} = require("../controllers/profitChartAllTime.controller.js");

getProfitForUserAllTimeRouter.get(
  "/user/trades/profit/:userId",
  getProfitForUserAllTime
);

module.exports = { getProfitForUserAllTimeRouter };
