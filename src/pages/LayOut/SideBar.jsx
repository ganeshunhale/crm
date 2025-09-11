import { useState } from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  AccountCircle,
  Summarize,
  History,
  CandlestickChart as CandlestickChartIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
} from "@mui/icons-material";
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({});

  // Dynamic menu config
  const menuItems = [
    {
      label: "Trading",
      icon: <CandlestickChartIcon sx={{ color: "grey.600" }} />,
      children: [
        { label: "My Accounts", path: "/dashboard/lay-out/accounts" },
        { label: "Summary", path: "/dashboard/lay-out/summary" },
        { label: "History of orders", path: "/dashboard/lay-out/history" },
      ],
    },
    {
      label: "Payment & Wallet",
      icon: <AccountBalanceWalletIcon sx={{ color: "grey.600" }} />,
      children: [
        { label: "Deposit", path: "/dashboard/lay-out/deposit" },
        { label: "Withdrawal", path: "/dashboard/lay-out/withdrawal" },
        { label: "Transaction history", path: "/dashboard/lay-out/transactions" },
      ],
    },
    {
      label: "Analytics",
      icon: <AccountBalanceWalletIcon sx={{ color: "grey.600" }} />,
      children: [
        { label: "Analytics Views", path: "/dashboard/lay-out/deposit" },
        { label: "Market News", path: "/dashboard/lay-out/withdrawal" },
      ],
    },
    {
      label: "Benifits",
      icon: <WorkspacePremiumIcon sx={{ color: "grey.600" }} />,
      children: [
        { label: "Trading Conditions", path: "/dashboard/lay-out/deposit" },
        { label: "Savings", path: "/dashboard/lay-out/withdrawal" },
      ],
    },
  ];

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <Box sx={{ overflow: "auto" }}>
      {menuItems.map((menu, index) => (
        <List key={index}>
          {/* Main menu button */}
          <ListItemButton
            onClick={() => toggleMenu(menu.label)}
            sx={{
              px: 2, // Horizontal padding (default is 2)
              py: 0.5, // Vertical padding (default is 1)
              minHeight: 32, // Reduce overall button height
            }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>{menu.icon}</ListItemIcon>
            <ListItemText primary={menu.label} sx={{ fontSize: 14, margin: 0 }} />
            {openMenus[menu.label] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          {/* Submenu */}
          <Collapse in={openMenus[menu.label]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {menu.children.map((child, idx) => {
                const isActive = location.pathname === child.path;
                console.log("isActive", location.pathname, child.path)
                return (
                  <ListItemButton
                    key={idx}
                    sx={{
                     pl: 1,
                      backgroundColor: isActive ? "rgba(0, 0, 0, 0.08)" : "transparent",
                      borderRadius: 1,
                      "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.12)" },
                    }}
                    onClick={() => navigate(child.path)}
                  >
                    <ListItemIcon sx={{ color: isActive ? "primary.main" : "white" }}>
                      {child.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={child.label}
                      primaryTypographyProps={{
                        color: isActive ? "primary" : "inherit",
                        fontWeight: isActive ? "bold" : "normal",
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Collapse>
        </List>
      ))}
    </Box>
  );
}
