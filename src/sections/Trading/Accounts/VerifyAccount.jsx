import React, { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Grid, IconButton, Typography, TextField, Alert } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close"
import { useSelector, useDispatch } from "react-redux"
import { SENT_OTP_API, VERIFY_OTP_API, GET_USER_PROFILE_API } from '../../../API/ApiServices';
import { showSnackbar } from '../../../redux/snackbarslice';
import { Divider, Stack, Avatar } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { loginAction } from '../../../redux/authSlice';



export default function VerifyAccountDialog({ onOpen, onClose, type = 'balance' }) {

    const dispatch = useDispatch()
    const isLoggedIn = useSelector(state => state.auth)
    console.log("isLoggedIn", isLoggedIn)
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [error, setError] = useState(true);
    const inputsRef = useRef([]);
    const [pageIndex, setPageIndex] = useState(0);


    const handleSubmit = async () => {
        try {
            setPageIndex(1)
            if (!isLoggedIn?.data?.data?.isEmailVerified) {
                const res = await SENT_OTP_API()
                if (res.status === 200) {
                    dispatch(showSnackbar({ message: res.data.result, severity: 'success', backgroundColor: 'grey.800' }))
                }
            } else if (isLoggedIn?.data?.data?.isEmailVerified) {
                setPageIndex(3)
            }

        } catch (error) {
            dispatch(showSnackbar({ message: error, severity: 'error', backgroundColor: 'grey.800' }))
            console.log(error)
        }
    };

    const handleChange = (e, index) => {

        const value = e.target.value;
        if (!/^\d*$/.test(value)) return; // Allow only digits
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input
        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }

        // If all digits are filled, call the verify API
        if (newOtp.every((digit) => digit !== '')) {
            const fullOtp = newOtp.join('');
            verifyOtp(fullOtp);
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };


    const verifyOtp = async (otp) => {
        try {
            const payload = {
                "event": "verify-otp",
                "data": {
                    "otp": otp
                }
            }
            const res = await VERIFY_OTP_API(payload)
            console.log("otp res", res)
            if (res.status === 200) {
                setOtp(Array(6).fill(''));
                dispatch(showSnackbar({ message: res.data.result.msg, severity: 'success', backgroundColor: 'grey.800' }))
                const resUser = await GET_USER_PROFILE_API()
                console.log("res user", resUser)
                dispatch(loginAction({
                    isLoggedIn: true,
                    data: {
                        ...isLoggedIn.data, // keep access_token, refresh_token, client_MT5_id, etc.
                        data: {
                            ...isLoggedIn.data.data, // spread nested user fields
                            isEmailVerified: resUser.data.result.isEmailVerified, // update this only
                        }
                    }
                }));
                setPageIndex(2)
            }
        } catch (error) {
            dispatch(showSnackbar({ message: error, severity: 'error', backgroundColor: 'grey.800' }))
            console.log(error)
        }
    }

    const handleClose = () => {
        setPageIndex(0)
        onClose(false);
    };

    const steps = [
        {
            icon: <EmailIcon color="primary" />,
            title: 'Confirm email address',
            subtitle: isLoggedIn?.data?.data?.email,
            verified: isLoggedIn?.data?.data?.isEmailVerified,
        },
        {
            icon: <AccountCircleIcon color="primary" />,
            title: 'Add profile information',
            subtitle: 'Get a more tailored experience',
            verified: isLoggedIn?.data?.data?.isProfileVerified,
        },
        {
            icon: <PhoneAndroidIcon color="primary" />,
            title: 'Confirm phone number',
            subtitle: 'Make your account more secure',
            verified: isLoggedIn?.data?.data?.isMobileVerified,
        },
    ];

    const renderPage = () => {
        switch (pageIndex) {
            case 0: return (
                <Box
                    sx={{
                        borderRadius: 2,
                        p: 2,
                        backgroundColor: '#fff',
                    }}
                >
                    {steps.map((step, index) => (
                        <React.Fragment key={index}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: 'transparent' }}>{step.icon}</Avatar>

                                <Box>
                                    <Typography
                                        variant="subtitle1"
                                        color={step.verified ? 'textPrimary' : 'textDisabled'}
                                        fontWeight={600}
                                    >
                                        {step.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color={step.verified ? 'textPrimary' : 'textDisabled'}
                                    >
                                        {step.subtitle}
                                    </Typography>
                                </Box>

                                {/* Spacer to push verified to the right */}
                                <Box sx={{ flexGrow: 1 }} />

                                {/* Verified section aligned to right */}
                                {step.verified && <Box display="flex" alignItems="center" gap={0.5}>
                                    <Typography
                                        variant="caption"
                                        color={step.verified ? 'textPrimary' : 'textDisabled'}
                                    >
                                        Verified
                                    </Typography>
                                    <TaskAltIcon color="success" fontSize="small" />
                                </Box>}
                            </Stack>

                            {index < steps.length - 1 && <Divider sx={{ my: 2 }} />}
                        </React.Fragment>
                    ))}
                </Box>
            )
            case 1: return (
                <Box
                    sx={{
                        maxWidth: 400,
                        color: 'black',
                        borderRadius: 2,
                        backgroundColor: '#fff'
                    }}
                >
                    <Typography variant="h6" fontWeight={600} mb={1}>
                        We’ve sent you an email with a verification code.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        It’s valid for 30 minutes.
                    </Typography>
                    <Typography variant="body2" mb={3}>
                        Enter the code we sent to: <strong>{isLoggedIn?.data?.data?.email}</strong>
                    </Typography>

                    <Stack direction="row" spacing={1} justifyContent="space-between" mb={2}>
                        {otp.map((digit, index) => (
                            <TextField
                                key={index}
                                inputRef={(el) => (inputsRef.current[index] = el)}
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                inputProps={{
                                    maxLength: 1,
                                    style: {
                                        textAlign: 'center',
                                        fontSize: '1.5rem',
                                        width: '3rem',
                                        color: 'black',
                                        height: '1.5rem',
                                    },
                                }}
                            />
                        ))}
                    </Stack>

                    {/* {error && (
                <Alert severity="error" variant="outlined">
                    Incorrect code. Please try again.
                </Alert>
            )} */}
                </Box>
            )
            case 2: return (<Box
                sx={{
                    maxWidth: 400, 
                    color: 'black',
                    borderRadius: 2,
                    backgroundColor: '#fff'
                }}
            >
                <Typography variant="h6" fontWeight={600} mb={1}>
                    Add profile information
                </Typography>

            </Box>)
            case 3: return (<Box
                sx={{
                    maxWidth: 400,
                    p: 4,
                    color: 'black',
                    borderRadius: 2,
                    backgroundColor: '#fff'
                }}
            >
                <Typography variant="h6" fontWeight={600} mb={1}>
                    We’ve sent you an email with a verification code.
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                    It’s valid for 30 minutes.
                </Typography>
                <Typography variant="body2" mb={3}>
                    Enter the code we sent to: <strong>{isLoggedIn?.data?.data?.email}</strong>
                </Typography>

                <Stack direction="row" spacing={1} justifyContent="space-between" mb={2}>
                    {otp.map((digit, index) => (
                        <TextField
                            key={index}
                            inputRef={(el) => (inputsRef.current[index] = el)}
                            value={digit}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            inputProps={{
                                maxLength: 1,
                                style: {
                                    textAlign: 'center',
                                    fontSize: '1.5rem',
                                    width: '3rem',
                                    color: 'black',
                                    height: '1.5rem',
                                },
                            }}
                        />
                    ))}
                </Stack>

                {/* {error && (
                <Alert severity="error" variant="outlined">
                    Incorrect code. Please try again.
                </Alert>
            )} */}
            </Box>)
            default: return null;
        }
    }


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
                    Verify your contact details
                </Typography>

                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>


            <DialogContent >
                <Typography variant="caption" sx={{ mb: 2 }}>
                    This process take less than 5 minutes
                </Typography>

                {renderPage()}

            </DialogContent>

            {(pageIndex === 0 || pageIndex === 2) && <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={handleClose}
                    variant="contained"

                    sx={{
                        backgroundColor: '#FFE535',
                        color: 'black',
                        textTransform: 'none',

                        '&:hover': {
                            backgroundColor: '#ffdb2a',
                        },
                    }}
                >
                    Do it later
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                        backgroundColor: '#FFE535',
                        color: 'black',
                        textTransform: 'none',

                        '&:hover': {
                            backgroundColor: '#ffdb2a',
                        },
                    }}
                >
                    Get Started now
                </Button>
            </DialogActions>}
        </Dialog>
    );
}
