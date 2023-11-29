const { db } = require("../config/db.js");

async function getTradeStatisticsForDay(userId, selectedDate) {
  try {
    const queryResult = await db
      .select(
        "profitloss",
        "total_winners",
        "total_losers",
        "total_trades",
        "avg_return",
        "total_long",
        "total_shorts",
        "win_rate"
      )
      .from("statisticoftradesforday")
      .where({
        user_id: userId,
        date_trade: selectedDate,
      })
      .first();

    if (queryResult) {
      console.log(
        "Trade statistics fetched successfully for user:",
        userId,
        "and date:",
        selectedDate
      );
      return queryResult;
    } else {
      console.log(
        "No trade statistics found for user:",
        userId,
        "and date:",
        selectedDate
      );
      return null;
    }
  } catch (error) {
    console.error("Error fetching trade statistics:", error);
    throw error;
  }
}

module.exports = { getTradeStatisticsForDay };
