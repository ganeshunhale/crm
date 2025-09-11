import { AppBar, Avatar, Button, Divider, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import {
    Drawer,
    Toolbar,
    Box,
} from "@mui/material";

import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "@/assets/Img/LOGO_DARK.svg";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import Sidebar from "./SideBar";

const LayOut = () => {
    const drawerWidth = 270;
    const [anchorElUser, setAnchorElUser] = useState(null);
    const navigate = useNavigate();
    const settings = ['email', 'LogOut'];

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleNavigate =()=>{
        navigate('/dashboard')
    }

    return (
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
                            alt="CFDUP Logo"
                            sx={{ height: 60, width: "auto", mr: 1,cursor:'pointer' }}
                        />

                    </Box>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Typography>34.88 USD</Typography>

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
                                            {setting === "email" ? <AccountCircleOutlinedIcon sx={{ color: '#fff', fontSize: 20, mr: 1 }} /> : <LogoutOutlinedIcon sx={{ color: '#fff', fontSize: 20, mr: 1 }} />}
                                            <Typography sx={{ textAlign: 'start', minWidth: '200px' }}>{setting === "email"}</Typography>
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
                        boxSizing: "border-box",
                        backgroundColor: "#fff",
                        color: 'black',
                        borderRight: "1px solid rgba(0,0,0,0.2)",         // set style
                        // borderColor: "grey.500",
                    },
                }}
            >

                <Toolbar />
                <Box sx={{ overflow: "auto" }}>
                    <Sidebar />
                </Box>

                {/* Footer with user info */}
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
            </Drawer>

            {/* Main content */}
            <main style={{ flexGrow: 1, paddingTop: '64px', background: "#fff", }}>
                <Outlet /> {/* this is where child routes render */}
            </main>
        </div>
    );
};

export default LayOut;
