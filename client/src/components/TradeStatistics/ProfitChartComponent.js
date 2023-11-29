import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const ProfitChartComponent = ({ trades }) => {
  let cumulativeProfit = [0];
  trades.forEach((trade) => {
    let lastProfit = cumulativeProfit[cumulativeProfit.length - 1];
    cumulativeProfit.push(lastProfit + parseFloat(trade.profit));
  });

  const chartData = {
    labels: new Array(cumulativeProfit.length).fill(""),
    datasets: [
      {
        label: "Cumulative Profit",
        data: cumulativeProfit,
        fill: true,
        borderColor: "rgba(75, 192, 192, 1)",
        segment: {
          borderColor: (ctx) => {
            const value = ctx.p1.parsed.y;
            return value >= 0 ? "rgba(0, 255, 0, 1)" : "rgba(255, 0, 0, 1)";
          },
          backgroundColor: (ctx) => {
            const value = ctx.p1.parsed.y;
            return value >= 0 ? "rgba(0, 255, 0, 0.2)" : "rgba(255, 0, 0, 0.2)";
          },
        },
      },
    ],
  };

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
    <div
      className="chart-container"
      style={{ width: "800px", height: "600px" }}
    >
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default ProfitChartComponent;
