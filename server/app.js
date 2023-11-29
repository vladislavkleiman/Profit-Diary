const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { authRouter } = require("./routers/auth.route.js");
const {
  downloadTradesFromXLSXRouter,
} = require("./routers/downloadTradesFromXLSX.route.js");
const { tradesRouter } = require("./routers/trades.route.js");
const { tradeStaticRoute } = require("./routers/tradeStatic.route.js");
const { getTradesRouter } = require("./routers/getTradesFromDB.route.js");
const {
  authenticateTokenRoute,
} = require("./routers/authenticateToken.route.js");
const {
  getMonthlyTradeStatsRoute,
} = require("../server/routers/getMonthlyTradeStatistics.route.js");
const {
  deleteDataForDateAndUserRoute,
} = require("../server/routers/deleteDataForUserAndDate.route.js");

const {
  getUserTradeStatisticsRoute,
} = require("../server/routers/getUserTradeStatistics.route.js");

const {
  getAllTimeUserTradeStatisticsRoute,
} = require("../server/routers/getAllTimeUserTradeStatistics.route.js");

const {
  getProfitForUserAllTimeRouter,
} = require("../server/routers/profitChartAllTime.route.js");

const app = express();
app.use(cookieParser());

app.use((req, res, next) => {
  console.log("Incoming request:", req.path);
  next();
});
app.use(express.static("client"));
app.use(express.json());
app.use(cors());
app.use("/profitdiary/user-statistics", getUserTradeStatisticsRoute);
app.use("/profitdiary/trade-stats", getMonthlyTradeStatsRoute);
app.use("/profitdiary/daily-trades", getTradesRouter);
app.use("/profitdiary/trades-upload", downloadTradesFromXLSXRouter);
app.use("/profitdiary/trades-api", tradesRouter);
app.use("/profitdiary/trade-summary", tradeStaticRoute);
app.use("/profitdiary/delete-data", deleteDataForDateAndUserRoute);
app.use(
  "/profitdiary/all-time-user-statistics",
  getAllTimeUserTradeStatisticsRoute
);
app.use("/profitdiary/chart-profit", getProfitForUserAllTimeRouter);

app.use("/profitdiary/auth", authRouter);
app.use("/profitdiary", authenticateTokenRoute);

app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).send("Something broke!");
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
