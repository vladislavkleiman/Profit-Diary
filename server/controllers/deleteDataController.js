const {
  deleteDataForUserAndDate,
} = require("../models/deleteDataForUserAndDate.model.js");

const deleteDataForDateAndUser = async (req, res) => {
  const { selectedDate, userId } = req.query;

  try {
    await deleteDataForUserAndDate(selectedDate, userId);
    res
      .status(200)
      .send("Data successfully deleted for the selected date and user.");
  } catch (error) {
    console.error("Error in controller while deleting data:", error);
    res.status(500).send("Error occurred while deleting data.");
  }
};

module.exports = {
  deleteDataForDateAndUser,
};
