import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  CircularProgress,
  Box,
} from "@mui/material";

import { parseISO, format, addDays } from "date-fns";

import { Line } from "react-chartjs-2";
import "chart.js/auto";

const ProfitabilityChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Cumulative Profit",
        data: [],
        fill: true,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  });

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    return format(addDays(date, 0), "yyyy-MM-dd");
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    fetch(
      `http://localhost:5000/profitdiary/chart-profit/user/trades/profit/${userId}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (!Array.isArray(data) || !data.length) {
          console.error("Received data is not an array or is empty");
          return;
        }

        const formattedData = data
          .map((item) => ({
            ...item,
            date_trade: formatDate(item.date_trade),
          }))
          .sort((a, b) => new Date(a.date_trade) - new Date(b.date_trade));

        let cumulativeProfit = [0];
        formattedData.forEach((trade, index) => {
          let lastProfit = cumulativeProfit[index];
          cumulativeProfit.push(lastProfit + parseFloat(trade.profitloss));
        });

        setChartData({
          labels: formattedData.map((item) => item.date_trade),
          datasets: [
            {
              label: "Cumulative Profit",
              data: cumulativeProfit.slice(1),
              fill: true,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching profit data:", error);
      });
  }, []);

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "$" + value;
          },
        },
      },
    },
  };

  return (
    <>
      <Typography
        variant="h6"
        style={{ textAlign: "center", marginBottom: "20px", marginTop: "20px" }}
      >
        Profit Chart
      </Typography>
      <div
        className="chart-container"
        style={{ width: "800px", height: "400px" }}
      >
        <Line data={chartData} options={chartOptions} />
      </div>
    </>
  );
};

const StatisticsTable = ({ statistics }) => (
  <TableContainer
    component={Paper}
    style={{ padding: "20px", marginTop: "45px" }}
  >
    <Typography
      variant="h6"
      style={{ textAlign: "center", marginBottom: "20px" }}
    >
      Statistics Table
    </Typography>
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>Gross Profit, $:</TableCell>
          <TableCell>{statistics.grossProfit}</TableCell>

          <TableCell>Biggest Loss, $:</TableCell>
          <TableCell>
            {statistics.biggestLoss
              ? statistics.biggestLoss.profit_loss
              : "N/A"}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Average Daily Return, $:</TableCell>
          <TableCell>{statistics.averageDailyReturn}</TableCell>
          <TableCell>Biggest Profit, $:</TableCell>
          <TableCell>
            {statistics.biggestProfit
              ? statistics.biggestProfit.profit_loss
              : "N/A"}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Average Profit, $:</TableCell>
          <TableCell>
            {parseFloat(statistics.averageProfit).toFixed(2)}
          </TableCell>
          <TableCell>Return on Long, $:</TableCell>
          <TableCell>{statistics.returnOnLong}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Profit Factor</TableCell>
          <TableCell>{statistics.profitFactor}</TableCell>
          <TableCell>Return on Short, $:</TableCell>
          <TableCell>{statistics.returnOnShort}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Winrate, %:</TableCell>
          <TableCell>{parseFloat(statistics.winrate).toFixed(2)}</TableCell>
          <TableCell>Average Losses, $:</TableCell>
          <TableCell>
            {parseFloat(statistics.averageLosses).toFixed(2)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Total Trades</TableCell>
          <TableCell>{statistics.totalTrades}</TableCell>
          <TableCell>Average Winners, $:</TableCell>
          <TableCell>
            {parseFloat(statistics.averageWinners).toFixed(2)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
);

const TradesList = ({ trades }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(13);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    const adjustedDate = addDays(date, 0);
    return format(adjustedDate, "yyyy-MM-dd");
  };

  return (
    <TableContainer
      component={Paper}
      style={{ marginTop: "15px", width: "500px" }}
    >
      <Typography
        variant="h6"
        style={{ textAlign: "center", marginBottom: "20px" }}
      >
        All trades
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: "40%", flexGrow: 1 }}>
              Trade Date
            </TableCell>
            <TableCell>Execution Time</TableCell>
            <TableCell>Stock Ticker</TableCell>
            <TableCell>Trade Type</TableCell>
            <TableCell>Profit/Loss</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trades
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((trade, index) => (
              <TableRow key={index}>
                <TableCell>{formatDate(trade.trade_date)}</TableCell>
                <TableCell>{trade.exectime}</TableCell>
                <TableCell>{trade.stock_ticker}</TableCell>
                <TableCell>{trade.trade_type}</TableCell>
                <TableCell>${trade.profit_loss}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={trades.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

const GeneralStatisticComponent = () => {
  const [statistics, setStatistics] = useState({});
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    Promise.all([
      fetch(
        `http://localhost:5000/profitdiary/all-time-user-statistics/user/${userId}/trade-statistics`
      ),
    ])
      .then(async ([tradeStatsResponse]) => {
        const tradeStatsData = await tradeStatsResponse.json();
        setStatistics(tradeStatsData);
        setTrades(tradeStatsData.trades || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

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

  return (
    <Container>
      <Grid container spacing={10}>
        <Grid item xs={12} md={8}>
          <ProfitabilityChart />
          <StatisticsTable statistics={statistics} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TradesList trades={trades} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default GeneralStatisticComponent;
