const express = require("express");
const downloadTradesFromXLSXRouter = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {
  insertTradeData,
  getAllTradesData,
} = require("../controllers/downloadTradesFromXLSX.controller.js");

downloadTradesFromXLSXRouter.post("/", upload.single("file"), insertTradeData);
downloadTradesFromXLSXRouter.get("/data", getAllTradesData);

module.exports = { downloadTradesFromXLSXRouter };
