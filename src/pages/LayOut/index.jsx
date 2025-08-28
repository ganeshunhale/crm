import { Avatar, Typography } from "@mui/material";
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
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

const LayOut = () => {
  const drawerWidth = 300;
  const [openTrading, setOpenTrading] = useState(false);
  const [openWallet, setOpenWallet] = useState(false); // separate state
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#1e1e1e",
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
                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={() => navigate("accounts")}
                >
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
                  <ListItemText primary="History of orders" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>

          <List>
            {/* Wallet Accordion */}
            <ListItemButton onClick={() => setOpenWallet(!openWallet)}>
              <ListItemIcon>
                <ShowChart sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Payment & Wallet" />
              {openWallet ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={openWallet} timeout="auto" unmountOnExit>
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
                  <ListItemText primary="Withdrawal" />
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

        {/* Footer with user info */}
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
          <Avatar alt="User Avatar" src="/avatar.png" />
          <Typography variant="body2" sx={{ color: "white" }}>
            user@example.com
          </Typography>
        </Box>
      </Drawer>

      {/* Main content */}
      <main style={{ flexGrow: 1, padding: "20px", background: "#f9fafb" }}>
        <Outlet /> {/* this is where child routes render */}
      </main>
    </div>
  );
};

export default LayOut;
