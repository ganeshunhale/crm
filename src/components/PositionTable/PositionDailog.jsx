import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, IconButton, InputAdornment, Typography } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close"
import { EDIT_OPEN_ORDER, EDIT_PENDING_ORDER } from '../../API/ApiServices';
import { useSelector } from "react-redux"

export default function PositionDialog({ onOpen, onClose, editData, setEditData, activeTab, getPositions }) {

    const [tP, setTP] = useState(0)
    const [sl, setSl] = useState(0)
    const [openPrice, setOpenPrice] = useState(0)
    const isLoggedIn = useSelector(state => state.auth)
    const demo_id = isLoggedIn.data.client_MT5_id.demo_id

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        const payload = {
            ...formJson,
            tp: formJson.tp ? Number(formJson.tp) : 0,
            sl: formJson.sl ? Number(formJson.sl) : 0,
            openPrice: formJson.openPrice ? Number(formJson.openPrice) : 0,
        };
        if (activeTab === "pending") {
            const data = {
                "event": "modify-order",
                "data": {
                    "order_id": editData?.order_id,
                    "tp": payload.tp,
                    "sl": payload.sl,
                    "openPrice": payload.openPrice
                }
            }
            try {
                const res = await EDIT_PENDING_ORDER(data)
                if (res.status === 200) {
                    getPositions(demo_id)
                    handleClose()
                }
            } catch (error) {
                console.log(error)
            }

        } else {
            const data = {
                "event": "modify-position",
                "data": {
                    "position_id": editData?.positionId,
                    "sl": payload.sl,
                    "tp": payload.tp
                }
            }
            try {
                const res = await EDIT_OPEN_ORDER(data)
                if (res.status === 200) {
                    getPositions(demo_id)
                    handleClose()
                }
            } catch (error) {
                console.log(error)
            }

        }

    };

    const handleReset = () => {
        setTP(editData.tp)
        setSl(editData.sl)
        if (activeTab === "pending") {
            setOpenPrice(editData.order_price)
        }
    }

    useEffect(() => {
        setTP(editData.tp)
        setSl(editData.sl)
        if (activeTab === "pending") {
            setOpenPrice(editData.order_price)
        }
    }, [editData])

    const handleClose = () => {
        onClose(false);
        setEditData({})
    };

    return (
        <React.Fragment>
            <Dialog open={onOpen} onClose={handleClose}>
                <DialogTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    Edit Position
                    <IconButton size="small" sx={{ color: "gray" }} onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <DialogContentText mb={2}>
                        <Box display="flex" justifyContent="space-between" width="100%">
                            {/* Left column */}
                            <Box display="flex" flexDirection="column" gap={1}>
                                <Typography variant="body2" color="gray">
                                    Symbol: {editData.symbol}
                                </Typography>
                                <Typography variant="body2" color="gray">
                                    Position Id: {editData.positionId || editData.order_id}
                                </Typography>
                            </Box>

                            {/* Right column */}
                            <Box display="flex" flexDirection="column" gap={1} textAlign="right">
                                <Typography variant="body2" color="gray">
                                    Volume: {editData.volume}
                                </Typography>
                                <Typography variant="body2" color="gray">
                                    Type: {editData.type}
                                </Typography>
                            </Box>
                        </Box>
                    </DialogContentText>

                    <form onSubmit={handleSubmit} id="subscription-form">
                        <Typography variant="body2" color="gray" >
                            Take Profit
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <TextField
                                name='tp'
                                type="number"
                                value={tP}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setTP(val === "" ? "" : Number(val));
                                }}
                                fullWidth
                                size="small"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">Price</InputAdornment>,
                                    sx: { color: "white" },
                                }}
                                sx={{
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
                            <Button variant="outlined" onClick={() => setTP(prev => (typeof prev === "number" ? Number((prev + 0.1).toFixed(3)) : 1))} sx={{ color: "gray", borderColor: "gray" }}>
                                +
                            </Button>
                            <Button variant="outlined" onClick={() => setTP(prev => (typeof prev === "number" && prev > 0 ? Number((prev - 0.1).toFixed(3)) : 0))} sx={{ color: "gray", borderColor: "gray" }}>
                                -
                            </Button>
                        </Box>
                        <Typography variant="body2" color="gray" >
                            Stop Loss
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <TextField
                                name='sl'
                                type="number"
                                value={sl}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSl(val === "" ? "" : Number(val));
                                }}
                                fullWidth

                                size="small"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">Limit</InputAdornment>,
                                    sx: { color: "white" },
                                }}
                                sx={{
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
                            <Button variant="outlined" onClick={() => setSl(prev => (typeof prev === "number" ? Number((prev + 0.1).toFixed(3)) : 1))} sx={{ color: "gray", borderColor: "gray" }}>
                                +
                            </Button>
                            <Button variant="outlined" onClick={() => setSl(prev => (typeof prev === "number" && prev > 0 ? Number((prev - 0.1).toFixed(3)) : 0))} sx={{ color: "gray", borderColor: "gray" }}>
                                -
                            </Button>
                        </Box>
                        {activeTab === "pending" && <><Typography variant="body2" color="gray" >
                            Open Price
                        </Typography>
                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                <TextField
                                    name='openPrice'
                                    type="number"
                                    value={openPrice}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setOpenPrice(val === "" ? "" : Number(val));
                                    }}
                                    fullWidth

                                    size="small"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">Price</InputAdornment>,
                                        sx: { color: "white" },
                                    }}
                                    sx={{
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
                                <Button variant="outlined" onClick={() => setOpenPrice(prev => (typeof prev === "number" ? Number((prev + 0.1).toFixed(3)) : 1))} sx={{ color: "gray", borderColor: "gray" }}>
                                    +
                                </Button>
                                <Button variant="outlined" onClick={() => setOpenPrice(prev => (typeof prev === "number" && prev > 0 ? Number((prev - 0.1).toFixed(3)) : 0))} sx={{ color: "gray", borderColor: "gray" }}>
                                    -
                                </Button>
                            </Box></>}
                    </form>
                </DialogContent>
                <DialogActions p={2}>
                    <Button onClick={handleReset} variant='outlined' fullWidth>Reset</Button>
                    <Button type="submit" form="subscription-form" variant='contained' fullWidth>
                        Modify
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
