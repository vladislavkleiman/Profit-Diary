const {
  getUserTradeStatistics,
} = require("../models/getUserTradeStatistics.model");

const tradeStatisticsController = async (req, res) => {
  const userId = req.params.userId;

  try {
    const statistics = await getUserTradeStatistics(userId);
    res.json(statistics);
  } catch (error) {
    console.error("Error in tradeStatisticsController:", error);
    res.status(500).send("Error fetching trade statistics.");
  }
};

module.exports = {
  tradeStatisticsController,
};
