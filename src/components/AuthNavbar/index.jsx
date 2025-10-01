import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import Logo from "@/assets/Img/SGFX logo-DARK.svg";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyIcon from '@mui/icons-material/Key';
import { Link } from "react-router-dom";

const AuthNavbar = () => {
    return (
        <Grid item xs={12}>
            <Box
                sx={{
                    position: "fixed",
                    top: 16,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "90%",
                    maxWidth: "1200px",
                    backgroundColor: "#f0f2f5",
                    height: "64px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 3,
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                    zIndex: 99,
                }}
            >
                {/* Left: Logo */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                        component="img"
                        src={Logo}
                        alt="SGFX Logo"
                        sx={{ height: 50, width: "auto", cursor: "pointer" }}
                    />
                </Box>

                {/* Center: Links */}
                <Box sx={{ flex: 1, display: "flex", justifyContent: "end", gap: 3 }}>
                    <Link to="/sign-in">
                        <Typography
                            sx={{
                                textDecoration: "none",
                                color: "primary.main",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                ":hover": {
                                    color: "info.main",
                                }
                            }}
                        >
                            <KeyIcon /> Sign In
                        </Typography>
                    </Link>
                    <Link to="/sign-up">
                        <Typography
                            sx={{
                                textDecoration: "none",
                                color: "primary.main",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                ":hover": {
                                    color: "info.main",
                                }
                            }}
                        >
                            <AccountCircleIcon /> Sign Up
                        </Typography>
                    </Link>
                </Box>
                {/* Right: Empty spacer (keeps center truly centered) */}
                <Box sx={{ width: 50 }} />
            </Box>
        </Grid>
    )
}
export default AuthNavbar