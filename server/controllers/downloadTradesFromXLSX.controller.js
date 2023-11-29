const {
  insertDataFromExcel,
  getTradesData,
} = require("../models/downloadTradesFromXLSX.model");

const {
  loadTradesIntoDatabase,
  removeDuplicateTrades,
} = require("../models/tradeStatic.model.js");

const {
  calculateAndInsertTradeStatistics,
} = require("../models/insertStaticForDay.model.js");

const insertTradeData = async (req, res) => {
  const userId = req.body.userId || req.query.userId || req.params.userId;
  try {
    const filePath = req.file.path;
    const tradeDates = await insertDataFromExcel(filePath, userId);
    await loadTradesIntoDatabase(userId);
    await removeDuplicateTrades();

    for (const selectedDate of tradeDates) {
      await calculateAndInsertTradeStatistics(selectedDate, userId);
    }

    res
      .status(200)
      .json({ message: "Data successfully inserted", data: tradeDates });
  } catch (error) {
    console.error("Error in insertTradeData controller:", error);
    res
      .status(500)
      .json({ message: "Error inserting data", error: error.message });
  }
};

const getAllTradesData = async (req, res) => {
  const { date } = req.query;
  try {
    const trades = await getTradesData(date);
    res.status(200).json({ message: "Data fetched successfully" });
  } catch (error) {
    console.error("Error querying database:", error);
    res
      .status(500)
      .json({ message: "Error fetching data", error: error.message });
  }
};

module.exports = {
  insertTradeData,
  getAllTradesData,
};
