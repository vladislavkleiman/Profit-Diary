import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ReactDOM from "react-dom/client";
import LoginComponent from "./components/Login/LoginComponent";
import HomeComponent from "./components/Main/HomeComponent";
import CalendarStatisticComponent from "./components/TradeStatistics/CalendarStatisticComponent";
import InfoAboutStockComponent from "./components/InfoAboutCompany/InfoAboutStockComponent";
import GeneralStatisticComponent from "./components/TradeStatistics/GeneralStatisticComponent";
import NoteDiaryComponent from "./components/Diary/NoteDiaryComponent";
import DayStatisticComponent from "./components/TradeStatistics/DayStatisticComponent";
import SideBar from "./components/Main/SideBar";
import RegisterComponent from "./components/Login/RegisterComponent";

const App = () => {
  const location = useLocation();
  const showSidebar =
    location.pathname !== "/" && location.pathname !== "/register";

  return (
    <>
      {showSidebar && <SideBar />}
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route path="/register" element={<RegisterComponent />} />
        <Route path="/home" element={<HomeComponent />} />
        <Route path="/diary" element={<NoteDiaryComponent />} />
        <Route path="/calendar" element={<CalendarStatisticComponent />} />
        <Route
          path="/general-statistic"
          element={<GeneralStatisticComponent />}
        />
        <Route
          path="/info-about-stocks"
          element={<InfoAboutStockComponent />}
        />
        <Route path="/daystatistic" element={<DayStatisticComponent />} />
      </Routes>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
