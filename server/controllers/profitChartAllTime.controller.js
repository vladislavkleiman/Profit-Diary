const {
  getProfitAllTimeforUser,
} = require("../models/profitChartAllTime.model.js");

const getProfitForUserAllTime = async (req, res) => {
  try {
    const userId = req.params.userId;
    const statistics = await getProfitAllTimeforUser(userId);
    res.json(statistics);
  } catch (error) {
    res.status(500).send("Error fetching trade statistics");
  }
};

module.exports = {
  getProfitForUserAllTime,
};
