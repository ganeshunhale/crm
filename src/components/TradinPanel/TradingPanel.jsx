"use client"

import { useEffect, useState } from "react"
import {
  Box,
  Button,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
  IconButton,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux"
import { showSnackbar } from "../../redux/snackbarslice";
import { GET_ACCOUNT_DETAILS, LIMIT_ORDER_API, MARKET_ORDER_API, OPEN_POSITION_API, PENDING_ORDER_API } from "../../API/ApiServices"
import { fetchOpenPositions, fetchPendingOrders } from "../../redux/positionSlice"

export default function TradingPanel() {
  const dispatch = useDispatch();
  const [orderType, setOrderType] = useState("market")
  const [volume, setVolume] = useState(0.01)
  const [openPrice, setOpenPrice] = useState(0)
  const [takeProfit, setTakeProfit] = useState(0)
  const [stopLoss, setStopLoss] = useState(0)
  const [accountDetails, setAccountDetails] = useState({})
  const [selectedOrderType, setSelectedOrderType] = useState("sell")
  const authState = useSelector(state => state.auth)
  const tradepositionState = useSelector(state => state.tradeposition)
  // Mock prices for demonstration

  useEffect(() => {
    getUserAccDetails()
  }, [])

  const getUserAccDetails = async () => {
    try {
      const res = await GET_ACCOUNT_DETAILS()
      setAccountDetails(res.data.result)
      console.log("user-details", res)
    } catch (error) {
      console.log(error)
    }
  }


  const placeOrder = async () => {
    let marketOrderPayoad = {
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
    let limitOrderPaload = {
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
      const marketOrder = orderType == "pending" ? await LIMIT_ORDER_API(limitOrderPaload) : await MARKET_ORDER_API(marketOrderPayoad)
      console.log("order-call", marketOrder)
      if (marketOrder.status === 200) {
        const _id = authState?.data?.client_MT5_id?.demo_id;
        if (orderType === "pending") {
          dispatch(fetchPendingOrders(_id));
        } else {
          dispatch(fetchOpenPositions(_id));
        }
        dispatch(showSnackbar({ message: "Order Placed successfully!", severity: "success" }));
      }
    } catch (error) {
      console.error(error, "market order api failed")
      dispatch(showSnackbar({ message: "Order Error!", severity: "error" }));
    }
  }


  return (
    <Box display="flex" flexDirection="column" height="100%" p={2}>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography variant="h6" color="white">
          {tradepositionState.selectedSymbol}
        </Typography>
        <IconButton size="small" sx={{ color: "gray" }}>
          <CloseIcon />
        </IconButton>
      </Box>



      {/* Buy/Sell Buttons */}
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1} mb={1}>
        <Box onClick={() => setSelectedOrderType("sell")}
          sx={{
            cursor: "pointer",
            borderRadius: 1,
            p: 1,
            textAlign: "center",
            userSelect: "none",
            border: 2,
            borderColor: "error.main",
            bgcolor: selectedOrderType === "sell" ? "error.main" : "transparent",
            transition: "background-color 0.3s ease",
            "&:hover": {
              bgcolor: selectedOrderType === "sell" ? "error.main" : "rgba(211, 47, 47, 0.1)", // subtle hover
            },
          }}>
          <Typography variant="caption" color={selectedOrderType === "sell" ? "white" : "error.main"}>
            Sell
          </Typography>
          <Typography variant="h6" color={selectedOrderType === "sell" ? "white" : "error.main"}>
            {tradepositionState.selectedSymbolData.bid}
          </Typography>
          {/* <Typography variant="caption" color={selectedOrderType === "sell" ? "white" : "error.main"}>
            -69%
          </Typography> */}
        </Box>
        <Box onClick={() => setSelectedOrderType("buy")}
          sx={{
            cursor: "pointer",
            borderRadius: 1,
            p: 1,
            textAlign: "center",
            userSelect: "none",
            border: 2,
            borderColor: "#158BF9",
            bgcolor: selectedOrderType === "buy" ? "#158BF9" : "transparent",
            transition: "background-color 0.3s ease",
            "&:hover": {
              bgcolor: selectedOrderType === "buy" ? "#158BF9" : "rgba(25, 118, 210, 0.1)",
            },
          }}>
          <Typography variant="caption" color={selectedOrderType === "buy" ? "white" : "#158BF9"}>
            Buy
          </Typography>
          <Typography variant="h6" color={selectedOrderType === "buy" ? "white" : "#158BF9"}>
            {tradepositionState.selectedSymbolData.ask}
          </Typography>
          {/* <Typography variant="caption" color={selectedOrderType === "buy" ? "white" : "primary.main"}>
            31%
          </Typography> */}
        </Box>
      </Box>

      {/* Order Type Tabs */}
      <Tabs
        value={orderType}
        onChange={(e, val) => setOrderType(val)}
        variant="fullWidth"
        sx={{
          mb: 1,
          "& .MuiTab-root": { color: "white" },
          "& .Mui-selectedOrderType": { backgroundColor: "rgba(255,255,255,0.1)" },
        }}
      >
        <Tab value="market" label="Market" />
        <Tab value="pending" label="Pending" />
      </Tabs>


      {orderType == "pending" && <Box mb={1}>
        <Typography variant="body2" color="gray" >
          Open price
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            type="number"
            value={openPrice}
            onChange={(e) => {
              const val = e.target.value;
              setOpenPrice(val === "" ? "" : Number(val));
            }}
            fullWidth

            size="small"
            InputProps={{
              endAdornment: <InputAdornment position="end">Limit</InputAdornment>,
              sx: { color: "white" },
            }}
            sx={{
              minWidth: 130,
              backgroundColor: "#2c2c2c",
              input: {
                color: "white",
                // remove arrows (Chrome, Edge, Safari)
                '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0,
                },
                // remove arrows (Firefox)
                '&[type=number]': {
                  MozAppearance: 'textfield',
                },
              },
            }}

          />
          <Button variant="outlined" onClick={() => setOpenPrice(prev => (typeof prev === "number" ? Number((prev + 0.01).toFixed(3)) : 1))} sx={{ color: "gray", borderColor: "gray",width:'10px' }}>
            +
          </Button>
          <Button variant="outlined" onClick={() => setOpenPrice(prev => (typeof prev === "number" && prev > 0 ? Number((prev - 0.01).toFixed(3)) : 0))} sx={{ color: "gray", borderColor: "gray" }}>
            -
          </Button>
        </Box>
      </Box>}

      {/* Volume */}
      <Box mb={1}>
        <Typography variant="body2" color="gray" >
          Volume
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            type="number"
            value={volume}
            onChange={(e) => {
              const val = e.target.value;
              setVolume(val === "" ? "" : Number(val));
            }}
            fullWidth
            size="small"
            InputProps={{
              endAdornment: <InputAdornment position="end">Lots</InputAdornment>,
              sx: { color: "white" },
            }}
            sx={{
              minWidth: 130,
              backgroundColor: "#2c2c2c",
              input: { color: "white" },
            }}

          />
          <Button variant="outlined" onClick={() => setVolume(prev => (typeof prev === "number" ? Number((prev + 0.01).toFixed(3)) : 1))} sx={{ color: "gray", borderColor: "gray" }}>
            +
          </Button>
          <Button variant="outlined" onClick={() => setVolume(prev => (typeof prev === "number" && prev > 0 ? Number((prev - 0.01).toFixed(3)) : 0))} sx={{ color: "gray", borderColor: "gray" }}>
            -
          </Button>
        </Box>
      </Box>

      {/* Take Profit */}
      <Box mb={1}>
        <Box display="flex" justifyContent="space-between" alignItems="center" >
          <Typography variant="body2" color="gray">
            Take Profit
          </Typography>
          <InfoOutlinedIcon fontSize="small" sx={{ color: "gray" }} />
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          {/* <Typography variant="caption" color="gray">
            Not set
          </Typography> */}
          <TextField
            type="number"
            value={takeProfit}
            onChange={(e) => {
              const val = e.target.value;
              setTakeProfit(val === "" ? "" : Number(val));
            }}
            size="small"
            placeholder="Not set"
            InputProps={{
              endAdornment: <InputAdornment position="end">Price</InputAdornment>,
              sx: { color: "white" },
            }}
            sx={{
              minWidth: 130,
              backgroundColor: "#2c2c2c",
              input: { color: "white" },
            }}
          />
          <Button variant="outlined" onClick={() => setTakeProfit(prev => (typeof prev === "number" ? Number((prev + 0.01).toFixed(3)) : 0.1))} sx={{ color: "gray", borderColor: "gray" }}>
            +
          </Button>
          <Button variant="outlined" onClick={() => setTakeProfit(prev => (typeof prev === "number" && prev > 0 ? Number((prev - 0.01).toFixed(3)) : 0))} sx={{ color: "gray", borderColor: "gray" }}>
            -
          </Button>
        </Box>
      </Box>

      {/* Stop Loss */}
      <Box mb={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="body2" color="gray">
            Stop Loss
          </Typography>
          <InfoOutlinedIcon fontSize="small" sx={{ color: "gray" }} />
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            type="number"
            value={stopLoss}
            onChange={(e) => {
              const val = e.target.value;
              setStopLoss(val === "" ? "" : Number(val));
            }}
            size="small"
            placeholder="Stop Loss"
            InputProps={{
              endAdornment: <InputAdornment position="end">Price</InputAdornment>,
              sx: { color: "white" },
            }}
            sx={{
              minWidth: 130,
              backgroundColor: "#2c2c2c",
              input: { color: "white" },
            }}
          />
          <Button variant="outlined" onClick={() => setStopLoss(prev => (typeof prev === "number" ? Number((prev + 0.1).toFixed(3)) : 1))} sx={{ color: "gray", borderColor: "gray" }}>
            +
          </Button>
          <Button variant="outlined" onClick={() => setStopLoss(prev => (typeof prev === "number" && prev > 0 ? Number((prev - 0.1).toFixed(3)) : 0))} sx={{ color: "gray", borderColor: "gray" }}>
            -
          </Button>
        </Box>
      </Box>

      {/* Confirm Button */}
      <Button
        onClick={placeOrder}
        variant="contained"
        fullWidth
        sx={{
          mb: 2,
          bgcolor: selectedOrderType === "sell" ? "error.main" : "#158BF9",
          "&:hover": {
            bgcolor: selectedOrderType === "sell" ? "error.dark" : "#158BF9",
          },
        }}
      >
        Confirm {selectedOrderType === "sell" ? "Sell" : "Buy"} {volume} lots
      </Button>

      <Button variant="outlined" fullWidth sx={{ mb: 3, borderColor: "gray", color: "gray" }}>
        Cancel
      </Button>

      {/* Trading Info */}
      <Box display="flex" flexDirection="column" gap={1}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" color="gray">
            Balance :
          </Typography>
          <Typography variant="body2" color="white">
            ~ {accountDetails?.balance} USD ⓘ
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" color="gray">
            Credit :
          </Typography>
          <Typography variant="body2" color="white">
            {accountDetails?.credit} ⓘ
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2" color="gray">
            Equity :
          </Typography>
          <Typography variant="body2" color="white">
            {accountDetails?.balance + accountDetails?.credit}
          </Typography>
        </Box>
        <Button variant="text" size="small" sx={{ color: "skyblue", textTransform: "none" }}>
          More ↓
        </Button>
      </Box>
    </Box>
  )
}
