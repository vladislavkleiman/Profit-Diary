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
      .avg({ avg: db.raw("CAST(profit_loss AS NUMERIC)") });
    const averageProfit = averageProfitResults[0]?.avg || 0;

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

    // Get the trade with the biggest loss
    const biggestLoss = await db("trades")
      .where({ user_id: userId })
      .whereRaw("CAST(profit_loss AS NUMERIC) < 0")
      .orderByRaw("CAST(profit_loss AS NUMERIC)")
      .first();

    // Get the trade with the biggest profit
    const biggestProfit = await db("trades")
      .where({ user_id: userId })
      .whereRaw("CAST(profit_loss AS NUMERIC) > 0")
      .orderByRaw("CAST(profit_loss AS NUMERIC) DESC")
      .first();

    // Calculate profit/loss ratio
    const { avg: averageProfitPositive } = await db("trades")
      .whereRaw("user_id = ? AND CAST(profit_loss AS NUMERIC) > 0", [userId])
      .avg({ avg: db.raw("CAST(profit_loss AS NUMERIC)") })
      .first();

    const { avg: averageLossNegative } = await db("trades")
      .whereRaw("user_id = ? AND CAST(profit_loss AS NUMERIC) < 0", [userId])
      .avg({ avg: db.raw("CAST(profit_loss AS NUMERIC)") })
      .first();

    const profitLossRatio = averageLossNegative
      ? averageProfitPositive / -averageLossNegative
      : 0;

    // Calculate return $ on long trades
    const { sum: returnOnLong } = await db("trades")
      .where({ user_id: userId, trade_type: "Long" }) // Replace 'type' with the correct column name
      .sum({ sum: db.raw("CAST(profit_loss AS NUMERIC)") })
      .first();

    // Calculate return $ on short trades
    const { sum: returnOnShort } = await db("trades")
      .where({ user_id: userId, trade_type: "Short" }) // Replace 'type' with the correct column name
      .sum({ sum: db.raw("CAST(profit_loss AS NUMERIC)") })
      .first();

    // Calculate average $ on losers
    const { avg: averageLosses } = await db("trades")
      .whereRaw("user_id = ? AND CAST(profit_loss AS NUMERIC) < 0", [userId])
      .avg({ avg: db.raw("CAST(profit_loss AS NUMERIC)") })
      .first();

    // Calculate average $ on winners
    const { avg: averageWinners } = await db("trades")
      .whereRaw("user_id = ? AND CAST(profit_loss AS NUMERIC) > 0", [userId])
      .avg({ avg: db.raw("CAST(profit_loss AS NUMERIC)") })
      .first();

    // Get All Trades
    const trades = await db("trades").where({ user_id: userId }).select("*");

    // Return all calculated statistics
    return {
      grossProfit,
      averageDailyReturn,
      averageProfit,
      profitFactor,
      winrate,
      totalTrades: totalTrades,
      biggestLoss,
      biggestProfit,
      profitLossRatio,
      returnOnLong,
      returnOnShort,
      averageLosses,
      averageWinners,
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
