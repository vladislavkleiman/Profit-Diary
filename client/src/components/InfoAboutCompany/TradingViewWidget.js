import React, { useEffect } from "react";

const TradingViewWidget = ({ symbol }) => {
  useEffect(() => {
    const createWidget = () => {
      if (window.TradingView && document.getElementById("tradingview_widget")) {
        new window.TradingView.widget({
          autosize: true,
          symbol: symbol || "NASDAQ:AAPL", 
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          enable_publishing: false,
          allow_symbol_change: false,
          container_id: "tradingview_widget",
        });
      }
    };


    if (!window.TradingView) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = createWidget;
      document.body.appendChild(script);
    } else {
      createWidget();
    }


    return () => {
      const widgetContainer = document.getElementById("tradingview_widget");
      if (widgetContainer) {
        while (widgetContainer.firstChild) {
          widgetContainer.removeChild(widgetContainer.firstChild);
        }
      }
    };
  }, [symbol]); 

  return (
    <div id="tradingview_widget" style={{ height: "100%", width: "100%" }} />
  );
};

export default TradingViewWidget;
