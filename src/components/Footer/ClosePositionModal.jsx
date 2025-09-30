import React, { useState, useRef, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Popper,
  Paper,
  ClickAwayListener,
  CircularProgress,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { DELETE_OPEN_ORDER } from "../../API/ApiServices";

const API_BASE_URL = "http://192.168.15.104:8000";

function ClosePositionsPopper({ 
  anchorEl, 
  open, 
  onClose, 
  selected, 
  setSelected, 
  positions, 
  onConfirm, 
  loading 
}) {
  const options = useMemo(() => {
    if (!positions?.length) {
      return [
        {
          value: "all",
          label: "Close all",
          ids: [],
          profit: "--",
          active: false,
        },
      ];
    }

    const stats = positions.reduce(
      (acc, position) => {
        const profit = position.profit || 0;
        const id = position.positionId;

        acc.total.profit += profit;
        acc.total.ids.push(id);

        if (position.type === "Buy") {
          acc.buy.profit += profit;
          acc.buy.ids.push(id);
        } else if (position.type === "Sell") {
          acc.sell.profit += profit;
          acc.sell.ids.push(id);
        }

        if (profit > 0) {
          acc.profitable.profit += profit;
          acc.profitable.ids.push(id);
        } else if (profit < 0) {
          acc.losing.profit += profit;
          acc.losing.ids.push(id);
        }

        return acc;
      },
      {
        total: { profit: 0, ids: [] },
        buy: { profit: 0, ids: [] },
        sell: { profit: 0, ids: [] },
        profitable: { profit: 0, ids: [] },
        losing: { profit: 0, ids: [] },
      }
    );

    const formatProfit = (profit, hasPositions) => {
      if (!hasPositions) return "--";
      return profit >= 0 ? `+${profit.toFixed(2)}` : profit.toFixed(2);
    };

    return [
      {
        value: "all",
        label: "Close all",
        ids: stats.total.ids,
        profit: formatProfit(stats.total.profit, stats.total.ids.length > 0),
        active: stats.total.ids.length > 0,
      },
      {
        value: "profitable",
        label: "Close all profitable",
        ids: stats.profitable.ids,
        profit: formatProfit(stats.profitable.profit, stats.profitable.ids.length > 0),
        active: stats.profitable.ids.length > 0,
      },
      {
        value: "losing",
        label: "Close all losing",
        ids: stats.losing.ids,
        profit: formatProfit(stats.losing.profit, stats.losing.ids.length > 0),
        active: stats.losing.ids.length > 0,
      },
      {
        value: "buy",
        label: "Close all Buy",
        ids: stats.buy.ids,
        profit: formatProfit(stats.buy.profit, stats.buy.ids.length > 0),
        active: stats.buy.ids.length > 0,
      },
      {
        value: "sell",
        label: "Close all Sell",
        ids: stats.sell.ids,
        profit: formatProfit(stats.sell.profit, stats.sell.ids.length > 0),
        active: stats.sell.ids.length > 0,
      },
    ];
  }, [positions]);

  const selectedOption = options.find(opt => opt.value === selected);

  return (
    <Popper open={open} anchorEl={anchorEl} placement="top-end" sx={{ zIndex: 1300 }}>
      <ClickAwayListener onClickAway={onClose}>
        <Paper sx={{ backgroundColor: "#1E2329", color: "#fff", borderRadius: 1, p: 2, minWidth: 300 }}>
          <Typography sx={{ fontSize: "16px", mb: 1 }}>
            Close all positions at the market prices?
          </Typography>

          <RadioGroup value={selected} onChange={(e) => setSelected(e.target.value)}>
            {options.map((opt) => (
              <Box
                key={opt.value}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{ opacity: opt.active ? 1 : 0.5, my: 0.5 }}
              >
                <FormControlLabel
                  value={opt.value}
                  control={<Radio sx={{ color: "#fff" }} />}
                  label={`${opt.label} ${opt.ids.length > 0 ? `(${opt.ids.length})` : ""}`}
                  disabled={!opt.active}
                  sx={{ ".MuiFormControlLabel-label": { color: "#fff" } }}
                />
                <Typography 
                  sx={{ 
                    color: opt.profit === "--" ? "#fff" : opt.profit.startsWith("+") ? "#16C784" : "#EB5757" 
                  }}
                >
                  {opt.profit}
                </Typography>
              </Box>
            ))}
          </RadioGroup>

          <Divider sx={{ borderColor: "#333", my: 2 }} />

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              onClick={onClose}
              disabled={loading}
              sx={{
                flex: 1,
                backgroundColor: "#2B3139",
                color: "#fff",
                "&:hover": { backgroundColor: "#33383f" },
                "&:disabled": { backgroundColor: "#1a1d23", color: "#666" },
                textTransform: "none",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={onConfirm}
              disabled={loading || !selectedOption?.active}
              sx={{
                flex: 1,
                backgroundColor: "#FCD535",
                color: "#000",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#fbe263" },
                "&:disabled": { backgroundColor: "#665a1a", color: "#333" },
                textTransform: "none",
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Confirm"}
            </Button>
          </Box>
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
}

export default function CloseAllFooter() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("all");
  const [loading, setLoading] = useState(false);
  const buttonRef = useRef(null);

  const positions = useSelector((state) => state.positions?.open || []);

  const totalPL = useMemo(() => {
    return positions.reduce((acc, position) => acc + (position.profit || 0), 0);
  }, [positions]);

  const closePositions = useCallback(async (positionIds) => {
    if (!positionIds?.length) {
      console.warn("No position IDs provided");
      return;
    }

    setLoading(true);
    
    try {
      const response = await DELETE_OPEN_ORDER({
        event: "close-position",
        data: {
          position_id: positionIds
        }
      });

      console.log("Positions closed successfully:", response.data);
      
      // Close the popper after successful submission
      setOpen(false);
      setSelected("all"); // Reset selection
      
      // You might want to dispatch a Redux action here to update the positions state
      // dispatch(updatePositions(response.data));
      
    } catch (error) {
      console.error("Failed to close positions:", error);
      
      // Handle different error types
      if (error.code === 'ECONNABORTED') {
        alert("Request timed out. Please try again.");
      } else if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || "Failed to close positions";
        alert(`Error: ${errorMessage}`);
      } else if (error.request) {
        // Network error
        alert("Network error. Please check your connection and try again.");
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleConfirm = useCallback(() => {
    // Find the selected option and get its IDs
    const options = [
      { value: "all", ids: positions.map(p => p.positionId) },
      { value: "profitable", ids: positions.filter(p => (p.profit || 0) > 0).map(p => p.positionId) },
      { value: "losing", ids: positions.filter(p => (p.profit || 0) < 0).map(p => p.positionId) },
      { value: "buy", ids: positions.filter(p => p.type === "Buy").map(p => p.positionId) },
      { value: "sell", ids: positions.filter(p => p.type === "Sell").map(p => p.positionId) },
    ];

    const selectedOption = options.find(opt => opt.value === selected);
    
    if (selectedOption?.ids.length > 0) {
      closePositions(selectedOption.ids);
    }
  }, [selected, positions, closePositions]);

  const handleToggle = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  const handleClose = useCallback(() => {
    if (!loading) {
      setOpen(false);
    }
  }, [loading]);

  // Don't render if no positions
  if (!positions?.length) {
    return null;
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography sx={{ color: totalPL >= 0 ? "#16C784" : "#EB5757", fontSize: "14px", mr: 1 }}>
          Total P/L, USD: {totalPL >= 0 ? `+${totalPL.toFixed(2)}` : totalPL.toFixed(2)}
        </Typography>

        <Button
          ref={buttonRef}
          variant="outlined"
          onClick={handleToggle}
          endIcon={<ArrowDropDownIcon />}
          disabled={loading}
          sx={{
            textTransform: "none",
            color: "#fff",
            borderColor: "#2B3139",
            "&:hover": { borderColor: "#444" },
            "&:disabled": { borderColor: "#1a1d23", color: "#666" },
            fontSize: "14px",
            px: 2,
          }}
        >
          Close all
        </Button>
      </Box>

      <ClosePositionsPopper
        anchorEl={buttonRef.current}
        open={open}
        onClose={handleClose}
        selected={selected}
        setSelected={setSelected}
        positions={positions}
        onConfirm={handleConfirm}
        loading={loading}
      />
    </>
  );
}