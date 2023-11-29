const { db } = require("../config/db.js");

const getUserTradeStatistics = async (userId) => {
  try {
    // Calculate Gross Profit
    const { sum: grossProfit } = await db("statisticoftradesforday")
      .where({ user_id: userId })
      .sum("profitloss as sum")
      .first();

    // Calculate Average Daily Return
    const { count: tradingDays } = await db("statisticoftradesforday")
      .where({ user_id: userId })
      .count("id as count")
      .first();
    const averageDailyReturn = tradingDays ? grossProfit / tradingDays : 0;

    // Calculate Average Profit
    const averageProfitResults = await db("trades")
      .where({ user_id: userId })
      .select(db.raw("AVG(CAST(profit_loss AS NUMERIC)) as avg"));
    const averageProfit = averageProfitResults[0]
      ? averageProfitResults[0].avg
      : 0;

    // Calculate Profit Factor
    const winnerLoser = await db("statisticoftradesforday")
      .where({ user_id: userId })
      .sum("total_winners as winners")
      .sum("total_losers as losers")
      .first();
    const profitFactor = winnerLoser.losers
      ? winnerLoser.winners / winnerLoser.losers
      : 0;

    // Calculate Winrate
    const { sum: totalWinners } = await db("statisticoftradesforday")
      .where({ user_id: userId })
      .sum("total_winners as sum")
      .first();
    const { sum: totalTrades } = await db("statisticoftradesforday")
      .where({ user_id: userId })
      .sum("total_trades as sum")
      .first();
    const winrate = totalTrades ? (totalWinners / totalTrades) * 100 : 0;

    // Get All Trades
    const trades = await db("trades").where({ user_id: userId }).select("*");

    return {
      grossProfit,
      averageDailyReturn,
      averageProfit,
      profitFactor,
      winrate,
      totalTrades: totalTrades,
      trades,
    };
  } catch (error) {
    console.error(
      "Error fetching user trade statistics from the database:",
      error
    );
    throw error;
  }
};

module.exports = {
  getUserTradeStatistics,
};
