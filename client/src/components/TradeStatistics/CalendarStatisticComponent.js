import React, { useState, useRef, useEffect } from "react";
import { Badge, Calendar, Drawer } from "antd";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../../styles/CellCalendarStyle.css";

const getMonthData = (value) => {
  if (value.month() === 8) {
    return 1394;
  }
};

const CalendarStatisticComponent = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [tradeStats, setTradeStats] = useState({});

  const calendarStyle = {
    width: "1400px",
    height: "700px",
    margin: "auto",
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    marginLeft: "120px",
  };

  const blurStyle = {
    filter: sidebarVisible ? "blur(4px)" : "none",
    transition: "filter 0.3s",
  };

  const fetchTradeStats = async (year, month) => {
    const userId = localStorage.getItem("userId");
    console.log("fetchTradeStats called with year:", year, "month:", month);
    try {
      const response = await fetch(
        `http://localhost:5000/profitdiary/trade-stats`,
        {
          method: "GET",
          headers: {
            "user-id": userId,
            year: year.toString(),
            month: month.toString(),
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch trade statistics");
      }
      const newCellColors = {};
      const data = await response.json();
      console.log("Response data:", data);


      document.querySelectorAll(".profit-cell, .loss-cell").forEach((cell) => {
        cell.classList.remove("profit-cell", "loss-cell");
      });

      const statsMap = {};
      data.forEach((stat) => {
        const localDate = new Date(stat.date_trade).toLocaleDateString("en-CA");
        statsMap[localDate] = stat;
        const cell = document.querySelector(`td[title="${localDate}"]`);
        if (cell) {
          const isProfit = Number(stat.profitloss) >= 0;
          cell.classList.add(isProfit ? "profit-cell" : "loss-cell");
        }
      });
      console.log("Constructed Stats Map:", statsMap);
      setTradeStats(statsMap);
    } catch (error) {
      console.error("Error fetching trade statistics:", error);
    }
  };

  const getListData = (value) => {
    const formattedDate = value.format("YYYY-MM-DD");
    console.log("Looking up stats for date:", formattedDate);
    console.log("Current tradeStats State:", tradeStats);

    const dayStats = tradeStats[formattedDate];
    console.log("Stats for", formattedDate, ":", dayStats);

    if (!dayStats) return [];
    const profitLossValue = Number(dayStats.profitloss);
    const cellClass = profitLossValue >= 0 ? "profit-cell" : "loss-cell";

    return [
      {
        type: dayStats.profitloss >= 0 ? "success" : "error",
        profitLossFormatted: `$${Number(dayStats.profitloss).toFixed(2)}`,
        tradesText: `Trades: ${dayStats.total_trades}`,
        cellClass,
      },
    ];
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    const userId = localStorage.getItem("userId");
    if (userId) {
      formData.append("userId", userId);
    } else {
      alert("User ID not found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/profitdiary/trades-upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      try {
        const result = await response.json();
        alert(result.message);
      } catch (e) {
        console.error("Response is not in JSON format:", e);
        alert("Error processing response");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    } finally {
      setSelectedFile(null);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  useEffect(() => {
    if (selectedFile) {
      handleFileUpload();
    }
  }, [selectedFile]);
  useEffect(() => {
    const today = new Date();
    setTimeout(
      () => fetchTradeStats(today.getFullYear(), today.getMonth() + 1),
      0
    );
  }, []);

  useEffect(() => {
    console.log("Updated tradeStats:", tradeStats);
  }, [tradeStats]);

  const navigate = useNavigate();

  const viewDay = () => {
    if (selectedDate) {
      const formattedDate = selectedDate.format("YYYY-MM-DD");
      navigate("/daystatistic", { state: { date: formattedDate } });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const onSelect = (value) => {
    setSelectedDate(value);
    setSidebarVisible(true);
  };

  useEffect(() => {
    const today = new Date();
    fetchTradeStats(today.getFullYear(), today.getMonth());
  }, []);

  const onPanelChange = (value) => {
    const year = value.year();
    const month = value.month() + 1;
    console.log("Selected Year:", year, "Selected Month:", month);
    fetchTradeStats(year, month);
  };

  const monthCellRender = (value) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const cellRender = (current, info) => {
    if (info && info.type === "date") {
      const listData = getListData(current);
      return (
        <ul className="events">
          {listData.map((item, index) => (
            <li
              key={index}
              style={{ position: "relative", listStyle: "none" }} 
              className={item.cellClass}
            >
              <span
                style={{
                  position: "absolute",
                  top: -25,
                  left: 0,
                  fontSize: "smaller",
                }}
              >
                {item.tradesText}
              </span>
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "bold",
                  fontSize: "larger",
                  marginTop: "20px",
                }}
              >
                {item.profitLossFormatted}
              </span>
            </li>
          ))}
        </ul>
      );
    }
    if (info && info.type === "month") {
      return monthCellRender(current);
    }
    return null;
  };

  return (
    <div>
      <div style={{ ...containerStyle, ...blurStyle }}>
        <Calendar
          style={calendarStyle}
          cellRender={cellRender}
          onSelect={onSelect}
          onPanelChange={onPanelChange}
        />
      </div>
      <Drawer
        title={`Events on ${
          selectedDate ? selectedDate.format("YYYY-MM-DD") : ""
        }`}
        placement="right"
        onClose={() => setSidebarVisible(false)}
        open={sidebarVisible}
      >
        <div
          className="formStatisticInCalendar"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <p>
            Details statistic for{" "}
            {selectedDate ? selectedDate.format("YYYY-MM-DD") : ""}
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              style={{ backgroundColor: "black" }}
              onClick={triggerFileInput}
            >
              Add Statistic
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept=".xlsx"
              onChange={handleFileChange}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              style={{ backgroundColor: "black" }}
              onClick={viewDay}
            >
              View Day
            </Button>
          </p>
        </div>
      </Drawer>
    </div>
  );
};

export default CalendarStatisticComponent;
