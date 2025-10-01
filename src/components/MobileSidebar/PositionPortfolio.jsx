import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Button, Stack, Card, Tabs, Tab,CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { ORDER_TYPE_CONSTANT } from '../../constants';
import { fetchClosedOrders, fetchOpenPositions, fetchPendingOrders } from '../../redux/positionSlice';
import PositionDialog from '../PositionTable/PositionDailog';
import { DELETE_OPEN_ORDER, DELETE_PENDING_ORDER } from '../../API/ApiServices';
import { showSnackbar } from '../../redux/snackbarslice';

const getReadableType = (type, tab) => {
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
    const dispatch = useDispatch()
    const [activeTab, setActiveTab] = useState("open");
    const [openDialogue, setOpenDialogue] = useState(false)
    const [loading, setLoading] = useState(false)
    const [editData, setEditData] = useState({})
    const demo_id = useSelector(state => state.auth.activeId)

    const { open, pending, closed } = useSelector(
        (state) => state.positions
    );

    const tabData = {
        open,
        pending,
        closed,
    };


    useEffect(() => {
        if (!demo_id) return;
        dispatch(fetchOpenPositions(demo_id));
        dispatch(fetchPendingOrders(demo_id));

        const now = new Date();
        const oneDay = 24 * 60 * 60 * 1000;
        const from = new Date(now.getTime() - oneDay).toISOString();
        const to = new Date(now.getTime() + oneDay).toISOString();
        const payload = { event: "get-deals", data: { from, to, client_id: demo_id } };
        dispatch(fetchClosedOrders({ data: payload }));

    }, [dispatch, demo_id]);

    const handleDelete = async (data) => {
        setLoading(data.positionId || data.order_id);
        try {
            if (activeTab === "open") {
                const payload = {
                    event: "close-position",
                    data: { position_id: [data.positionId] },
                };
                const res = await DELETE_OPEN_ORDER(payload);
                if (res.status === 200) {
                    dispatch(showSnackbar({ message: `Position closed  \n ${getReadableType(data.type)}  ${data.volume} lot ${data.symbol} at ${data.current_price}`, severity: "success" }));
                    dispatch(fetchOpenPositions(demo_id));
                }
            } else if (activeTab === "pending") {
                const payload = {
                    event: "delete-pending-order",
                    data: { order_id: data.order_id },
                };
                const res = await DELETE_PENDING_ORDER(payload);
                if (res.status === 200) {
                    dispatch(showSnackbar({ message: `Pending Order deleted \n${getReadableType(data.type)} ${data.volume} lot ${data.symbol} at ${data.current_price}`, severity: "success" }));
                    dispatch(fetchPendingOrders(demo_id));
                }
            }

            const now = new Date();
            const oneDay = 24 * 60 * 60 * 1000;
            const from = new Date(now.getTime() - oneDay).toISOString();
            const to = new Date(now.getTime() + oneDay).toISOString();
            const payload = { event: "get-deals", data: { from, to, client_id: demo_id } };
            dispatch(fetchClosedOrders({ data: payload }));
        } catch (err) {
            dispatch(showSnackbar({ message: `Error occured`, severity: "error" }));
        }
        finally {
            setTimeout(() => {
                setLoading(false);
            }, 100)
        }
    }

    const renderCard = (item, index) => {
        const type = getReadableType(item?.type, activeTab);
        const isProfit = item?.profit > 0;
        const isLoss = item?.profit < 0;

        return (
            <Card key={index} sx={{ my: 1, mx:{xs:0,sm: 3}, p: {xs:1, sm: 2, md: 4 }, color: '#fff', borderRadius: '8px' }}>
               {(activeTab !== "closed") && <Stack direction="row" justifyContent="end" color={'grey'} gap={1}>
                    <EditIcon sx={{ width: "20px" }} onClick={() => { setEditData(item); setOpenDialogue(true) }} />
                     { (loading === item.positionId || loading === item.order_id) ? <CircularProgress size={16} /> : <CloseIcon onClick={() => handleDelete(item)} />}
                </Stack>}
                <Stack direction="row" justifyContent="space-between">
                    <Stack direction="row" justifyContent="center" alignItems="center">
                        <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
                            {/* Dot */}
                            <Box
                                sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    bgcolor: type?.includes("Buy") ? "#158BF9" : "#EB483F",
                                }}
                            />
                            <span>{type}</span>
                        </Stack>

                        <Typography ml={1} variant="body1">{item?.symbol || ''}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="center" alignItems="center">
                        {(activeTab === "open" || activeTab === "closed") && (
                            <Typography mt={1} fontWeight="bold" color={isProfit ? "green" : isLoss ? "red" : "gray"}>
                                P/L: 3434{item?.profit?.toFixed(2) ?? "-"}
                            </Typography>
                        )}

                    </Stack>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Stack direction="row" justifyContent="center" alignItems="center" textAlign="center">
                        <Typography>
                            Volume: <b>{item?.volume || 0}</b>
                        </Typography>
                        <Typography ml={1}>
                            Open Price: <b>{formatPrice(item?.open_price || 230)}</b>
                        </Typography>
                    </Stack>
                    {activeTab === "closed" ? (
                        <Typography>
                            Closed Price: <b>{formatPrice(item?.closed_price || 0)}</b>
                        </Typography>
                    ) : (
                        <Typography>
                            Current Price: <b>{formatPrice(item?.current_price || 0)}</b>
                        </Typography>
                    )}
                </Stack>
            </Card>
        );
    };

    return (
        <Box sx={{ px: 2, py: 1 }}>
            {/* Toggle Tabs */}
            <Stack direction="row" justifyContent="center" mb={2} >
                <Tabs
                    value={activeTab}
                    variant="fullWidth"
                    onChange={(_, val) => setActiveTab(val)}
                    sx={{
                        minHeight: "32px",
                        borderRadius: "8px",
                        my: 1,
                        width: 450,
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
                    {/* {renderCard()} */}


                </Typography>
            )}
            <PositionDialog onOpen={openDialogue} onClose={setOpenDialogue} editData={editData} setEditData={setEditData} activeTab={activeTab} />
        </Box>
    );
}
