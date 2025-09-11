import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Grid, IconButton, InputAdornment, List, ListItem, ListItemText, Typography, TextField } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close"
import { useSelector,useDispatch } from "react-redux"
import { Label } from '@mui/icons-material';
import { ADD_DEMO_BALANCE } from '../../../API/ApiServices';
import { showSnackbar } from '../../../redux/snackbarslice';

export default function AddBalanceDialog({ onOpen, onClose }) {

    const dispatch = useDispatch()
    const isLoggedIn = useSelector(state => state.auth)
    const demo_id = isLoggedIn.data.client_MT5_id.demo_id
    const [balance, setBalance] = useState(null)

    const handleSubmit = async () => {
        const payload = {
            "event": "symbol_sentiments",
            "data": {
                "clientId": demo_id,
                "amount": balance
            }
        }
        try{
            if(balance === null) return
            const res = await ADD_DEMO_BALANCE(payload)
            console.log("response in api",res)
            if(res.status === 200){
               dispatch(showSnackbar({message:'balance added success',severity:'success'}))
               handleClose(true)
               setBalance(null)
            }
          
        }catch(error){
            console.log(error)
        }
    };

    const handleReset = () => {
    }

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
                    Set Balance for Demo Account
                </Typography>
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                <Typography variant="subtitle1">
                    Account: {demo_id || 'N/A'}
                </Typography>
                <Typography mb={2}>amount</Typography>
                <TextField
                    fullWidth
                    size='small'
                    id="Set balance"
                    label="Set Balance"
                    variant="outlined"
                    type='number'
                    placeholder="Enter amount"
                    onChange={(e) => setBalance(e.target.value)}

                />
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

                        '&:hover': {
                            backgroundColor: '#ffdb2a',
                        },
                    }}
                >
                    Set Balance
                </Button>
            </DialogActions>
        </Dialog>
    );
}
