const { db } = require("../config/db.js");

const deleteDataForUserAndDate = async (selectedDate, userId) => {
  try {
    const formattedDate = new Date(selectedDate).toISOString().split("T")[0];

    await db.transaction(async (trx) => {
      await trx("statisticoftradesforday")
        .where({ date_trade: formattedDate, user_id: userId })
        .del();

      // Make sure to use the correct case for column names
      await trx("tradestransaction")
        .where({ datetrades: formattedDate, user_id: userId }) // Adjusted to lowercase
        .del();

      await trx("trades")
        .where({ trade_date: formattedDate, user_id: userId })
        .del();
    });

    console.log("Data deleted for user:", userId, "and date:", formattedDate);
  } catch (error) {
    console.error("Error deleting data from the database:", error);
    throw error;
  }
};

module.exports = {
  deleteDataForUserAndDate,
};
