import React, { useEffect, useState } from "react";
import TradeTable from "./TradesTableComponent";
import ProfitChartComponent from "./ProfitChartComponent";
import TradeStatisticsTable from "./TradeStatisticsTable";
import { useLocation } from "react-router-dom";
import { Button, CircularProgress, Typography, Box } from "@mui/material";

const DayStatisticComponent = () => {
  const [dataTrades, setDataTrades] = useState([]);
  const [tradeStatistics, setTradeStatistics] = useState({});
  const [error, setError] = useState(null);
  const location = useLocation();
  const selectedDate = location.state?.date || "default-date-value";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found.");
      return;
    }
    if (!selectedDate) {
      console.error("No selected date provided");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/profitdiary/daily-trades?datetrade=${selectedDate}&userId=${userId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDataTrades(data.trades);
      setTradeStatistics(data.tradeStatistics);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    }
  };

  const handleDeleteStatistics = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/profitdiary/delete-data/delete-data?selectedDate=${selectedDate}&userId=${userId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchData();
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    }
  };

  const flattenTrades = (data) => {
    if (!Array.isArray(data)) {
      console.error("Expected an array, received:", data);
      return [];
    }

    return data.map((trade) => {
      return {
        date: formatDate(trade.tradeDate),
        execTime: trade.execTime,
        symbol: trade.symbol,
        tradeType: trade.tradeType,
        profit: trade.profit,
      };
    });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Box textAlign="center">
          <CircularProgress size={80} style={{ color: "black" }} />{" "}
          <Typography variant="h6" style={{ marginTop: "20px" }}>
            Loading...
          </Typography>
        </Box>
      </Box>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "20px",
        position: "relative",
      }}
    >
      <div style={{ marginBottom: "-220px" }}>
        <ProfitChartComponent trades={flattenTrades(dataTrades)} />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          width: "100%",
          marginTop: "10px",
        }}
      >
        <TradeStatisticsTable tradeStatistics={tradeStatistics} />
        <TradeTable trades={flattenTrades(dataTrades)} />
      </div>

      <Button
        variant="contained"
        color="primary"
        style={{
          position: "fixed",
          right: "40px",
          bottom: "60px",
          backgroundColor: "black",
        }}
        onClick={handleDeleteStatistics}
      >
        Delete Statistics
      </Button>
    </div>
  );
};

export default DayStatisticComponent;
