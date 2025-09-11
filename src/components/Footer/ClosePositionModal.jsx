import React, { useState, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
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
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

function ClosePositionsPopper({ anchorEl, open, onClose, selected, setSelected, positions }) {
  const options = useMemo(() => {
    const buyPositions = positions.filter(p => p.type === "Buy");
    const sellPositions = positions.filter(p => p.type === "Sell");
    const profitablePositions = positions.filter(p => (p.profit || 0) > 0);
    const losingPositions = positions.filter(p => (p.profit || 0) < 0);

    const totalProfit = positions.reduce((acc, p) => acc + (p.profit || 0), 0);
    const buyProfit = buyPositions.reduce((acc, p) => acc + (p.profit || 0), 0);
    const sellProfit = sellPositions.reduce((acc, p) => acc + (p.profit || 0), 0);
    const profitableProfit = profitablePositions.reduce((acc, p) => acc + (p.profit || 0), 0);
    const losingProfit = losingPositions.reduce((acc, p) => acc + (p.profit || 0), 0);

    return [
      {
        value: "all",
        label: "Close all",
        count: positions.length,
        profit: totalProfit >= 0 ? `+${totalProfit.toFixed(2)}` : totalProfit.toFixed(2),
        active: positions.length > 0
      },
      {
        value: "profitable",
        label: "Close all profitable",
        count: profitablePositions.length,
        profit: profitablePositions.length > 0 ? `+${profitableProfit.toFixed(2)}` : "--",
        active: profitablePositions.length > 0
      },
      {
        value: "losing",
        label: "Close all losing",
        count: losingPositions.length,
        profit: losingPositions.length > 0 ? losingProfit.toFixed(2) : "--",
        active: losingPositions.length > 0
      },
      {
        value: "buy",
        label: "Close all Buy",
        count: buyPositions.length,
        profit: buyPositions.length > 0 ? (buyProfit >= 0 ? `+${buyProfit.toFixed(2)}` : buyProfit.toFixed(2)) : "--",
        active: buyPositions.length > 0
      },
      {
        value: "sell",
        label: "Close all Sell",
        count: sellPositions.length,
        profit: sellPositions.length > 0 ? (sellProfit >= 0 ? `+${sellProfit.toFixed(2)}` : sellProfit.toFixed(2)) : "--",
        active: sellPositions.length > 0
      },
    ];
  }, [positions]);

  return (
    <Popper open={open} anchorEl={anchorEl} placement="top-end" sx={{ zIndex: 1300}}>
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
                  label={`${opt.label} ${opt.count > 0 ? opt.count : ""}`}
                  disabled={!opt.active}
                  sx={{ ".MuiFormControlLabel-label": { color: "#fff" } }}
                />
                <Typography sx={{ color: opt.profit.startsWith("+") ? "#16C784" : "#EB5757" }}>
                  {opt.profit}
                </Typography>
              </Box>
            ))}
          </RadioGroup>

          <Divider sx={{ borderColor: "#333" }} />

          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <Button
              onClick={onClose}
              sx={{
                flex: 1,
                backgroundColor: "#2B3139",
                color: "#fff",
                "&:hover": { backgroundColor: "#33383f" },
                textTransform: "none",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                flex: 1,
                backgroundColor: "#FCD535",
                color: "#000",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#fbe263" },
                textTransform: "none",
              }}
            >
              Confirm
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
  const buttonRef = useRef(null);

  // Get positions from Redux state
  const positions = useSelector((state) => {
    console.log("CloseAllFooter - Redux state:", state.positions);
    return state.positions.open;
  });

  // Calculate total P/L from real position data
  const totalPL = useMemo(() => {
    return positions.reduce((acc, position) => acc + (position.profit || 0), 0);
  }, [positions]);

  return (
    <>
      {/* Footer Bar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ px: 2, py: 1 }}>
        <Typography sx={{ color: totalPL >= 0 ? "#16C784" : "#EB5757", fontSize: "14px", mr: 1 }}>
          Total P/L, USD: {totalPL.toFixed(2)}
        </Typography>

        <Button
          ref={buttonRef}
          variant="outlined"
          onClick={() => setOpen((prev) => !prev)}
          endIcon={<ArrowDropDownIcon />}
          sx={{
            textTransform: "none",
            color: "#fff",
            borderColor: "#2B3139",
            "&:hover": { borderColor: "#444" },
            fontSize: "14px",
            px: 2,
          }}
        >
          Close all
        </Button>
      </Box>

      {/* Popper */}
      <ClosePositionsPopper
        anchorEl={buttonRef.current}
        open={open}
        onClose={() => setOpen(false)}
        selected={selected}
        setSelected={setSelected}
        positions={positions}
      />
    </>
  );
}
