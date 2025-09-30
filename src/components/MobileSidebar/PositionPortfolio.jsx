import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Button, Stack, Card, Chip, Tabs, Tab } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EditIcon from '@mui/icons-material/Edit';

const getReadableType = (type, tab) => {
    const ORDER_TYPE_CONSTANT = {
        0: "Buy",
        1: "Sell",
        2: "Buy_limit",
        3: "Sell_limit",
        4: "Buy_stop",
        5: "Sell_stop",
        6: "Buy_stop_limit",
        7: "Sell_stop_limit",
        8: "Close_by"
    };

    if (tab === "closed") type = type === 0 ? 1 : 0;
    return typeof type === "number"
        ? ORDER_TYPE_CONSTANT[type] || "Unknown"
        : type;
};

const formatPrice = (price) =>
    price != null ? String(price).slice(0, 7) : "-";

const tabConfig = {
    pending: { label: 'Pending' },
    open: { label: 'Open' },
    closed: { label: 'Closed' }
};

export default function MobilePositionsCards() {
    const [activeTab, setActiveTab] = useState("open");
    const { open: openPositions, pending, closed } = useSelector(
        (state) => state.positions
    );

    const tabData = {
        open: openPositions,
        pending,
        closed,
    };

    const renderCard = (item, index) => {
        const type = getReadableType(item.type, activeTab);
        const isProfit = item?.profit > 0;
        const isLoss = item?.profit < 0;

        return (
            <Card key={index} sx={{ mb: 2, p: { sm: 1, md: 4 }, color: '#fff', borderRadius: '8px' }}>
                <Stack direction="row" justifyContent="space-between">
                    <Chip
                        label={type}
                        size="small"
                        sx={{
                            bgcolor: type.includes("Buy") ? "#158BF9" : "#EB483F",
                            color: "white"
                        }}
                    />
                    <Typography variant="caption">{item?.symbol}</Typography>
                </Stack>

                <Typography mt={1}>
                    Volume: <b>{item?.volume}</b>
                </Typography>
                <Typography>
                    Open Price: <b>{formatPrice(item?.open_price)}</b>
                </Typography>

                {activeTab === "closed" ? (
                    <Typography>
                        Closed Price: <b>{formatPrice(item?.closed_price)}</b>
                    </Typography>
                ) : (
                    <Typography>
                        Current Price: <b>{formatPrice(item?.current_price)}</b>
                    </Typography>
                )}

                <Typography>
                    T/P: <b>{item?.tp}</b> | S/L: <b>{item?.sl}</b>
                </Typography>

                <Typography>
                    Position ID: <b>{item?.positionId || item?.order_id || item?.ticket}</b>
                </Typography>

                <Typography>
                    Time: <b>{item?.posTime || item?.time}</b>
                </Typography>

                {(activeTab === "open" || activeTab === "closed") && (
                    <Typography mt={1} fontWeight="bold" color={isProfit ? "green" : isLoss ? "red" : "gray"}>
                        P/L: {item?.profit?.toFixed(2) ?? "-"}
                    </Typography>
                )}

                {(activeTab === "open" || activeTab === "pending") && (
                    <Stack direction="row" spacing={2} mt={2}>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<EditIcon />}
                            sx={{ color: "white", borderColor: "white" }}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<HighlightOffIcon />}
                            sx={{ color: "red", borderColor: "red" }}
                        >
                            Close
                        </Button>
                    </Stack>
                )}
            </Card>
        );
    };

    return (
        <Box sx={{ px: 2, py: 1 }}>
            {/* Toggle Tabs */}
            <Stack direction="row" justifyContent="center" mb={2}>
                <Tabs
                    value={activeTab}
                    variant="fullWidth"
                    onChange={(_, val) => setActiveTab(val)}
                    sx={{
                        minHeight: 30,
                        borderRadius: "8px",
                        width: '100%',
                        maxWidth: 350,
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                        backgroundColor: "#f9f9f9",
                        padding: 0.5,

                        '.MuiTabs-indicator': {
                            display: 'none',
                        },

                        '.MuiTab-root': {
                            minHeight: 30,
                            padding: '6px 12px',
                            borderRadius: '6px',
                            color: 'black',
                            textTransform: 'none',
                            fontWeight: 500,
                            minWidth: 0,
                        },

                        '.Mui-selected': {
                            backgroundColor: 'rgba(0, 0, 0, 0.12)',
                        },
                    }}
                >
                    {Object.entries(tabConfig).map(([key, config]) => (
                        <Tab
                            key={key}
                            value={key}
                            label={`${config.label} (${tabData[key]?.length || 0})`}
                        />
                    ))}
                </Tabs>
            </Stack>

            {/* Card list */}
            {tabData[activeTab]?.length > 0 ? (
                tabData[activeTab].map(renderCard)
            ) : (
                <Typography color="gray" textAlign="center">
                    No {activeTab} positions
                </Typography>
            )}
        </Box>
    );
}
