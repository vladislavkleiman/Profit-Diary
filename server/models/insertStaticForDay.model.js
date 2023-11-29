const { db } = require("../config/db.js");

async function calculateAndInsertTradeStatistics(selectedDate, userId) {
  try {
    // Calculate Profit/Loss
    const profitLossResult = await db.raw(
      `
            SELECT SUM(profit_loss::NUMERIC) AS profitloss
            FROM trades
            WHERE trade_date = ? AND user_id = ?`,
      [selectedDate, userId]
    );
    const profitLoss = profitLossResult.rows[0].profitloss;

    // Calculate Total Winners
    const totalWinnersResult = await db.raw(
      `
            SELECT COUNT(*) AS total_winners
            FROM trades
            WHERE profit_loss::NUMERIC >= 0 AND trade_date = ? AND user_id = ?`,
      [selectedDate, userId]
    );
    const totalWinners = totalWinnersResult.rows[0].total_winners;

    // Calculate Total Losers
    const totalLosersResult = await db.raw(
      `
            SELECT COUNT(*) AS total_losers
            FROM trades
            WHERE profit_loss::NUMERIC < 0 AND trade_date = ? AND user_id = ?`,
      [selectedDate, userId]
    );
    const totalLosers = totalLosersResult.rows[0].total_losers;

    // Calculate Total Trades
    const totalTradesResult = await db.raw(
      `
            SELECT COUNT(*) AS total_trades
            FROM trades
            WHERE trade_date = ? AND user_id = ?`,
      [selectedDate, userId]
    );
    const totalTrades = totalTradesResult.rows[0].total_trades;

    // Calculate Average Return
    const avgReturn = totalTrades > 0 ? profitLoss / totalTrades : 0;

    // Calculate Total Long
    const totalLongResult = await db.raw(
      `
            SELECT COUNT(*) AS total_long
            FROM trades
            WHERE trade_type = 'Long' AND trade_date = ? AND user_id = ?`,
      [selectedDate, userId]
    );
    const totalLong = totalLongResult.rows[0].total_long;

    // Calculate Total Shorts
    const totalShortsResult = await db.raw(
      `
            SELECT COUNT(*) AS total_shorts
            FROM trades
            WHERE trade_type = 'Short' AND trade_date = ? AND user_id = ?`,
      [selectedDate, userId]
    );
    const totalShorts = totalShortsResult.rows[0].total_shorts;

    // Calculate Win Rate
    const winRate = totalTrades > 0 ? (totalWinners / totalTrades) * 100 : 0;

    // Insert data into statisticoftradesforday
    await db("statisticoftradesforday").insert({
      date_trade: selectedDate,
      user_id: userId,
      profitloss: profitLoss,
      total_winners: totalWinners,
      total_losers: totalLosers,
      total_trades: totalTrades,
      avg_return: avgReturn,
      total_long: totalLong,
      total_shorts: totalShorts,
      win_rate: winRate,
    });

    console.log("Trade statistics inserted successfully for date:", selectedDate);
  } catch (error) {
    console.error("Error calculating and inserting trade statistics:", error);
    throw error;
  }
}

module.exports = {
  calculateAndInsertTradeStatistics,
};
