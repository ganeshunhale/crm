import { Box, Tabs, Tab, Typography } from "@mui/material"
import { useMemo } from "react"
import { useSelector } from "react-redux"

// ✅ Tab config
const tabConfig = {
    market: { label: "Market", fields: ["volume", "takeProfit", "stopLoss"] },
    limit: { label: "Limit", fields: ["openPrice", "volume", "takeProfit", "stopLoss"] }
}

export function BuySellButtons({ formState, handleOrderTypeSelect, onClickOrder, placeOrder, formType }) {
    const tradepositionState = useSelector(state => state.tradeposition)
    const orderTypeButtons = useMemo(() => [
        {
            type: "sell",
            color: "#fff",
            lightBg: "#d32f2f",
            hoverBg: "rgba(211, 47, 47, 0.25)",
            price: tradepositionState.selectedSymbolData?.bid
        },
        {
            type: "buy",
            color: "#fff",
            lightBg: "#158BF9",
            hoverBg: "rgba(21, 139, 249, 0.25)",
            price: tradepositionState.selectedSymbolData?.ask
        }
    ], [tradepositionState])

    const handleOrder = (type) => {
        handleOrderTypeSelect(type)
        if (onClickOrder) placeOrder(null, type)
    }

    return (
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1.5} sx={{ mb: { md: 2 } }} >
            {orderTypeButtons.map(({ type, color, lightBg, hoverBg, price }) => (
                <Box
                    key={type}
                    onClick={() => handleOrder(type)}
                    sx={{
                        cursor: "pointer",
                        borderRadius: 2,
                        p: 1.2,
                        textAlign: "center",
                        userSelect: "none",
                        border: formState.selectedOrderType === type ? 0 : 2,
                        borderColor: formState.selectedOrderType === type ? color : lightBg,
                        bgcolor: formState.selectedOrderType === type ? lightBg : formType === "one-click" ? lightBg : "transparent",
                        transition: "all 0.25s ease",
                        "&:hover": {
                            bgcolor: formState.selectedOrderType === type ? lightBg : formType === "one-click" ? lightBg :hoverBg,
                            transform: "scale(1.03)",
                            boxShadow: `0 0 8px ${color}33`,
                        },
                        "&:active": { transform: "scale(0.97)" }
                    }}
                >
                    <Typography variant="caption" fontWeight="bold" color={formState.selectedOrderType === type ? color :formType === "one-click" ? color : lightBg}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Typography>
                    <Typography variant="h6" fontWeight="600" color={formState.selectedOrderType === type ? color : formType === "one-click" ? color : lightBg}>
                        {price}
                    </Typography>
                </Box>
            ))}
        </Box>
    )
}

export function OrderTypeButtons({ formState, updateFormField }) {
    return (
        <Tabs
            value={formState.orderType}
            variant="fullWidth"
            onChange={(_, val) => {
                updateFormField("orderType", val)
                updateFormField("volume", 0.01)
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
    )
}
