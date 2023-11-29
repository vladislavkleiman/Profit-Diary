import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TableHead,
  TablePagination,
} from "@mui/material";

import { parseISO, format, addDays, compareAsc } from "date-fns";

const MainStatictic = () => {
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 13;

  const roundToTwo = (num) => {
    const number = parseFloat(num);
    return isNaN(number) ? 0 : number.toFixed(2);
  };

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    const adjustedDate = addDays(date, 0);
    return format(adjustedDate, "yyyy-MM-dd");
  };

  const sortTrades = (trades) => {
    return trades.sort((a, b) => {
      const dateComparison = compareAsc(
        parseISO(a.trade_date),
        parseISO(b.trade_date)
      );
      if (dateComparison !== 0) return dateComparison;
      return a.exectime.localeCompare(b.exectime);
    });
  };

  useEffect(() => {
    const fetchStatistics = async () => {
      const userId = localStorage.getItem("userId");
      try {
        const response = await fetch(
          `http://localhost:5000/profitdiary/user-statistics/user/${userId}/statistics`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.trades) {
            data.trades = sortTrades(data.trades);
          }
          setStatistics(data);
        } else {
          console.error("Failed to fetch statistics");
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, []);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: 1600, float: "right", marginRight: 5, marginTop: 3 }}
    >
      <Table aria-label="customized table">
        <TableBody>
          <TableRow>
            <TableCell sx={{ width: "500px", border: "1px solid black" }}>
              Gross Profit, $: {roundToTwo(statistics.grossProfit)}
            </TableCell>
            <TableCell sx={{ width: "500px", border: "1px solid black" }}>
              Average Daily Return, $:{" "}
              {roundToTwo(statistics.averageDailyReturn)}
            </TableCell>
            <TableCell sx={{ width: "500px", border: "1px solid black" }}>
              Average profit, $: {roundToTwo(statistics.averageProfit)}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell sx={{ width: "500px", border: "1px solid black" }}>
              Profit factor: {roundToTwo(statistics.profitFactor)}
            </TableCell>
            <TableCell sx={{ width: "500px", border: "1px solid black" }}>
              Winrate, %: {roundToTwo(statistics.winrate)}
            </TableCell>
            <TableCell sx={{ width: "500px", border: "1px solid black" }}>
              Total trades: {statistics.totalTrades}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              colSpan={3}
              sx={{ height: "85vh", border: "1px solid black" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Trade Date</TableCell>
                    <TableCell>Execution Time</TableCell>
                    <TableCell>Stock Ticker</TableCell>
                    <TableCell>Trade Type</TableCell>
                    <TableCell>Profit/Loss</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {statistics.trades
                    ?.slice(
                      currentPage * rowsPerPage,
                      currentPage * rowsPerPage + rowsPerPage
                    )
                    .map((trade, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatDate(trade.trade_date)}</TableCell>
                        <TableCell>{trade.exectime}</TableCell>
                        <TableCell>{trade.stock_ticker}</TableCell>
                        <TableCell>{trade.trade_type}</TableCell>
                        <TableCell>{trade.profit_loss}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={statistics.trades?.length || 0}
                rowsPerPage={rowsPerPage}
                page={currentPage}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[15]} // To avoid changing rowsPerPage
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MainStatictic;
