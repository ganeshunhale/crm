// components/Footer.tsx
import  { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import CloseAllFooter from "./ClosePositionModal";
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';

const Footer = () => {
  const activeId = useSelector(state => state.auth.activeId)
  if (!activeId) return null;

  const positions = useSelector((state) => {
    return state.positions.open;
  });
  const accountDetails = useSelector(state => state.tradingAccouts);
  const initialEquity = useRef(0);
  const [equity , setEquity] = useState(0)

  useEffect(() => {
    if(!activeId) return;
    const balance = Number(accountDetails[activeId]?.balance) || 0;
    const credit = Number(accountDetails[activeId]?.credit) || 0;
    const eq = balance + credit;
    initialEquity.current = eq;
    setEquity(eq);
  },[activeId, accountDetails])

  useEffect(() => {
    if(positions.length === 0) {
      initialEquity.current > 0 && setEquity(initialEquity.current); 
      return;
    }

    const totalProfit = positions.reduce((acc, val) => acc + (val.profit || 0), 0);

    const newEquity = Number((initialEquity.current + totalProfit).toFixed(2));
    setEquity(newEquity);
  }, [positions])
  
   
  
  return (
    <div className="flex justify-between items-center px-4 py-2 border-t-[3px] border-slate-700 bg-[#1e1e1e] text-sm text-gray-300">
      {/* Left side values */}
      <div className="flex gap-6 flex-wrap">
        <span>Balance: <span className="text-white">{Number(accountDetails[activeId]?.balance) || 0} USD</span></span>
        <span>Equity: <span className="text-white">{(equity || 0).toFixed(2)} USD</span></span>
        <span>Margin: <span className="text-white">{Number(accountDetails[activeId]?.margin) || 0} USD</span></span>
        <span>Free Margin: <span className="text-white">{((equity || 0) - (Number(accountDetails[activeId]?.margin) || 0)).toFixed(2)} USD</span></span>
        <span>Margin level: {((equity / (accountDetails[activeId]?.margin || 1)) * 100).toFixed(2) + '%'}</span>
      </div>
      <CloseAllFooter/>
      {/* <SignalCellularAltIcon/> */}
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