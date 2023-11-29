import React from "react";

const TradeStatisticsTable = ({ tradeStatistics }) => {
  if (!tradeStatistics) {
    return <div>No trade statistics available</div>;
  }
  const roundToTwoDecimals = (value) => {
    if (value === null || value === undefined) {
      return 0;
    }
    const number = parseFloat(value);
    return isNaN(number) ? 0 : Number(number.toFixed(2));
  };

  const tableCellStyle = {
    borderRadius: "10px",
    border: "1px solid #ccc",
    padding: "5px",
  };

  return (
    <div style={{ marginTop: "50px" }}>
      <h3>Trade Statistics</h3>
      <table>
        <tbody>
          <tr>
            <td style={tableCellStyle}>Profit/Loss, $:</td>
            <td style={tableCellStyle}>{tradeStatistics.profitloss}</td>
          </tr>
          <tr>
            <td style={tableCellStyle}>Total Winners:</td>
            <td style={tableCellStyle}>{tradeStatistics.total_winners}</td>
          </tr>
          <tr>
            <td style={tableCellStyle}>Total Losers:</td>
            <td style={tableCellStyle}>{tradeStatistics.total_losers}</td>
          </tr>
          <tr>
            <td style={tableCellStyle}>Total Trades:</td>
            <td style={tableCellStyle}>{tradeStatistics.total_trades}</td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td style={tableCellStyle}>Average Return, $:</td>
            <td style={tableCellStyle}>
              {roundToTwoDecimals(tradeStatistics.avg_return)}
            </td>
          </tr>
          <tr>
            <td style={tableCellStyle}>Total Long:</td>
            <td style={tableCellStyle}>{tradeStatistics.total_long}</td>
          </tr>
          <tr>
            <td style={tableCellStyle}>Total Shorts:</td>
            <td style={tableCellStyle}>{tradeStatistics.total_shorts}</td>
          </tr>
          <tr>
            <td style={tableCellStyle}>Win Rate, %:</td>
            <td style={tableCellStyle}>
              {roundToTwoDecimals(tradeStatistics.win_rate)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TradeStatisticsTable;
