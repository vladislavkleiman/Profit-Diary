const express = require("express");
const getTradesRouter = express.Router();
const {
  getTradesController,
} = require("../controllers/getTradesFromDB.controller.js");

getTradesRouter.get("/", getTradesController);

module.exports = { getTradesRouter };
