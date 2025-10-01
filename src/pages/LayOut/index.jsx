import { AppBar, Button, Divider, IconButton, Menu, MenuItem, Stack, Tooltip, Typography, useTheme,useMediaQuery } from "@mui/material";
import {
    Drawer,
    Toolbar,
    Box,
} from "@mui/material";
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import Logo from "@/assets/Img/SGFX logo-DARK.svg";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import Sidebar from "./SideBar";
import VerifyAccountDialog from "../../sections/Trading/Accounts/VerifyAccount";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useSelector, useDispatch } from "react-redux";
import { fetchAccountDetails } from "../../redux/authSlice";
import Footer from "./Footer";

const LayOut = () => {

    const dispatch = useDispatch()
    const theme = useTheme();
    const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorElBalance, setAnchorElBalance] = useState(null);
    const [openCompleteProfile, setOpenComplteProfile] = useState(false)
    const navigate = useNavigate();
    const isLoggedIn = useSelector(state => state.auth);
    const settings = ['email', 'LogOut'];
    const [collapsed, setCollapsed] = useState(isMdDown);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handleOpenBalanceMenu = (event) => {
        setAnchorElBalance(event.currentTarget);
    };
    const handleCloseBalanceMenu = () => {
        setAnchorElBalance(null);
    };

    const handleNavigate = () => {
        navigate('/dashboard')
    }
    const drawerWidth = collapsed ? 60 : 260;
    const handleToggle = () => {
        setCollapsed((prev) => !prev);
    };

    const handleLogOut = useCallback(() => {
        localStorage.removeItem('persist:auth');
        window.location.href = "/";
    }, []);

    useEffect(() => {
        try {
            dispatch(fetchAccountDetails('real'))
        } catch (error) {
            console.log("err", error)
        }
    }, [])

    return (
        <>
            <VerifyAccountDialog onOpen={openCompleteProfile} onClose={setOpenComplteProfile} />
            <div style={{ display: "flex", height: "100vh" }}>
                <AppBar
                    position="fixed"
                    sx={{
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        backgroundColor: "#fff",
                        color: "black",
                        boxShadow: "0 0px 2px rgba(0,0,0,0.1)",
                        borderBottom: "1px solid rgba(0,0,0,0.1)",
                    }}
                >
                    <Toolbar sx={{ justifyContent: "space-between" }}>
                        {/* Logo on the left */}
                        <Box display="flex" alignItems="center">
                            <Box
                                component="img"
                                src={Logo}
                                onClick={handleNavigate}
                                alt="SGFX Logo"
                                sx={{ height: 60, width: "auto", mr: 1, cursor: 'pointer' }}
                            />

                        </Box>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Tooltip title="Show balance">
                                <Typography
                                    sx={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: '4px',
                                        transition: 'all 0.2s ease-in-out',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            border: '1px solid #ccc',
                                            backgroundColor: '#f5f5f5',
                                        },
                                    }}
                                    onClick={handleOpenBalanceMenu}
                                >
                                    <AccountBalanceWalletIcon
                                        sx={{
                                            color: 'CaptionText',
                                            mr: 0.5,
                                            fontSize: '20px',
                                        }}
                                    />
                                    {Object.values(isLoggedIn?.subAccounts?.[0] || {})?.[0]?.balance || 0} USD
                                </Typography>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px', width: '600px' }}
                                id="menu-appbar"
                                anchorEl={anchorElBalance}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElBalance)}
                                onClose={handleCloseBalanceMenu}
                            >
                                {isLoggedIn?.subAccounts?.map((accountObj, index) => {
                                    const accountId = Object.keys(accountObj)[0];
                                    const accData = accountObj[accountId];

                                    return (
                                        <React.Fragment key={accountId}>
                                            <MenuItem
                                                onClick={() => {
                                                    handleCloseUserMenu();
                                                    // Optional: do something with accountId or accData
                                                }}
                                            // sx={{ borderBlock: '1px' }}
                                            >


                                                <Box sx={{ width: '250px' }}>
                                                    <Stack direction="row">
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                fontWeight: 600,
                                                                color: "#ccaf0cff",
                                                                backgroundColor: "rgba(255,215,0,0.15)",
                                                                px: 1,

                                                                borderRadius: 1,
                                                                mr: 1
                                                            }}
                                                        >
                                                            Real
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: 'text.primary',
                                                                mr: 1,
                                                            }}
                                                        >
                                                            {accData.type}
                                                        </Typography>
                                                        <Typography variant="body2" >
                                                            #{accountId}
                                                        </Typography>
                                                    </Stack>
                                                    <Typography variant="body2" fontWeight="bold" mt={0.5}>
                                                        ${accData.balance} USD
                                                    </Typography>
                                                </Box>
                                            </MenuItem>

                                            {index < isLoggedIn.subAccounts.length - 1 && <Divider />}
                                        </React.Fragment>
                                    );
                                })}

                            </Menu>

                            <Box sx={{ flexGrow: 0 }}>
                                <Tooltip title="Open profile">
                                    <IconButton sx={{ p: 0 }} onClick={handleOpenUserMenu}>
                                        <AccountCircleOutlinedIcon sx={{ color: "black", fontSize: '35px' }} />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px', width: '600px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {settings.map((setting, index) => (
                                        <>
                                            <MenuItem key={setting} onClick={() => {
                                                handleCloseUserMenu();
                                                if (setting.toLowerCase() === "logout") {
                                                    handleLogOut(); // 🔹 call your logout function here
                                                }
                                            }} sx={{ borderBlock: '1px' }}>
                                                {setting === "email" ? <AccountCircleOutlinedIcon sx={{ fontSize: 20, mr: 1 }} /> : <LogoutOutlinedIcon sx={{ fontSize: 20, mr: 1 }} />}
                                                <Typography variant="body2" sx={{ textAlign: 'start', minWidth: '200px' }}>{setting === "email" ? isLoggedIn.data.data.email : setting}</Typography>
                                            </MenuItem>
                                            {index !== 1 && <Divider />}
                                        </>
                                    ))}
                                </Menu>
                            </Box>
                        </Box>
                    </Toolbar>
                </AppBar>

                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            position: "relative",
                            boxSizing: "border-box",
                            backgroundColor: "#fff",
                            color: 'black',
                            overflow: "visible",
                            borderRight: "1px solid rgba(0,0,0,0.2)",
                        },
                    }}
                >
                    <Toolbar />
                    <Box sx={{ overflow: "auto" }}>
                        <Sidebar collapsed={collapsed} />
                    </Box>
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            color: "grey.600",
                            p: 2,
                            borderTop: "1px solid rgba(0, 0, 0, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: 'center',
                            gap: 1.5,
                        }}
                        onClick={handleNavigate}
                    >
                        <KeyboardDoubleArrowLeftIcon />
                    </Box>
                    <IconButton
                        size="small"
                        onClick={handleToggle}
                        sx={{
                            position: "absolute",
                            top: "15%",
                            right: -13, // place it outside the drawer, on the border
                            transform: "translateY(-40%)",
                            overflow: "visible",
                            backgroundColor: "#fff",
                            border: "1px solid rgba(0,0,0,0.2)",
                            zIndex: 90,
                            // boxShadow: 1,
                            p: 0.2,
                            "&:hover": { backgroundColor: "#f5f5f5" },
                        }}
                    >
                        {collapsed ? <KeyboardArrowRightIcon /> : <KeyboardArrowLeftIcon />}
                    </IconButton>
                </Drawer>

                {/* Main content */}
                <main style={{
                    flexGrow: 1, paddingTop: '64px', background: "#fff", minHeight: "100vh", // make sure content fills full screen
                    overflow: "auto",
                }}>
                    <Box
                        sx={{
                            backgroundColor: "#fff9eb",
                            width: "100%",
                            py: 3,
                        }}
                    >
                        <Box
                            sx={{
                                maxWidth: "1200px",
                                mx: "auto",
                                px: 3,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            {/* Left text */}
                            <Typography variant="body1" sx={{ color: "black" }}>
                                Hello. Fill in your account details to make your first deposit
                            </Typography>
                            {/* Right buttons */}
                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    sx={{ background: '#6c859514', color: 'black', textTransform: 'none', px: 2, boxShadow: 'none', }}
                                >
                                    Learn More
                                </Button>
                                <Button
                                    variant="contained"
                                    size="small"
                                    sx={{ backgroundColor: "#ffde02", textTransform: 'none', color: 'black', px: 2, boxShadow: 'none', }}
                                    onClick={() => setOpenComplteProfile(true)}
                                >
                                    Complete Profile
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                    <Outlet />
                    <Footer />
                </main>
            </div>
        </>
    );
};

export default LayOut;
