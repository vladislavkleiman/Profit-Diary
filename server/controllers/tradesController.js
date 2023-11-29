const {
  loadTradesIntoDatabase,
  removeDuplicateTrades,
} = require("../models/tradeStatic.model.js");

const loadTradesController = async (req, res) => {
  const userId = req.body.userId || req.query.userId || req.params.userId;
  console.log("loadTradesController начал работу userID", userId);
  try {
    console.log("loadTradesController начал работу userID", userId);
    await loadTradesIntoDatabase(userId);
    await removeDuplicateTrades();
    console.log("loadTradesController закончил работу userID", userId);
    res
      .status(200)
      .json({ message: "Trades processed and loaded successfully" });
  } catch (error) {
    console.error("Error in loadTradesController:", error);
    res.status(500).json({ message: "Error processing trades" });
  }
};

module.exports = {
  loadTradesController,
};
