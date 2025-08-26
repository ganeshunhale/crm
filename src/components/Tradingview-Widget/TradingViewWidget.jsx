// TradingViewWidget.jsx
import React, { useEffect, useRef } from "react";

export default function TradingViewWidget({
  symbol = "OANDA:XAUUSD",
  theme = "dark",
  interval = "D",
  watchlist = ["OANDA:XAUUSD", "TVC:GOLD"],
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify(
      {
        "allow_symbol_change": false,
        "calendar": false,
        "details": false,
        "hide_side_toolbar": false,
        "hide_top_toolbar": false,
        "hide_legend": false,
        "hide_volume": false,
        "hotlist": false,
        "interval": "D",
        "locale": "en",
        "save_image": true,
        "style": "1",
        "symbol": symbol,
        "theme": "dark",
        "timezone": "Etc/UTC",
        "backgroundColor": "#0F0F0F",
        "gridColor": "rgba(242, 242, 242, 0.06)",
        // "watchlist": [
        //   "OANDA:XAUUSD",
        //   "TVC:GOLD"
        // ],
        "withdateranges": true,
        "range": "YTD",
        "compareSymbols": [],
        "show_popup_button": true,
        "popup_height": "650",
        "popup_width": "1000",
        "studies": [],
        "autosize": true
      }
    );

    containerRef.current.appendChild(script);
  }, [symbol, theme, interval, watchlist]);

  // useEffect(() => {
  //   const handleMessage = (event) => {
  //     if (
  //       event.origin.includes("tradingview.com") &&
  //       event.data?.includes?.("symbol=")
  //     ) {
  //       const match = event.data.match(/symbol=([^&]+)/);
  //       if (match) {
  //         const newSymbol = decodeURIComponent(match[1]);
  //         setCurrentSymbol(newSymbol);
  //         // onSymbolChange?.(newSymbol);

  //         console.log({newSymbol});
          
  //       }
  //     }
  //   };

  //   window.addEventListener("message", handleMessage);
  //   return () => window.removeEventListener("message", handleMessage);
  // }, []);
  return (<>
  <div
      className="tradingview-widget-container"
      ref={containerRef}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "100%", width: "100%" }}
      ></div>
      
      <div className="tradingview-widget-copyright">
    <a
      href={`https://www.tradingview.com/symbols/${symbol.replace(
        ":",
        "-"
      )}/`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span className="blue-text">{symbol} chart by TradingView</span>
    </a>
  </div>
    </div>
    
  </>
    
  );
}
