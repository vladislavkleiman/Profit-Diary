const { db } = require("../config/db.js");

const getMonthlyTradeStats = async (year, month, userId) => {
  console.log("getMonthlyTradeStats model начал работу userID", userId);
  try {
    const startDate = new Date(Date.UTC(year, month - 1, 1))
      .toISOString()
      .split("T")[0];
    const endDate = new Date(Date.UTC(year, month, 0))
      .toISOString()
      .split("T")[0];

    console.log("Fetching trade stats for period:", startDate, "to", endDate);
    console.log("getMonthlyTradeStats model год и месяц,", year, month);

    const tradeStats = await db("statisticoftradesforday")
      .select("total_trades", "profitloss", "date_trade")
      .where("user_id", userId)
      .andWhere("date_trade", ">=", startDate)
      .andWhere("date_trade", "<=", endDate)
      .orderBy("date_trade");

    console.log("Trade statistics for user:", userId, "fetched successfully.");
    console.log(tradeStats);
    console.log("getMonthlyTradeStats model закончил работу");
    return tradeStats;
  } catch (error) {
    console.error(
      "Error fetching monthly trade statistics from database:",
      error
    );
    throw error;
  }
};

module.exports = {
  getMonthlyTradeStats,
};
