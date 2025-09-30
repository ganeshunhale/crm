"use client"

import { useEffect, useRef, useState } from "react"
import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { showSnackbar } from "../../redux/snackbarslice"
import { GET_ACCOUNT_DETAILS, LIMIT_ORDER_API, MARKET_ORDER_API } from "../../API/ApiServices"
import { fetchOpenPositions, fetchPendingOrders } from "../../redux/positionSlice"
import { set } from "zod"
import OneClickTradingModal from "./components/OneCLickTradingModal"
import {BuySellButtons} from "./components/CommonComponents"
import OneClickTradingForm from "./components/OneClickTradingForm"
import RegularForm from "./components/RegularForm"
import TradeDetails from "./components/TradeDetails"

const FORM_TYPES = [{ label: "Regular form", value: "regular" }, { label: "One-Click form", value: "one-click" }]

// ✅ Reusable Number Input Field


export default function TradingPanel({ broadCasterSocket, onClose }) {
  const dispatch = useDispatch()
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));

  // ✅ State
  const [formState, setFormState] = useState({
    orderType: "market",
    volume: 0.01,
    openPrice: 0,
    takeProfit: 0,
    stopLoss: 0,
    selectedOrderType: "",
    shouldAutoFillPrice: false
  })


  const activeId = useSelector(state => state.auth.activeId)
  const tradepositionState = useSelector(state => state.tradeposition)
  const positionProfits = useRef(new Map())

  // ✅ Helper
  const updateFormField = (field, value) => {
    setFormState(prev => ({ ...prev, [field]: value }))
  }


  // ✅ Auto-fill open price (limit orders)
  useEffect(() => {
    if (formState.shouldAutoFillPrice && formState.orderType === "limit" && formState.selectedOrderType && tradepositionState.selectedSymbolData) {
      if (formState.selectedOrderType === "buy" && tradepositionState.selectedSymbolData.ask) {
        updateFormField("openPrice", tradepositionState.selectedSymbolData.ask)
      } else if (formState.selectedOrderType === "sell" && tradepositionState.selectedSymbolData.bid) {
        updateFormField("openPrice", tradepositionState.selectedSymbolData.bid)
      }
      updateFormField("shouldAutoFillPrice", false)
    }
  }, [formState.shouldAutoFillPrice, formState.orderType, formState.selectedOrderType, tradepositionState.selectedSymbolData])

  // ✅ Broadcaster socket listener
  useEffect(() => {
    const socketInstance = broadCasterSocket.current;
    if (!socketInstance) return;

    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event !== "position" || data.data.function !== "sync") return

        const { Position: positionId, Profit: profit } = data.data;
        positionProfits.current.set(positionId, Number(profit));

        const totalProfit = Array.from(positionProfits.current.values()).reduce((acc, val) => acc + val, 0);
        // setEquity(Number((initialEquity.current + totalProfit).toFixed(2)));
      } catch (err) {
        console.error("Invalid WS message:", event.data, err);
      }
    };

    socketInstance?.addEventListener("message", handleMessage);
    return () => {
      socketInstance?.removeEventListener("message", handleMessage);
    };
  }, [broadCasterSocket.current]);

  // ✅ Place order
  const placeOrder = async (_, newOrderType) => {
    let { selectedOrderType, volume, takeProfit, stopLoss, orderType, openPrice } = formState
    if(volume === 0){
       return
    }

    if (newOrderType) selectedOrderType = newOrderType

    const marketOrderPayload = {
      "event": "market-order",
      "data": {
        "symbol": tradepositionState.selectedSymbol,
        "order_type": selectedOrderType,
        "client_id": activeId,
        "volume": volume,
        "tp": takeProfit,
        "sl": stopLoss
      }
    }

    const limitOrderPayload = {
      "event": "limit-order",
      "data": {
        "symbol": tradepositionState.selectedSymbol,
        "order_type": `${selectedOrderType}_limit`,
        "sys_price": openPrice,
        "client_id": activeId,
        "volume": volume,
        "tp": takeProfit,
        "sl": stopLoss
      }
    }

    if(newOrderType){
      limitOrderPayload.data.tp = 0
      limitOrderPayload.data.sl = 0
      marketOrderPayload.data.tp = 0
      marketOrderPayload.data.sl = 0
    }

    try {
      updateFormField("selectedOrderType", "")
      const orderResponse = orderType === "limit"
        ? await LIMIT_ORDER_API(limitOrderPayload)
        : await MARKET_ORDER_API(marketOrderPayload)

      if (orderResponse.status === 200) {
        if (orderType === "limit") dispatch(fetchPendingOrders(activeId))
        dispatch(showSnackbar({ message: "Order Placed successfully!", severity: "success" }))
      }
      
    } catch (error) {
      console.error(error, "market order api failed")
      dispatch(showSnackbar({ message: "Order Error!", severity: "error" }))
    }
  }



  const handleOrderTypeSelect = (type) => {
    updateFormField("selectedOrderType", type)
    if (formState.orderType === "limit") {
      updateFormField("shouldAutoFillPrice", true)
    }
  }

  const [formType, setFormType] = useState("regular")
  const [isOneClickModalOpen, setIsOneClickModalOpen] = useState(false)
  const handleFormTypeChange = (value) => {
    if (value === "one-click" && formType !== "one-click") return setIsOneClickModalOpen(true)
    setFormType(value)
  }

  return (
    <Box display="flex" flexDirection="column" height="100%" p={2}>
      {/* Header */}
      <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
        <Typography variant="body1" fontWeight="bold">
          {tradepositionState.selectedSymbol || "Select Symbol"}
        </Typography>
      </Box>

      <Select value={formType} onChange={(e) => handleFormTypeChange(e.target.value)} className="mb-3" size={isMdDown ? "small" : "small"} >
        {FORM_TYPES.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>


      {formType == "one-click" && <OneClickTradingForm formState={formState} updateFormField={updateFormField} placeOrder={placeOrder} />}

      <BuySellButtons formState={formState} handleOrderTypeSelect={handleOrderTypeSelect} onClickOrder={formType == "one-click"} formType={formType} placeOrder={placeOrder}/>

      {formType == "regular" && <RegularForm formState={formState} updateFormField={updateFormField} placeOrder={placeOrder} onClose={onClose} />}

      <OneClickTradingModal isOpen={isOneClickModalOpen} setIsOpen={setIsOneClickModalOpen} onSubmit={(dontShowAgain) => setFormType("one-click")} />
        {/* {<TradeDetails formdata={formState} />} */}
    </Box>
  )
}
