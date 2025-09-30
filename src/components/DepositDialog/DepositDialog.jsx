import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Grid, IconButton, InputAdornment, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close"
import { ADD_DEMO_BALANCE, EDIT_OPEN_ORDER, EDIT_PENDING_ORDER, GET_ACCOUNT_DETAILS } from '../../API/ApiServices';
import { useSelector, useDispatch } from "react-redux"
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { showSnackbar } from '../../redux/snackbarslice';
import { addTradingAccountDetails } from '../../redux/tradingAccoutDetailsSLice';

export default function DepositDialog({ onOpen, onClose }) {

    const dispatch = useDispatch()
    const isLoggedIn = useSelector(state => state.auth)
    const _id = isLoggedIn?.activeId

    const handleSubmit = async () => {
        window.location.href = '/dashboard/lay-out/deposit'
    };
    const handleTopUp = async (_id) => {
        try {
            const payload = {
                "event": "symbol_sentiments",
                "data": {
                    "clientId": _id,
                    // "amount": balance
                }
            }
            const res = await ADD_DEMO_BALANCE(payload)
            console.log("deposit res", res)
            if (res.status === 200) {
                const res = await GET_ACCOUNT_DETAILS();
                dispatch(addTradingAccountDetails(res.data.result));
                dispatch(showSnackbar({ message: 'balance added success', severity: 'success', backgroundColor: 'grey.800' }))
                handleClose()
            }
        } catch (error) {
            console.log("err", error)
        }
    };

    const handleClose = () => {
        onClose(false);
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
                    Make a Deposit
                    <IconButton size="small" sx={{ color: "gray" }} onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        <Grid container >
                            {/* Left */}
                            <Grid item xs={6}>
                                <Typography variant="body1" align='left' fontWeight="bold" color='textPrimary'>Demo</Typography>
                                <List>
                                    <ListItem sx={{ py: 0 }}>
                                        <ListItemIcon sx={{ minWidth: 24 }}>
                                            <FiberManualRecordIcon sx={{ fontSize: 10 }} /> {/* Small dot */}
                                        </ListItemIcon>
                                        <ListItemText primary="Virtual money" />
                                    </ListItem>

                                    <ListItem sx={{ py: 0 }}>
                                        <ListItemIcon sx={{ minWidth: 24 }}>
                                            <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                        </ListItemIcon>
                                        <ListItemText primary="Full access to the terminal" />
                                    </ListItem>

                                    <ListItem sx={{ py: 0 }}>
                                        <ListItemIcon sx={{ minWidth: 24 }}>
                                            <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="No withdrawals"
                                            primaryTypographyProps={{ color: 'error' }}
                                        />
                                    </ListItem>
                                </List>
                            </Grid>

                            {/* Right */}
                            <Grid item xs={6}>
                                <Typography variant="body1" align='left' fontWeight="bold" color='textPrimary'>
                                    Real
                                </Typography>
                                <List>
                                    <ListItem sx={{ py: 0 }}>
                                        <ListItemIcon sx={{ minWidth: 24 }}>
                                            <FiberManualRecordIcon sx={{ fontSize: 10 }} /> {/* Small dot */}
                                        </ListItemIcon>
                                        <ListItemText primary="Full access to the terminal" />
                                    </ListItem>



                                    <ListItem sx={{ py: 0 }}>
                                        <ListItemIcon sx={{ minWidth: 24 }}>
                                            <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Instant, automated withdrawals"
                                            primaryTypographyProps={{ color: 'success' }}
                                        />
                                    </ListItem>
                                </List>
                            </Grid>
                        </Grid>
                    </DialogContentText>

                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => handleTopUp(_id)} sx={{ background: 'grey', color: '#fff', textTransform: 'none', fontWeight: 'bold' }} fullWidth variant='contained' >
                        Top up demo account
                    </Button>
                    <Button onClick={handleSubmit} sx={{ background: '#FFE535', color: 'black', textTransform: 'none', fontWeight: 'bold' }} fullWidth variant='contained' >
                        Deposit on real account
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
