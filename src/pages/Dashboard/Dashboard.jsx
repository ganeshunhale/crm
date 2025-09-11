import React, { memo, useEffect } from 'react'
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

const ticksSocketUrl = import.meta.env.VITE_REACT_WS_TICKS_BRODCASTER_URL
const socketUrl = import.meta.env.VITE_REACT_WS_BRODCASTER_URL

const Dashboard = () => {
  const dispatch = useDispatch()
  const demo_id = useSelector((state) => state.auth?.data?.client_MT5_id?.demo_id)
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
      } catch {}
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
      } catch {}
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
        console.log("Dashboard - Received broadcaster message:", data);
        if (data.event === "position") {
          console.log("Dashboard - Dispatching position event:", data.data);
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
          console.log("Dashboard - Received ticks message:", data.data);
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
      <Split
        className="flex flex-1 overflow-hidden"
        sizes={[20, 60, 20]}
        minSize={[180, 400, 220]}
        gutterSize={3}
        expandToMin={true}
      >
        {/* Left */}
        <div className="border-r border-slate-700 overflow-auto">
          <InstrumentsPanel ticksSocket={ticksSocket} />
        </div>

        {/* Center split: Chart (top) | Positions (bottom) */}
        <Split
          direction="vertical"
          sizes={[70, 30]}
          minSize={[200, 160]}
          gutterSize={3}
          expandToMin={true}
          className="flex flex-col border-r border-slate-700"
        >
          <div className="overflow-auto">
            <TradingViewWidget />
          </div>

          <div className="overflow-auto">
            <PositionsTable ticksSocket={ticksSocket} broadCasterSocket={broadCasterSocket} />
          </div>
        </Split>

        {/* Right */}
        <div className="bg-[#1e1e1e] border-l border-slate-700 overflow-auto">
          <TradingPanel broadCasterSocket={broadCasterSocket} />
        </div>
      </Split>

      <Footer />
    </div>
  )
}

export default memo(Dashboard)