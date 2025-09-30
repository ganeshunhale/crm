import React from "react";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";

export default function MobileOrderButton({ open, onClose }) {
    const tradepositionState = useSelector(state => state.tradeposition)

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
    console.log("tradepositionState",tradepositionState)

    const handleOrderTypeSelect = (type) => {
        onClose(true)
    }
    return (
        <Box p={2}>
            <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                <Typography variant="body1" fontWeight="bold">
                     {tradepositionState.selectedSymbol || "Select Symbol"}
                </Typography>
            </Box>

            {/* Buy / Sell Buttons */}
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5} sx={{ mb: { md: 2 } }} >
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
                            bgcolor: "transparent",
                            transition: "all 0.25s ease",
                            "&:hover": {
                                bgcolor: hoverBg,
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
        </Box>
    )
}
