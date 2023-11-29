const express = require("express");
const deleteDataForDateAndUserRoute = express.Router();
const {
  deleteDataForDateAndUser,
} = require("../controllers/deleteDataController.js"); // Path to your controller

deleteDataForDateAndUserRoute.delete("/delete-data", deleteDataForDateAndUser);

module.exports = { deleteDataForDateAndUserRoute };
