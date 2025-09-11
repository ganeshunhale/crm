"use client"

import { useEffect, useRef, useState } from "react"
import {
  Box,
  Button,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { showSnackbar } from "../../redux/snackbarslice"
import { GET_ACCOUNT_DETAILS, LIMIT_ORDER_API, MARKET_ORDER_API } from "../../API/ApiServices"
import { fetchOpenPositions, fetchPendingOrders } from "../../redux/positionSlice"

// ✅ Reusable Number Input Field
const NumberInputField = ({
  label,
  value,
  onChange,
  placeholder,
  endAdornment,
  step = 0.01,
  minValue = 0,
  fullWidth = false
}) => (
  <Box mb={1}>
    <Typography variant="body2" color="white" mb={0.5}>
      {label}
    </Typography>
    <Box display="flex" alignItems="center" gap={1}>
      <TextField
        type="number"
        value={value}
        onChange={(e) => {
          const val = e.target.value
          onChange(val === "" ? "" : Number(val))
        }}
        fullWidth={fullWidth}
        size="small"
        placeholder={placeholder}
        InputProps={{
          endAdornment: <InputAdornment position="end">{endAdornment}</InputAdornment>,
          sx: { color: "white", height: "32px" },
        }}
        sx={{
          minWidth: 130,
          backgroundColor: "#2c2c2c",
          borderRadius: "6px",
          input: {
            color: "white",
            padding: "6px 8px",
            '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
              WebkitAppearance: 'none',
              margin: 0,
            },
            '&[type=number]': {
              MozAppearance: 'textfield',
            },
          },
        }}
      />
      <Button
        variant="outlined"
        size="small"
        onClick={() => {
          const currentValue = typeof value === "number" ? value : 0;
          const newValue = Number((currentValue + step).toFixed(3));
          onChange(newValue);
        }}
        sx={{ color: "gray", borderColor: "gray", minWidth: "32px", px: "6px" }}
      >
        +
      </Button>
      <Button
        variant="outlined"
        size="small"
        onClick={() => {
          const currentValue = typeof value === "number" ? value : 0;
          const newValue = currentValue > minValue ? Number((currentValue - step).toFixed(3)) : minValue;
          onChange(newValue);
        }}
        sx={{ color: "gray", borderColor: "gray", minWidth: "32px", px: "6px" }}
      >
        -
      </Button>
    </Box>
  </Box>
)

export default function TradingPanel({ broadCasterSocket }) {
  const dispatch = useDispatch()

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

  const [accountDetails, setAccountDetails] = useState({})
  const [equity, setEquity] = useState(0)
  const authState = useSelector(state => state.auth)
  const tradepositionState = useSelector(state => state.tradeposition)
  const positionProfits = useRef(new Map())
  const initialEquity = useRef(0)

  // ✅ Helper
  const updateFormField = (field, value) => {
    setFormState(prev => ({ ...prev, [field]: value }))
  }

  // ✅ Fetch user details
  useEffect(() => {
    getUserAccDetails()
  }, [])

  const getUserAccDetails = async () => {
    try {
      const res = await GET_ACCOUNT_DETAILS()
      setAccountDetails(res.data.result)
      const eq = Number(res.data.result?.balance) + Number(res.data.result?.credit);
      initialEquity.current = eq;
      setEquity(eq);
    } catch (error) {
      console.log(error)
    }
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
        setEquity(Number((initialEquity.current + totalProfit).toFixed(2)));
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
  const placeOrder = async () => {
    const { selectedOrderType, volume, takeProfit, stopLoss, orderType, openPrice } = formState

    const marketOrderPayload = {
      "event": "market-order",
      "data": {
        "symbol": tradepositionState.selectedSymbol,
        "order_type": selectedOrderType,
        "client_id": authState?.data?.client_MT5_id?.demo_id,
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
        "client_id": authState?.data?.client_MT5_id?.demo_id,
        "volume": volume,
        "tp": takeProfit,
        "sl": stopLoss
      }
    }

    try {
      updateFormField("selectedOrderType", "")
      const orderResponse = orderType === "limit"
        ? await LIMIT_ORDER_API(limitOrderPayload)
        : await MARKET_ORDER_API(marketOrderPayload)

      if (orderResponse.status === 200) {
        const clientId = authState?.data?.client_MT5_id?.demo_id
        if (orderType === "limit") {
          dispatch(fetchPendingOrders(clientId))
        } else {
          setTimeout(() => {
            dispatch(fetchOpenPositions(clientId))
          }, 1000)
        }
        dispatch(showSnackbar({ message: "Order Placed successfully!", severity: "success" }))
      }
    } catch (error) {
      console.error(error, "market order api failed")
      dispatch(showSnackbar({ message: "Order Error!", severity: "error" }))
    }
  }

  // ✅ Tab config
  const tabConfig = {
    market: { label: "Market", fields: ["volume", "takeProfit", "stopLoss"] },
    limit: { label: "Limit", fields: ["openPrice", "volume", "takeProfit", "stopLoss"] }
  }

  // ✅ Form fields
  const formFields = [
    { key: "openPrice", label: "Open price", endAdornment: "Limit", step: 0.01, show: formState.orderType === "limit" },
    { key: "volume", label: "Volume", endAdornment: "Lots", step: 0.01, show: true },
    { key: "takeProfit", label: "Take Profit", endAdornment: "Price", step: 0.01, placeholder: "Not set", show: true },
    { key: "stopLoss", label: "Stop Loss", endAdornment: "Price", step: 0.1, placeholder: "Stop Loss", show: true }
  ]

  // ✅ Order type buttons (light UI)
  const orderTypeButtons = [
    {
      type: "sell",
      color: "#d32f2f",
      lightBg: "rgba(211, 47, 47, 0.15)",
      hoverBg: "rgba(211, 47, 47, 0.25)",
      price: tradepositionState.selectedSymbolData?.bid
    },
    {
      type: "buy",
      color: "#158BF9",
      lightBg: "rgba(21, 139, 249, 0.15)",
      hoverBg: "rgba(21, 139, 249, 0.25)",
      price: tradepositionState.selectedSymbolData?.ask
    }
  ]

  const handleOrderTypeSelect = (type) => {
    updateFormField("selectedOrderType", type)
    if (formState.orderType === "limit") {
      updateFormField("shouldAutoFillPrice", true)
    }
  }

  return (
    <Box display="flex" flexDirection="column" height="100%" p={2}>
      {/* Header */}
      <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
        <Typography variant="body1" fontWeight="bold">
          {tradepositionState.selectedSymbol || "Select Symbol"}
        </Typography>
      </Box>

      {/* Buy / Sell Buttons */}
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5} mb={2}>
        {orderTypeButtons.map(({ type, color, lightBg, hoverBg, price }) => (
          <Box
            key={type}
            onClick={() => handleOrderTypeSelect(type)}
            sx={{
              cursor: "pointer",
              borderRadius: 2,
              p: 1.2,
              textAlign: "center",
              userSelect: "none",
              border: 2,
              borderColor: color,
              bgcolor: formState.selectedOrderType === type ? lightBg : "transparent",
              transition: "all 0.25s ease",
              "&:hover": {
                bgcolor: formState.selectedOrderType === type ? lightBg : hoverBg,
                transform: "scale(1.03)",
                boxShadow: `0 0 8px ${color}33`,
              },
              "&:active": { transform: "scale(0.97)" }
            }}
          >
            <Typography variant="caption" fontWeight="bold" color={color}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Typography>
            <Typography variant="h6" fontWeight="600" color={color}>
              {price}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Tabs */}
      <Tabs
        value={formState.orderType}
        variant="fullWidth"
        onChange={(_, val) => {
          updateFormField("orderType", val)
          if (val === "limit" && formState.selectedOrderType) {
            updateFormField("shouldAutoFillPrice", true)
          }
        }}
        sx={{
          minHeight: "32px",
          borderRadius: "8px",
          my: 1,
          backgroundColor: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.2)",
          padding: "2px",
          "& .MuiTabs-indicator": { display: "none" },
          "& .MuiTab-root": {
            color: "white",
            minHeight: "32px",
            textTransform: "none",
            borderRadius: "6px",
          },
          "& .Mui-selected": {
            color: "#fff !important",
            backgroundColor: "rgba(255,255,255,0.1)",
          },
        }}
      >
        {Object.entries(tabConfig).map(([key, config]) => (
          <Tab key={key} value={key} label={config.label} />
        ))}
      </Tabs>

      {/* Dynamic Form Fields */}
      {formFields.filter(field => field.show).map(field => (
        <NumberInputField
          key={field.key}
          label={field.label}
          value={formState[field.key]}
          onChange={(value) => updateFormField(field.key, value)}
          placeholder={field.placeholder}
          endAdornment={field.endAdornment}
          step={field.step}
          fullWidth
        />
      ))}

      <Box mt={2} />

      {/* Confirm Button */}
      {formState.selectedOrderType && (
        <Button
          onClick={placeOrder}
          fullWidth
          sx={{
            mb: 2,
            bgcolor: formState.selectedOrderType === "sell"
              ? "rgba(211,47,47,0.15)"
              : "rgba(21,139,249,0.15)",
            color: formState.selectedOrderType === "sell" ? "#d32f2f" : "#158BF9",
            border: `1px solid ${formState.selectedOrderType === "sell" ? "#d32f2f" : "#158BF9"}`,
            fontWeight: 600,
            "&:hover": {
              bgcolor: formState.selectedOrderType === "sell"
                ? "rgba(211,47,47,0.25)"
                : "rgba(21,139,249,0.25)",
              boxShadow: `0 0 10px ${formState.selectedOrderType === "sell" ? "#d32f2f55" : "#158BF955"}`,
            },
          }}
        >
          Confirm {formState.selectedOrderType === "sell" ? "Sell" : "Buy"} {formState.volume} lots
        </Button>
      )}

      {/* Cancel Button */}
      {formState.selectedOrderType && (
        <Button
          variant="outlined"
          onClick={() => updateFormField("selectedOrderType", "")}
          fullWidth
          sx={{ mb: 3, borderColor: "gray", color: "gray" }}
        >
          Cancel
        </Button>
      )}
    </Box>
  )
}
