import React, { memo, useState } from 'react'
import TradingViewWidget from '../../components/Tradingview-Widget/TradingViewWidget'
import TradingPanel from '../../components/TradinPanel/TradingPanel'
import PositionsTable from '../../components/PositionTable/PositionTable'
import  InstrumentsPanel  from '../../components/Instruments/Intruments'
import NavBar from '../../components/Navbar'
import { useWebSocket } from '../../customHooks/useWebsocket'
const socketUrl = import.meta.env.VITE_REACT_WS_BRODCASTER_URL
const Dashboard = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("")
const { socket,sendMessage, closeSocket } = useWebSocket(socketUrl);
  const handleSymbolSelect = (symbol) => {
    setSelectedSymbol(symbol)
    console.log("Selected symbol:", symbol)
  }
  
  return (
<div className="dashboard flex flex-col h-screen">
  {/* Common Header */}
  <NavBar />

  {/* Main Content */}
  <div className="flex flex-1 overflow-hidden">
    {/* Left Column */}
    <div className="flex flex-col flex-[9] border-r border-slate-700 min-h-0">
      {/* Top (split equally) */}
      <div className="flex flex-1 min-h-0 border-b border-slate-700">
        {/* Instruments Panel */}
        <div className="flex-1 border-r border-slate-700 overflow-auto">
          <InstrumentsPanel
            onSymbolSelect={handleSymbolSelect}
            selectedSymbol={selectedSymbol}
            socket={socket}
            sendMessage={sendMessage}
          />
        </div>

        {/* Trading Widget */}
        <div className="flex-3 min-h-0 overflow-auto">
          <TradingViewWidget symbol={selectedSymbol} />
        </div>
      </div>

      {/* Bottom: Positions */}
      <div className="h-[300px] overflow-auto scroll-dark">
        <PositionsTable socket={socket}
            sendMessage={sendMessage}/>
      </div>
    </div>

    {/* Right Column */}
    <div className="flex-[2] min-h-0 bg-[#1e1e1e]">
      <TradingPanel />
    </div>
  </div>
</div>



  )
}

export default memo(Dashboard)