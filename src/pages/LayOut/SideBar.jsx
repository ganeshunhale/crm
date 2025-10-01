import { useState, useEffect } from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Popover,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  CandlestickChart as CandlestickChartIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
} from "@mui/icons-material";
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { useNavigate } from "react-router-dom";

export default function Sidebar({ collapsed }) {
  
  const navigate = useNavigate();
  const [popoverState, setPopoverState] = useState({
    anchorEl: null,
    children: [],
  });

  const handleOpenPopover = (event, children) => {
    setPopoverState({
      anchorEl: event.currentTarget,
      children,
    });
  };

  const handleClosePopover = () => {
    setPopoverState({
      anchorEl: null,
      children: [],
    });
  };

  const isPopoverOpen = Boolean(popoverState.anchorEl);
  const [openMenus, setOpenMenus] = useState({
    trading: true,
    paymentWallet: true

  });

  // Dynamic menu config
  const menuItems = [
    {
      label: "Trading", value: 'trading',
      icon: <CandlestickChartIcon sx={{ color: "textSecondary" }} />,
      children: [
        { label: "My Accounts", path: "/dashboard/lay-out/accounts" || "/dashboard/lay-out/profile" },
        { label: "Summary", path: "/dashboard/lay-out/summary" },
        { label: "History of orders", path: "/dashboard/lay-out/order-history" },
      ],
    },
    {
      label: "Payment & Wallet", value: 'paymentWallet',
      icon: <AccountBalanceWalletIcon sx={{ color: "textSecondary" }} />,
      children: [
        { label: "Deposit", path: "/dashboard/lay-out/deposit" },
        { label: "Withdrawal", path: "/dashboard/lay-out/withdrawal" },
        { label: "Transaction history", path: "/dashboard/lay-out/transaction-history" },
      ],
    },
    // {
    //   label: "Analytics",
    //   icon: <AccountBalanceWalletIcon sx={{ color: "grey.600" }} />,
    //   children: [
    //     { label: "Analytics Views", path: "/dashboard/lay-out" },
    //     { label: "Market News", path: "/dashboard/lay-out" },
    //   ],
    // },
    // {
    //   label: "Benifits",
    //   icon: <WorkspacePremiumIcon sx={{ color: "grey.600" }} />,
    //   children: [
    //     { label: "Trading Conditions", path: "/dashboard/lay-out" },
    //     { label: "Savings", path: "/dashboard/lay-out" },
    //   ],
    // },
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
            onClick={(e) => {
              if (collapsed) {
                handleOpenPopover(e, menu.children); // open popover if collapsed
              } else { toggleMenu(menu.value) }
            }}
            sx={{
              px: 2, // Horizontal padding (default is 2)
              py: 0.5, // Vertical padding (default is 1)
              minHeight: 32, // Reduce overall button height

            }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>{menu.icon}</ListItemIcon>
            {!collapsed && <ListItemText primary={menu.label} sx={{ fontSize: 14, margin: 0, color: "textSecondary" }} />}
            {!collapsed && (openMenus[menu.value] ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>

          {/* Submenu */}
          {!collapsed ? <Collapse in={openMenus[menu.value]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {menu.children.map((child, idx) => {
                const isActive = location.pathname === child.path;

                return (
                  <ListItemButton
                    key={idx}
                    sx={{
                      pl: 1,
                      backgroundColor: isActive ? "rgba(0, 0, 0, 0.08)" : "transparent",

                      "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.12)" },
                    }}
                    onClick={() => navigate(child.path)}
                  >
                    <ListItemIcon sx={{ color: isActive ? "textPrimary" : "textSecondary" }}>
                      {child.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={child.label}
                      primaryTypographyProps={{
                        color: isActive ? "textPrimary" : "textSecondary",
                        fontWeight: isActive ? "bold" : "normal",
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Collapse> : <Popover
            open={isPopoverOpen}
            anchorEl={popoverState.anchorEl}
            onClose={handleClosePopover}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <List >
              {console.log("children", menu.children)}
              {popoverState.children.map((child, idx) => {
                const isActive = location.pathname === child.path;
                return (
                  <ListItemButton
                    key={idx}
                    onClick={() => {
                      navigate(child.path);
                      handleClosePopover();
                    }}
                    sx={{
                      backgroundColor: isActive ? "rgba(0, 0, 0, 0.08)" : "transparent",
                      "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.12)" },
                      p: 1
                    }}
                  >
                    {/* <ListItemIcon sx={{ color: isActive ? "red" : "black" }}>
                      {child.icon}
                    </ListItemIcon> */}
                    <ListItemText
                      primary={child.label}
                      primaryTypographyProps={{
                        color: isActive ? "textPrimary" : "textSecondary",
                        fontWeight: isActive ? "bold" : "normal",
                        p: 0,
                        m: 0,
                        // backgroundColor: isActive ? "rgba(0, 0, 0, 0.08)" : "red",
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Popover>}
        </List>
      ))}
    </Box>
  );
}
