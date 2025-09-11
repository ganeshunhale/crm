// components/Footer.tsx
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GET_ACCOUNT_DETAILS } from "../../API/ApiServices";
import CloseAllFooter from "./ClosePositionModal";

const Footer = () => {
  const dispatch = useDispatch();
  const positions = useSelector((state) => {
    console.log("Footer - Redux state:", state.positions);
    return state.positions.open;
  });
  const [accountDetails, setAccountDetails] = useState({});
   // 🟠 Handle broadcaster updates (add / remove / update / profit)
const initialEquity = useRef(0);
const [equity , setEquity] = useState(0)
   useEffect(() => {
    const getUserAccDetails = async () => {
      try {
        const res = await GET_ACCOUNT_DETAILS()
        setAccountDetails(res.data.result)
        const balance = Number(res.data.result?.balance) || 0;
        const credit = Number(res.data.result?.credit) || 0;
        const eq = balance + credit;
        initialEquity.current = eq;
        setEquity(eq);
        console.log("Footer - user-details:", res.data.result)
        console.log("Footer - calculated equity:", eq, "balance:", balance, "credit:", credit)
      } catch (error) {
        console.log(error)
      }
    }
    getUserAccDetails()
  }, [])




  // Note: Real-time price updates and profit calculations are now handled
  // in the Redux middleware and PositionsTable component

  useEffect(() => {
    console.log("Footer - Positions changed:", positions.length, positions);

    if(positions.length === 0) {
      // If no positions, set equity to initial equity (balance + credit)
      if (initialEquity.current > 0) {
        setEquity(initialEquity.current);
      }
      console.log("Footer - No positions, setting equity to initial:", initialEquity.current);
      return;
    }

    const totalProfit = positions.reduce((acc, val) => {
      console.log(`Footer - Position ${val.symbol}: profit=${val.profit}`);
      return acc + (val.profit || 0);
    }, 0);

    const newEquity = Number((initialEquity.current + totalProfit).toFixed(2));
    setEquity(newEquity);
    console.log("Footer - Updated equity:", newEquity, "totalProfit:", totalProfit, "positions:", positions.length);
  }, [positions])
  
   
  
  return (
    <div className="flex justify-between items-center px-4 py-2 border-t border-slate-700 bg-[#1e1e1e] text-sm text-gray-300">
      {/* Left side values */}
      <div className="flex gap-6 flex-wrap">
        <span>Equity: <span className="text-white">{(equity || 0).toFixed(2)} USD</span></span>
        <span>Free Margin: <span className="text-white">{((equity || 0) - (Number(accountDetails?.margin) || 0)).toFixed(2)} USD</span></span>
        <span>Balance: <span className="text-white">{Number(accountDetails?.balance) || 0} USD</span></span>
        <span>Margin: <span className="text-white">{Number(accountDetails?.margin) || 0} USD</span></span>
        <span>Margin level: {((equity / (accountDetails?.margin || 1)) * 100).toFixed(2) + '%'}</span>
      </div>
      <CloseAllFooter/>
      {/* Right side values */}
      {/* <div className="flex items-center gap-4">
        <span>Total P/L, USD: <span className="text-red-500">-8.72</span></span>
        <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm">
          Close all
        </button>
      </div> */}
    </div>
  );
};

export default Footer;