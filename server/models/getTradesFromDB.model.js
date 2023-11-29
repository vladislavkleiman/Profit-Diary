const { db } = require("../config/db.js");

const getTradesFromDB = async (selectedDate, userId) => {
  console.log("запрос получен в getTradesFromDBnodel");
  console.log(
    "Request received in model to fetch trades for date:",
    selectedDate
  );
  try {
    const formattedDate = new Date(selectedDate).toISOString().split("T")[0];

    const trades = await db("trades")
      .select("*")
      .where({ trade_date: formattedDate, user_id: userId })
      .orderBy("exectime");

    console.log("Formatted Date in Model:", formattedDate);
    console.log("Trades fetched and sorted by execution time:", trades);
    console.log("getTradesFromDB model закончил работу");
    return trades;
  } catch (error) {
    console.error("Error fetching trades from the database:", error);
    throw error;
  }
};

module.exports = {
  getTradesFromDB,
};
