
import React, { useMemo } from "react";
import { useSelector } from "react-redux";

const TradeDetails = ({ formdata }) => {
  const tradepositionState = useSelector((state) => state.tradeposition);
  const symbolData = tradepositionState?.selectedSymbolData;

  if (!symbolData || !formdata) {
    return null; // no data yet
  }

  const { ask, bid, contractSize, leverage, point } = symbolData;
  const { volume, selectedOrderType } = formdata;

  // 🔹 Perform calculations
  const { volumeOz, volumeUSD, margin, pipValue } = useMemo(() => {
    const tickPrice = selectedOrderType === "sell" ? ask : bid;

    const volumeOzCalc = volume * contractSize;
    const volumeUSDCalc = volumeOzCalc * tickPrice;
    const marginCalc = leverage > 0 ? volumeUSDCalc / leverage : 0;
    const pipValueCalc = contractSize * volume * point;

    return {
      volumeOz: volumeOzCalc,
      volumeUSD: volumeUSDCalc,
      margin: marginCalc,
      pipValue: pipValueCalc,
    };
  }, [volume, contractSize, ask, bid, leverage, point, selectedOrderType]);

  return (
    <div className=" text-white p-3 text-sm space-y-1">
      <div className="flex justify-between">
        <span>Leverage:</span>
        <span>1:{leverage}</span>
      </div>
      <div className="flex justify-between">
        <span>Margin:</span>
        <span>{margin.toFixed(2)} USD</span>
      </div>
      <div className="flex justify-between">
        <span>Pip Value:</span>
        <span>{pipValue.toFixed(5)} USD</span>
      </div>
      <div className="flex justify-between">
        <span>Volume in units:</span>
        <span>{volumeOz.toFixed(2)}</span>
      </div>
      {selectedOrderType ? <div className="flex justify-between">
        <span>Volume in USD:</span>
        <span>{volumeUSD.toFixed(2)} USD</span>
      </div>:(
  <div className="text-red-400 text-sm ">
    Buy or Sell not selected
  </div>
)}
    </div>
  );
};

export default TradeDetails;
