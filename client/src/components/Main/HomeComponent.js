import React from "react";
import SideBar from "./SideBar.js";
import MainStatistic from "./MainStatistic.js";

const HomeComponent = () => {
  return (
    <div className="homeComponent">
      <MainStatistic />
      <SideBar />
    </div>
  );
};

export default HomeComponent;
