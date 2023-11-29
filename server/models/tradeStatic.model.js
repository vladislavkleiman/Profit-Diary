const { db } = require("../config/db.js");

async function calculateProfit(userId) {
  console.log("calculateProfit, userID", userId);
  const trades = await db
    .select("*")
    .from("tradestransaction")
    .where("user_id", userId)
    .orderBy(["exectime"]);

  console.log(
    "calculateProfit: Trades fetched from tradestransaction:",
    trades
  );
  console.log("calculateProfit, userID", userId);

  let results = {};
  let positions = {};

  trades.forEach((trade) => {
    const { symbol, qty, price, side, datetrades, exectime } = trade;

    if (!positions[symbol]) {
      positions[symbol] = {
        qty: 0,
        buyCost: 0,
        sellRevenue: 0,
        firstTradeType: null,
        firstTradeDate: null,
      };
    }

    if (
      positions[symbol].qty === 0 &&
      positions[symbol].firstTradeType === null
    ) {
      positions[symbol].firstTradeType = side === "B" ? "Long" : "Short";
      positions[symbol].firstTradeDate = datetrades;
    }

    if (side === "B") {
      positions[symbol].qty += qty;
      positions[symbol].buyCost += qty * price;
    } else if (side === "S") {
      positions[symbol].qty -= qty;
      positions[symbol].sellRevenue += qty * price;
    }

    if (
      positions[symbol].qty === 0 &&
      (positions[symbol].buyCost > 0 || positions[symbol].sellRevenue > 0)
    ) {
      let profit = positions[symbol].sellRevenue - positions[symbol].buyCost;

      if (!results[symbol]) {
        results[symbol] = [];
      }
      results[symbol].push({
        symbol,
        profit: profit.toFixed(2),
        tradeType: positions[symbol].firstTradeType,
        tradeDate: positions[symbol].firstTradeDate,
        execTime: exectime,
      });

      positions[symbol] = {
        qty: 0,
        buyCost: 0,
        sellRevenue: 0,
        firstTradeType: null,
        firstTradeDate: null,
      };
    }
  });

  return results;
}

async function loadTradesIntoDatabase(userId) {
  const calculatedTrades = await calculateProfit(userId);
  console.log("loadTradesIntoDatabase начал работу userId:", userId);
  console.log("Loading trades into database: ", calculatedTrades);

  for (const symbol in calculatedTrades) {
    for (const trade of calculatedTrades[symbol]) {
      await db("trades").insert({
        user_id: userId,
        trade_date: trade.tradeDate,
        exectime: trade.execTime,
        stock_ticker: symbol,
        trade_type: trade.tradeType,
        profit_loss: trade.profit,
      });
    }
  }
  console.log("loadTradesIntoDatabase закончил работу");
  console.log("All trades have been successfully loaded into the database.");
}

async function removeDuplicateTrades() {
  try {
    await db.raw(`
      WITH duplicates AS (
        SELECT id_trades,
               ROW_NUMBER() OVER (
                 PARTITION BY trade_date, stock_ticker, trade_type, profit_loss 
                 ORDER BY id_trades
               ) as row_num
        FROM trades
      )
      DELETE FROM trades
      WHERE id_trades IN (
        SELECT id_trades FROM duplicates WHERE row_num > 1
      )
    `);
    console.log("Duplicate trades removed successfully.");
  } catch (error) {
    console.error("Error removing duplicate trades:", error);
  }
}

module.exports = {
  loadTradesIntoDatabase,
  removeDuplicateTrades,
};
