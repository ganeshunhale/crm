import React, { useState } from 'react';
import {
    Grid, TextField, Button, Box, Typography,
    useTheme, useMediaQuery, Tabs, Tab,
    FormControl, Select, MenuItem, Stack,Container
} from '@mui/material';
import { useFormik } from 'formik';
import {
    GET_CLIENT_DETAILS_API,
    REGISTER_MT5_LIVE_ACCOUNT_API,
    REGISTER_MT5_USER_API
} from '../../../API/ApiServices';
import { useSelector, useDispatch } from 'react-redux';
import { loginAction } from '../../../redux/authSlice';
import { showSnackbar } from '../../../redux/snackbarslice';
import { useNavigate } from 'react-router-dom';
import { CURRENCIES, MAXLEVERAGE } from '../../../contants';
import { userSchema } from '../../../validations';

const ITEM_HEIGHT = 68;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const UserProfileForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const isLoggedIn = useSelector((state) => state.auth);
    const [selectedTab, setSelectedTab] = useState('demo');

    const tabs = [
        { label: 'Demo', value: 'demo' },
        { label: 'Real', value: 'real' },
    ];

    const formik = useFormik({
        initialValues: {
            nickname: '',
            leverage: '100',
            startBal: '',
            password: '',
            currency: 'USD',
        },
        validationSchema: userSchema,
        onSubmit: async (values) => {
            try {
                let res;
                const payload =
                    selectedTab === 'real'
                        ? {
                            event: 'liveAccount',
                            data: {
                                nickname: values.nickname,
                                password: values.password,
                                leverage: Number(values.leverage),
                            },
                        }
                        : {
                            event: 'demoAccount',
                            data: {
                                nickname: values.nickname,
                                password: values.password,
                                leverage: Number(values.leverage),
                                startBal: Number(values.startBal),

                            },
                        };

                res =
                    selectedTab === 'real'
                        ? await REGISTER_MT5_LIVE_ACCOUNT_API(payload)
                        : await REGISTER_MT5_USER_API(payload);
                if (res.status === 200) {
                    dispatch(
                        showSnackbar({
                            message: res.data.reason || res.data.result,
                            severity: 'success',
                            backgroundColor: 'grey.800',
                        })
                    );
                    const clientDetails = await GET_CLIENT_DETAILS_API(isLoggedIn.data);
                    dispatch(
                        loginAction({
                            data: {
                                ...isLoggedIn.data,
                                client_MT5_id: {
                                    ...clientDetails.data.result,
                                },
                            },
                            isLoggedIn: true,
                        })
                    );
                    navigate('/dashboard/lay-out/accounts');
                }
            } catch (error) {
                console.error('Error creating account:', error);
            }
        },
    });

    return (
         <Container maxWidth="lg">
        <Box sx={{ width: {xs:'100%', md: '50%', xl: '50%', },pt:4 }}>
            <form onSubmit={formik.handleSubmit}>
                <Grid container direction="column" gap={2}>
                    <Grid item xs={12}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Set up your account
                        </Typography>
                    </Grid>

                    <Grid item xs={12} mb={2}>
                        <Tabs
                            value={selectedTab}
                            onChange={(_, val) => {
                                setSelectedTab(val);
                            }}
                            variant="fullWidth"
                            sx={{
                                minHeight: 50,
                                borderRadius: "8px",
                                padding: 0.5,
                                backgroundColor: '#f9f9f9',
                                border: '1px solid rgba(0, 0, 0, 0.12)',
                                '.MuiTabs-indicator': { display: 'none' },
                                '.MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    color: 'black',
                                    borderRadius: '6px',

                                },
                                '.Mui-selected': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.12)',

                                },
                            }}
                        >
                            {tabs.map((tab) => (
                                <Tab key={tab.value} value={tab.value} label={tab.label} />
                            ))}
                        </Tabs>
                        <Typography variant="caption">
                            Trade with real money and withdraw any profit you may make
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="caption">Currency</Typography>
                        <FormControl size="small" fullWidth>
                            <Select
                                name="currency"
                                value={formik.values.currency}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                MenuProps={MenuProps}
                                error={formik.touched.currency && Boolean(formik.errors.currency)}
                            >
                                {CURRENCIES.map((cur) => (
                                    <MenuItem key={cur.code} value={cur.code}>
                                        {cur.code} - {cur.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {selectedTab === 'demo' && (
                        <Grid item xs={12} md={6}>
                            <Typography variant="caption">Starting balance</Typography>
                            <TextField
                                fullWidth
                                size="small"
                                name="startBal"
                                value={formik.values.startBal}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.startBal && Boolean(formik.errors.startBal)}
                                helperText={formik.touched.startBal && formik.errors.startBal}
                            />
                        </Grid>
                    )}

                    <Grid item xs={12} md={6}>
                        <Typography variant="caption">Nick Name</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            name="nickname"
                            value={formik.values.nickname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.nickname && Boolean(formik.errors.nickname)}
                            helperText={formik.touched.nickname && formik.errors.nickname}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="caption">Max Leverage</Typography>
                        <FormControl size="small" fullWidth>
                            <Select
                                name="leverage"
                                value={formik.values.leverage}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                MenuProps={MenuProps}
                                error={formik.touched.leverage && Boolean(formik.errors.leverage)}
                            >
                                {MAXLEVERAGE.map((lev) => (
                                    <MenuItem key={lev.value} value={lev.value}>
                                        {lev.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="caption">Platform</Typography>
                        <FormControl size="small" fullWidth>
                            <Select value="MT5" disabled>
                                <MenuItem value="MT5">MT5</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="caption">Trading Password</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            type="password"
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                        <Stack direction="column" mt={1} color="secondary">
                            <Typography variant="caption">- Between 8-15 characters</Typography>
                            <Typography variant="caption">- At least one upper and one lower case letter</Typography>
                            <Typography variant="caption">- At least one number</Typography>
                            <Typography variant="caption">- At least one special character</Typography>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Button
                            type="submit"
                            fullWidth
                            size="small"
                            variant="contained"
                            sx={{
                                backgroundColor: '#ffde02',
                                color: 'black',
                                boxShadow: 'none',
                                py: 1,
                                fontSize: '16px',
                                textTransform: 'none',
                                '&:hover': { backgroundColor: '#ecce0bff' },
                            }}
                        >
                            Create Account
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
        </Container>
    );
};

export default UserProfileForm;
