const { getTradesFromDB } = require("../models/getTradesFromDB.model.js");
const {
  getTradeStatisticsForDay,
} = require("../models/getTradeStatisticsForDay.model.js");

const getTradesController = async (req, res) => {
  console.log("Request received in getTradesController");
  try {
    const isoDateTime = req.query.datetrade;
    const selectedDate = new Date(isoDateTime).toISOString().split("T")[0];
    const userId = req.body.userId || req.query.userId || req.params.userId;

    let trades = await getTradesFromDB(selectedDate, userId);
    trades = trades.map((trade) => ({
      symbol: trade.stock_ticker,
      profit: trade.profit_loss,
      tradeType: trade.trade_type,
      tradeDate: trade.trade_date.toISOString(),
      execTime: trade.exectime,
    }));

    const tradeStatistics = await getTradeStatisticsForDay(
      userId,
      selectedDate
    );

    console.log("Request finished in getTradesController");
    res.json({ trades, tradeStatistics });
  } catch (error) {
    console.error("Error fetching trades:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getTradesController,
};
