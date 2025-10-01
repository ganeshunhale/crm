import React, { memo, useEffect, useMemo, useState } from 'react'
import TradingViewWidget from '../../components/Tradingview-Widget/TradingViewWidget'
import TradingPanel from '../../components/TradinPanel/TradingPanel'
import PositionsTable from '../../components/PositionTable/PositionTable'
import InstrumentsPanel from '../../components/Instruments/Intruments'
import NavBar from '../../components/Navbar'
import { useWebSocket } from '../../customHooks/useWebsocket'
import { useSelector, useDispatch } from 'react-redux'
import { websocketPositionEvent, websocketTicksEvent } from '../../redux/websocketMiddleware'
import Footer from '../../components/Footer/Footer'
import Split from 'react-split'
import { Box, useMediaQuery, useTheme } from '@mui/material';
import SwipeableEdgeDrawer from '../../components/MobileSidebar/BottomDrawer'
import MobileOrderButton from '../../components/MobileSidebar/MobileOrderButtons'
import { updateTradingAccountDetails } from '../../redux/tradingAccoutDetailsSLice'

const ticksSocketUrl = import.meta.env.VITE_REACT_WS_TICKS_BRODCASTER_URL
const socketUrl = import.meta.env.VITE_REACT_WS_BRODCASTER_URL

const Dashboard = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const dispatch = useDispatch()
  const [drawerOpen, setDrawerOpen] = useState(false);
  const demo_id = useSelector(state => state.auth.activeId)
  const symbols = useSelector((state) => state.tradeposition?.allMandetorySymbols || [])

  const { socket: ticksSocket, sendMessage: sendTicksMessage } = useWebSocket(ticksSocketUrl)
  const { socket: broadCasterSocket, sendMessage: sendBroadCasterMessage } = useWebSocket(socketUrl)

  // Subscribe ticks
  useEffect(() => {
    const socketInstance = ticksSocket?.current
    if (!socketInstance || symbols.length === 0) return

    const subscribe = () => {
      try {
        sendTicksMessage({ event: 'subscribe', stream: 'ticks', symbols })
      } catch (err) {
        console.error('sendTicksMessage subscribe failed', err)
      }
    }

    const handleOpen = () => {
      subscribe()
      socketInstance.removeEventListener('open', handleOpen)
    }

    if (socketInstance.readyState === WebSocket.OPEN) {
      subscribe()
    } else {
      socketInstance.addEventListener('open', handleOpen)
    }

    return () => {
      try {
        sendTicksMessage({ event: 'unsubscribe', stream: 'ticks', symbols })
      } catch { }
      socketInstance.removeEventListener('open', handleOpen)
    }
  }, [ticksSocket, symbols, sendTicksMessage])

  // Subscribe broadcaster (positions)
  useEffect(() => {
    const socketInstance = broadCasterSocket?.current
    if (!socketInstance || !demo_id) return

    const subscribe = () => {
      try {
        sendBroadCasterMessage({ event: 'subscribe', stream: 'position', login_id: demo_id })
        sendBroadCasterMessage({"event":"subscribe","stream":"account_details","login_id":Number(demo_id)})
      } catch (err) {
        console.error('sendBroadCasterMessage subscribe failed', err)
      }
    }

    const handleOpen = () => {
      subscribe()
      socketInstance.removeEventListener('open', handleOpen)
    }

    if (socketInstance.readyState === WebSocket.OPEN) {
      subscribe()
    } else {
      socketInstance.addEventListener('open', handleOpen)
    }

    return () => {
      try {
        sendBroadCasterMessage({ event: 'unsubscribe', stream: 'position', login_id: demo_id })
      } catch { }
      socketInstance.removeEventListener('open', handleOpen)
    }
  }, [broadCasterSocket, demo_id, sendBroadCasterMessage])

  // Handle WebSocket position messages and dispatch to Redux
  useEffect(() => {
    const socketInstance = broadCasterSocket?.current
    if (!socketInstance) return

    const handlePositionMessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.event === "account_details") {
          dispatch(updateTradingAccountDetails(data.data))
        }
        if (data.event === "position") {
          // Dispatch WebSocket position event to Redux middleware
          dispatch(websocketPositionEvent(data.data, demo_id))
        }
      } catch (err) {
        console.error("Invalid broadcaster WS message:", event.data, err)
      }
    }

    socketInstance.addEventListener("message", handlePositionMessage)
    return () => socketInstance.removeEventListener("message", handlePositionMessage)
  }, [broadCasterSocket, demo_id, dispatch])

  // Handle WebSocket ticks messages and dispatch to Redux for real-time price updates
  useEffect(() => {
    const socketInstance = ticksSocket?.current
    if (!socketInstance) return

    const handleTicksMessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.event === "ticks") {
          // Dispatch WebSocket ticks event to Redux middleware for profit calculations
          dispatch(websocketTicksEvent(data.data))
        }
      } catch (err) {
        console.error("Invalid ticks WS message:", event.data, err)
      }
    }

    socketInstance.addEventListener("message", handleTicksMessage)
    return () => socketInstance.removeEventListener("message", handleTicksMessage)
  }, [ticksSocket, dispatch])

  return (
    <div className="dashboard flex flex-col h-screen bg-[#111111] text-white">
      <NavBar />

      {/* Main layout split: Left | Center | Right */}
      {isMdUp ? (
        <Split
          className="flex flex-1 overflow-hidden"
          sizes={[20, 62, 18]}
          minSize={[180, 400, 220]}
          gutterSize={3}
          expandToMin={true}
        >
          {/* Left */}
          <div className="border-slate-700 ">
            <InstrumentsPanel ticksSocket={ticksSocket} />
          </div>

          {/* Center */}
          <Split
            direction="vertical"
            sizes={[65, 35]}
            minSize={[200, 160]}
            gutterSize={3}
            expandToMin={true}
            className="flex flex-col  border-slate-700"
          >
            <div className="overflow-auto">
              <TradingViewWidget />
            </div>
            <div className="overflow-auto">
              <PositionsTable ticksSocket={ticksSocket} broadCasterSocket={broadCasterSocket} />
            </div>
          </Split>

          {/* Right */}
          <div className="bg-[#1e1e1e] border-slate-700 overflow-auto ">
            <TradingPanel broadCasterSocket={broadCasterSocket} />
          </div>
        </Split>
      ) : (
        <Box className="flex flex-col flex-1 overflow-hidden h-screen">
          <Box className="overflow-auto flex-1">
            <TradingViewWidget />
          </Box>
          <div className="bg-[#1e1e1e] border-l border-slate-700 overflow-auto">
           <MobileOrderButton  open={drawerOpen} onClose={setDrawerOpen} />
            <SwipeableEdgeDrawer broadCasterSocket={broadCasterSocket} open={drawerOpen} onClose={setDrawerOpen} />
          </div>
        </Box>
      )}


      <Footer />
    </div>
  )
}

export default memo(Dashboard)