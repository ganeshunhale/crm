import { Avatar, Typography } from '@mui/material'
import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Toolbar,
    Box,
} from "@mui/material";

import {
    ExpandLess,
    ExpandMore,
    AccountCircle,
    Summarize,
    History,
    ShowChart,
} from "@mui/icons-material";

import { useState } from 'react';


const PaymentDetails = () => {
    const drawerWidth = 300;
    const [openTrading, setOpenTrading] = useState(false);


    return (
        <div className="dashboard flex flex-col h-screen">

            <div className="flex-[2] min-h-0 bg-[#1e1e1e] w-[300px]">
                <Typography>Payment Test Page</Typography>
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            boxSizing: "border-box",
                            //backgroundColor: "#1e1e2f",
                            color: "white",
                        },
                    }}
                >
                    <Toolbar />
                    <Box sx={{ overflow: "auto" }}>
                        <List>
                            {/* Trading Accordion */}
                            <ListItemButton onClick={() => setOpenTrading(!openTrading)}>
                                <ListItemIcon>
                                    <ShowChart sx={{ color: "white" }} />
                                </ListItemIcon>
                                <ListItemText primary="Trading" />
                                {openTrading ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>

                            <Collapse in={openTrading} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItemButton sx={{ pl: 4 }}>
                                        <ListItemIcon>
                                            <AccountCircle sx={{ color: "white" }} />
                                        </ListItemIcon>
                                        <ListItemText primary="My Accounts" />
                                    </ListItemButton>

                                    <ListItemButton sx={{ pl: 4 }}>
                                        <ListItemIcon>
                                            <Summarize sx={{ color: "white" }} />
                                        </ListItemIcon>
                                        <ListItemText primary="Summary" />
                                    </ListItemButton>

                                    <ListItemButton sx={{ pl: 4 }}>
                                        <ListItemIcon>
                                            <History sx={{ color: "white" }} />
                                        </ListItemIcon>
                                        <ListItemText primary="History od orders" />
                                    </ListItemButton>
                                </List>
                            </Collapse>

                        </List>
                        <List>
                            {/* Trading Accordion */}
                            <ListItemButton onClick={() => setOpenTrading(!openTrading)}>
                                <ListItemIcon>
                                    <ShowChart sx={{ color: "white" }} />
                                </ListItemIcon>
                                <ListItemText primary="Payment & wallet" />
                                {openTrading ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>

                            <Collapse in={openTrading} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItemButton sx={{ pl: 4 }}>
                                        <ListItemIcon>
                                            <AccountCircle sx={{ color: "white" }} />
                                        </ListItemIcon>
                                        <ListItemText primary="Deposit" />
                                    </ListItemButton>

                                    <ListItemButton sx={{ pl: 4 }}>
                                        <ListItemIcon>
                                            <Summarize sx={{ color: "white" }} />
                                        </ListItemIcon>
                                        <ListItemText primary="Withdrawel" />
                                    </ListItemButton>

                                    <ListItemButton sx={{ pl: 4 }}>
                                        <ListItemIcon>
                                            <History sx={{ color: "white" }} />
                                        </ListItemIcon>
                                        <ListItemText primary="Transaction history" />
                                    </ListItemButton>
                                </List>
                            </Collapse>

                        </List>
                    </Box>
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            p: 2,
                            borderTop: "1px solid rgba(255,255,255,0.2)",
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                           
                        }}
                    >
                        <Avatar alt="User Avatar" src="/avatar.png" /> {/* replace with real image */}
                        <Typography variant="body2" sx={{ color: "white" }}>
                            user@example.com
                        </Typography>
                    </Box>
                </Drawer>
            </div>
        </div>
    )
}

export default PaymentDetails