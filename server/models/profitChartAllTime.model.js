const { db } = require("../config/db.js");

const getProfitAllTimeforUser = async (userId) => {
  try {
    return await db("statisticoftradesforday")
      .select("date_trade", "profitloss")
      .where({ user_id: userId });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    throw error;
  }
};

module.exports = {
  getProfitAllTimeforUser,
};
