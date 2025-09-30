import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Card,
    Typography,
    TextField,
    Checkbox,
    Button,
    Alert,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
    IconButton,
    FormHelperText,
} from "@mui/material";

import { FormikProvider, useFormik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import { GET_CITY_CODE_API, GET_COUNTRY_CODE_API, GET_STATES_CODE_API, REGISTER_MT5_USER_API, REGISTER_USER_API } from "../../API/ApiServices";
import { updateActiveId } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import { registerSchema } from "../../validations";
import { Link } from "react-router-dom";
import AuthNavbar from "../../components/AuthNavbar";
import FormTextField from "../../components/Inputs/FormTextField";
// Optional: Replace with your own image
const bgImage = "https://static.vecteezy.com/system/resources/thumbnails/042/538/438/small_2x/stock-market-price-for-investment-and-digital-trading-animation-free-video.jpg"; // <-- Replace this

function RegisterPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [countries, setCountries] = useState([])
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [showError, setShowError] = useState({});
    const formik = useFormik({
        initialValues: {
            first_name: '',
            last_name: '',
            email: '',
            phone_no: '',
            country: null,
            state: "",
            city: "",
            address: "",
            password: '',
            confirm_password: "",
            terms: false,
        },
        validationSchema: registerSchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true)
                const selectedState = states.find(s => s.iso2 === formik.values.state)?.name;
                values.phone_no = values.country.phonecode + values.phone_no?.toString() || "";
                values.country = values.country.name
                values.state = selectedState
                const { terms, ...data } = values;
                const payload = { event: "register", data: data }
                const Registration = await REGISTER_USER_API(payload)

                if (Registration.status === 201 && Registration.data.status === "success") {
                    let newPayload = {
                        event: "demoAccount",
                        data: {
                            user_id: Number(Registration.data.result.user_id),
                            ...values,
                        },
                    }
                    const res = await REGISTER_MT5_USER_API(newPayload)
                    if (res.status === 200) {
                        dispatch(updateActiveId(res.data.result));
                        formik.resetForm()
                    }
                    navigate("/sign-in")
                    setIsLoading(false)
                }
            } catch (error) {
                setShowError(error.response.data)
            } finally {
                setIsLoading(false)
            }
        }
    })

    const getAllCountries = async () => {
        try {
            const res = await GET_COUNTRY_CODE_API()
            setCountries(res)
        } catch (error) {
            console.log("Error", error)
        }
    }
    const getAllStates = async () => {
        try {
            if (formik.values.country.iso2) {
                const res = await GET_STATES_CODE_API(formik.values.country.iso2)
                setStates(res)
            }
        } catch (error) {
            console.log("Error", error)
        }
    }

    const getAllCities = async () => {
        try {
            if (formik.values.country.iso2, formik.values.state) {
                const res = await GET_CITY_CODE_API(formik.values.country.iso2, formik.values.state)
                console.log("res", res)
                setCities(Array.isArray(res) ? res : [])
            }
        } catch (error) {
            console.log("Error", error)
            setCities([])
        }
    }

    useEffect(() => {
        getAllCountries()
    }, [])
    useEffect(() => {
        getAllStates()
    }, [formik.values.country])
    useEffect(() => {
        getAllCities()
    }, [formik.values.country, formik.values.state])

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
                                    zIndex: 97,
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
                                    Join us today
                                </Typography>
                            </Box>

                            {/* Form */}
                            <FormikProvider value={formik}>
                                <Box component="form" onSubmit={formik.handleSubmit} noValidate autoComplete="off" sx={{ maxWidth: 600, mx: "auto", marginTop: '60px' }}>
                                    <Grid container spacing={2} >
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <FormTextField name="first_name" label="First name" />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }} >
                                            <FormTextField name="last_name" label="Last name" />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 12 }}>
                                            <FormTextField name="email" label="Email address" type="email" />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <FormControl variant="standard" sx={{ width: '100%' }} error={formik.touched.country && Boolean(formik.errors.country)}>
                                                <InputLabel id="country-label">Country</InputLabel>
                                                <Select
                                                    labelId="country-label"
                                                    id="country"
                                                    name="country"
                                                    value={formik.values.country?.iso2 || ""} // show iso2 for matching
                                                    onChange={(e) => {
                                                        const selectedIso2 = e.target.value;
                                                        const selectedCountry = countries.find((c) => c.iso2 === selectedIso2);
                                                        formik.setFieldValue("country", selectedCountry || null);
                                                    }}
                                                    onBlur={formik.handleBlur}
                                                    renderValue={(selected) => {
                                                        const country = countries.find((c) => c.iso2 === selected);
                                                        return country ? country.name : "";
                                                    }}
                                                >
                                                    {countries?.map((data) => (
                                                        <MenuItem key={data.id} value={data.iso2}>
                                                            {data.name}
                                                        </MenuItem>
                                                    ))}

                                                </Select>
                                                {formik.touched.country && formik.errors.country && (
                                                    <FormHelperText>{formik.errors.country}</FormHelperText>
                                                )}
                                            </FormControl>


                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <FormControl variant="standard" sx={{ width: '100%' }} error={formik.touched.state && Boolean(formik.errors.state)}>
                                                <InputLabel id="demo-simple-select-standard-label">State</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-standard-label"
                                                    id="demo-simple-select-standard"
                                                    value={formik.values.state}
                                                    label="State"
                                                    name="state"
                                                    disabled={!states.length}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}

                                                >
                                                    {states?.map((data) => (
                                                        <MenuItem key={data.id} value={data.iso2}>{data.name}</MenuItem>
                                                    ))}
                                                </Select>
                                                {formik.touched.state && formik.errors.state && (
                                                    <FormHelperText>{formik.errors.state}</FormHelperText>
                                                )}
                                            </FormControl>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <FormControl variant="standard" sx={{ width: '100%' }} error={formik.touched.city && Boolean(formik.errors.city)}>
                                                <InputLabel id="demo-simple-select-standard-label">City</InputLabel>
                                                <Select
                                                    labelId="city-label"
                                                    id="city"
                                                    name="city"
                                                    value={formik.values.city}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    disabled={!cities.length}
                                                >
                                                    {cities?.map((data) => (
                                                        <MenuItem key={data.id} value={data.name}>
                                                            {data.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {formik.touched.city && formik.errors.city && (
                                                    <FormHelperText>{formik.errors.city}</FormHelperText>
                                                )}
                                            </FormControl>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <TextField
                                                label="Phone number"
                                                variant="standard"
                                                type="number"
                                                fullWidth
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <IconButton edge="start" size="small">
                                                                +{formik.values?.country?.phonecode || '00'}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                name="phone_no"
                                                value={formik.values.phone_no}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.phone_no && Boolean(formik.errors.phone_no)}
                                                helperText={formik.touched.phone_no && formik.errors.phone_no}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 12 }}>
                                            <TextField
                                                label="Address"
                                                variant="standard"
                                                fullWidth
                                                multiline
                                                maxRows={3}
                                                name="address"
                                                value={formik.values.address}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                error={formik.touched.address && Boolean(formik.errors.address)}
                                                helperText={formik.touched.address && formik.errors.address}

                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <FormTextField name="password" label="Password" type="password" />
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <FormTextField name="confirm_password" label="Confirm password" type="password" />
                                        </Grid>

                                        <Grid size={{ xs: 12, md: 12 }}>
                                            <Grid size={{ xs: 12, md: 12 }}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            name="terms"
                                                            color="primary"
                                                            size="small"
                                                            checked={formik.values.terms}
                                                            onChange={formik.handleChange}
                                                        />
                                                    }
                                                    label={
                                                        <Typography variant="caption">
                                                            I agree to the{" "}
                                                            <Typography
                                                                variant="caption"
                                                                href="#"
                                                                color="info"
                                                                // fontWeight="bold"
                                                                sx={{ textDecoration: "none" }}
                                                            >
                                                                Terms and Conditions
                                                            </Typography>
                                                        </Typography>
                                                    }
                                                />
                                            </Grid>
                                            {formik.touched.terms && formik.errors.terms && (
                                                <Typography color="error" variant="caption">
                                                    {formik.errors.terms}
                                                </Typography>
                                            )}

                                        </Grid>


                                        <Grid size={{ xs: 12, md: 12 }}>
                                            <Button
                                                variant="contained"
                                                color="info"
                                                type="submit"
                                                loading={isLoading}
                                                fullWidth
                                                sx={{ mt: 1, mb: 2, width: '100%' }}
                                            >
                                                Sign Up
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
                                                    Already have an account?
                                                    <Link to="/sign-in">
                                                        <Typography
                                                            variant="caption"
                                                            color="primary"
                                                            fontWeight="bold"
                                                            sx={{ textDecoration: "none", ml: 0.5 }}
                                                        >
                                                            Sign In
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
            <Box mt={8} textAlign="center" pb={2}>
                <Typography variant="caption" color="textSecondary">
                    &copy; {new Date().getFullYear()} CFDUP. All rights reserved.
                </Typography>
            </Box>
        </Box>
    )
}
export default RegisterPage;
