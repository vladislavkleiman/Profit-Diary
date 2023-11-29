import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";

const TradeTable = ({ trades }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "50px",
        marginLeft: "-700px",
      }}
    >
      <h3>Trade Details</h3>
      <TableContainer component={Paper}>
        <Table sx={{ width: 500 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 120 }}>Trade Date</TableCell>
              <TableCell align="right">Execution Time</TableCell>
              <TableCell align="right">Stock Ticker</TableCell>
              <TableCell align="right">Trade Type</TableCell>
              <TableCell align="right">Profit/Loss</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trades
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((trade, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {trade.date}
                  </TableCell>
                  <TableCell align="right">{trade.execTime}</TableCell>
                  <TableCell align="right">{trade.symbol}</TableCell>
                  <TableCell align="right">{trade.tradeType}</TableCell>
                  <TableCell align="right">${trade.profit}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5]}
          component="div"
          count={trades.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
};

export default TradeTable;
