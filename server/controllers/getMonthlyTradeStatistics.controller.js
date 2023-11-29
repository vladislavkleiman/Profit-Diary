const {
  getMonthlyTradeStats,
} = require("../models/getMonthlyTradeStatistics.model.js");

const getMonthlyTradeStatsController = async (req, res) => {
  try {
    const userId = req.headers["user-id"];
    const year = parseInt(req.headers["year"]);
    const month = parseInt(req.headers["month"]);
    console.log(
      "getMonthlyTradeStats Controller начал работу userid, year,month ",
      userId,
      year,
      month
    );

    console.log("getMonthlyTradeStatsController userid", userId);

    if (!(year >= 1000 && year <= 9999) || !(month >= 1 && month <= 12)) {
      return res.status(400).send("Invalid year or month format");
    }

    const tradeStats = await getMonthlyTradeStats(year, month, userId);

    console.log(
      "getMonthlyTradeStatsController year, month, userId",
      year,
      month,
      userId
    );

    res.json(tradeStats);
    console.log("getMonthlyTradeStatsController закончил работу");
  } catch (error) {
    console.error("Error in fetching trade statistics:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getMonthlyTradeStatsController,
};
