import React, { useState } from "react";
import {
    Box,
    Grid,
    Card,
    Typography,
    Button,
    FormControlLabel,
    Switch,
    Alert,
} from "@mui/material";

import { FormikProvider, useFormik, Form } from "formik";
import { GET_CLIENT_DETAILS_API, LOGIN_USER_API, SET_ACTIVE_ACCOUT } from "../../API/ApiServices";
import { loginAction, updateActiveId } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "../../validations";
import { Link } from "react-router-dom";
import AuthNavbar from "../../components/AuthNavbar";
import FormTextField from "../../components/Inputs/FormTextField";
import FormPasswordField from "../../components/Inputs/FormPasswordField";

// Optional: Replace with your own image
const bgImage = "https://static.vecteezy.com/system/resources/thumbnails/042/538/438/small_2x/stock-market-price-for-investment-and-digital-trading-animation-free-video.jpg"; // <-- Replace this

function LoginPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [showError, setShowError] = useState({});

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: loginSchema,
        onSubmit: async (values) => {
            try {
                const payload = {
                    event: 'login',
                    data: {
                        ...values
                    }
                }
                setLoading(true)
                const userLogin = await LOGIN_USER_API(payload)

                if (userLogin.status == 200 && userLogin.data.status == 'success') {
                    const clientDetails = await GET_CLIENT_DETAILS_API(userLogin.data.result)
                    setLoading(false)
                    dispatch(loginAction({
                        data: { ...userLogin.data?.result, client_MT5_id: clientDetails.data.result },
                        isLoggedIn: true
                    }));
                    if (userLogin.data.result.data.active_id === "" || userLogin.data.result.data.active_id === null) {
                        await SET_ACTIVE_ACCOUT(userLogin?.data?.result?.data?.accounts?.demo_ids[0])
                        dispatch(updateActiveId(userLogin?.data?.result?.data?.accounts?.demo_ids[0]));
                    }
                    navigate("/dashboard")
                }

            } catch (error) {
                setShowError(error?.response?.data)
                console.log("Error creating account:", error)
            } finally {
                setLoading(false)
            }
        }
    })
    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
            {/* Hero section with background image */}
            <AuthNavbar />
            <Box
                sx={{
                    height: "35vh",
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "0 0 16px 16px",
                }}
            />
            {/* Registration Card */}
            <Grid container justifyContent="center" sx={{ mt: -12, overflow: "visible" }}>
                <Grid item xs={12} sm={8} md={4} lg={3}>
                    <Box sx={{ position: "relative", overflow: "visible" }}>
                        <Card
                            sx={{
                                p: 5,
                                backgroundColor: "#f0f2f5",
                                width: "100%",
                                maxWidth: 700, // sets max size for large screens
                                mx: "auto",
                                borderRadius: '12px'
                            }}
                        >
                            {/* Header */}
                            <Box
                                textAlign="center"
                                sx={{
                                    width: { xs: '80%', sm: '90%' },
                                    position: "absolute",
                                    top: -30,
                                    zIndex: 98,
                                    mb: 2,
                                    background: "linear-gradient(90deg, #2196F3 0%, #42A5F5 100%)", // Blue gradient
                                    px: 3,
                                    py: 4,
                                    borderRadius: 2,
                                    boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
                                    display: "inline-block",
                                }}
                            >
                                <Typography variant="h5" fontWeight="bold" color="white">
                                    Sign In
                                </Typography>
                            </Box>

                            {/* Form */}
                            <FormikProvider value={formik}>
                                <Box component="form" onSubmit={formik.handleSubmit} autoComplete="on" noValidate sx={{ maxWidth: 600, mx: "auto", marginTop: '60px' }}>
                                    <Grid container spacing={2} >
                                        <Grid size={{ xs: 12, md: 12 }}>
                                             <FormTextField name="email" label="Email" type="email" />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 12 }}>
                                             <FormPasswordField name="password" label="Password" />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 12 }}>
                                            <FormControlLabel
                                                control={<Switch color="primary" size="medium" />}
                                                label={
                                                    <Typography variant="caption" color="textPrimary">
                                                        Remember Me
                                                    </Typography>
                                                }
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 12 }}>
                                            <Button
                                                variant="contained"
                                                type="submit"
                                                color="info"
                                                loading={loading}
                                                fullWidth
                                                sx={{ mt: 1, mb: 2, width: '100%' }}
                                            >
                                                Sign In
                                            </Button>
                                        </Grid>
                                        {showError?.errorcode && <Grid size={{ xs: 12, md: 12 }}>
                                            <Alert variant="outlined" severity="error">
                                                {showError.reason}
                                            </Alert>
                                        </Grid>}

                                        {/* Sign-in link */}
                                        <Grid size={{ xs: 12, md: 12 }}>
                                            <Box textAlign="center">
                                                <Typography variant="caption">
                                                    Don't have an account?
                                                    <Link to="/sign-up">
                                                        <Typography
                                                            variant="caption"
                                                            color="primary"
                                                            fontWeight="bold"
                                                            sx={{
                                                                textDecoration: "none", ml: 0.5, ":hover": {
                                                                    color: "info.main",
                                                                }
                                                            }}
                                                        >
                                                            Sign Up
                                                        </Typography>
                                                    </Link>
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </FormikProvider>
                        </Card>
                    </Box>
                </Grid>
            </Grid>
            {/* Footer */}
            <Box mt={8} textAlign="center" pb={2} bottom={0}>
                <Typography variant="caption" color="textSecondary">
                    &copy; {new Date().getFullYear()} CFDUP. All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
}
export default LoginPage;
