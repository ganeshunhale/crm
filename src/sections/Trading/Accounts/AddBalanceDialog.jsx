import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Grid, IconButton, InputAdornment, Typography, TextField } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close"
import { useSelector, useDispatch } from "react-redux"
import { Label } from '@mui/icons-material';
import { ADD_DEMO_BALANCE } from '../../../API/ApiServices';
import { showSnackbar } from '../../../redux/snackbarslice';
import { fetchAccountDemoDetails } from '../../../redux/authSlice';

export default function AddBalanceDialog({ onOpen, onClose, type = 'balance', activeTab, accData }) {

    console.log("accData", accData)
    const dispatch = useDispatch()
    const [balance, setBalance] = useState(accData.balance || null)
    const [password, setPassword] = useState('');

    const handleSubmit = async () => {
        const payload = {
            "event": "symbol_sentiments",
            "data": {
                "clientId": accData.accountId,
                "amount": balance
            }
        }
        try {
            if (balance === null) return
            const res = await ADD_DEMO_BALANCE(payload)
            if (res.status === 200) {
                dispatch(fetchAccountDemoDetails());
                dispatch(showSnackbar({ message: 'balance added success', severity: 'success', backgroundColor: 'grey.800' }))
                handleClose(true)
                setBalance(null)
            }
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        if (type === 'balance' && accData?.balance !== undefined) {
            setBalance(accData.balance);
        }
    }, [accData, type]);


    const handleClose = () => {
        onClose(false);
    };

    return (
        <Dialog
            open={onOpen}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    width: 500,
                    maxWidth: '90%',
                    backgroundColor: '#ffffff',
                    borderRadius: 2,
                    color: "black"
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pb: 0,
                }}
            >
                <Typography variant="h6" fontWeight="bold">
                    {type === 'balance' ? `Set Balance for ${activeTab === "demo" ? " Demo Account" : " Real Account"}` : 'Change Trading Password'}
                </Typography>
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                {type === 'balance' ? (
                    <>
                        <Typography variant="subtitle1" mb={2}>
                            Account ID: {accData.accountId || 'N/A'}
                        </Typography>
                        <TextField
                            fullWidth
                            size='small'
                            label="Set Balance"
                            variant="outlined"
                            type='number'
                            placeholder="Enter amount"
                            value={balance ?? ''}
                            onChange={(e) => setBalance(e.target.value)}
                        />
                    </>
                ) : (
                    <>
                        <Typography mb={2}>New Password</Typography>
                        <TextField
                            fullWidth
                            size='small'
                            label="New Password"
                            variant="outlined"
                            type='password'
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </>
                )}

               
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    fullWidth
                    sx={{
                        backgroundColor: '#FFE535',
                        color: 'black',
                        textTransform: 'none',
                        boxShadow: 'none',

                        '&:hover': {
                            backgroundColor: '#ffdb2a',
                            boxShadow: 'none',
                        },
                    }}
                >
                    {type === "balance" ? "Set Balance" : "Change password"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
