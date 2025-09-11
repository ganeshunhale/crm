import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Grid, IconButton, InputAdornment, List, ListItem, ListItemText, Typography } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close"
import { EDIT_OPEN_ORDER, EDIT_PENDING_ORDER } from '../../API/ApiServices';
import { useSelector } from "react-redux"

export default function DepositDialog({ onOpen, onClose }) {


    const isLoggedIn = useSelector(state => state.auth)
    const demo_id = isLoggedIn.data.client_MT5_id.demo_id

    const handleSubmit = async () => {
        window.location.href = '/dashboard/lay-out'


    };

    const handleReset = () => {

    }

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
                    <DialogContentText mb={2}>
                        <Grid container spacing={2}>
                            {/* Left */}
                            <Grid item xs={6}>
                                <Typography variant="h6" align='left'>Demo</Typography>
                                <List>
                                    <ListItem sx={{ py: 0 }}>
                                        <ListItemText primary="Virtual money" />
                                    </ListItem>
                                    <ListItem sx={{ py: 0 }}>
                                        <ListItemText primary="Full access to the terminal" />
                                    </ListItem>
                                    <ListItem sx={{ py: 0 }}>
                                        <ListItemText primary="No withdrawels" color='error.main' />
                                    </ListItem>
                                </List>
                            </Grid>

                            {/* Right */}
                            <Grid item xs={6}>
                                <Typography variant="h6" align="left">
                                    Real
                                </Typography>
                                <List>
                                    <ListItem sx={{ py: 0 }}>
                                        <ListItemText primary="Full access to the terminal" />
                                    </ListItem>
                                    <ListItem sx={{ py: 0 }}>
                                        <ListItemText primary="instant,automated withdrawels" />
                                    </ListItem>
                                </List>
                            </Grid>
                        </Grid>
                    </DialogContentText>



                </DialogContent>
                <DialogActions p={2}>
                    <Button onClick={handleSubmit} sx={{ background: '#FFE535', color: 'black' }} variant='contained' fullWidth>
                        Deposit on real account
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
