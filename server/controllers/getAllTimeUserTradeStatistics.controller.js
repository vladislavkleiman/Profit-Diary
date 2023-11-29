const {
  getUserTradeStatistics,
} = require("../models/getAllTimeUserTradeStatistics.model.js");

const getAllTimeTradeStatistics = async (req, res) => {
  try {
    const userId = req.params.userId;
    const statistics = await getUserTradeStatistics(userId);

    res.json(statistics);
  } catch (error) {
    console.error("Error fetching user trade statistics:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllTimeTradeStatistics,
};
