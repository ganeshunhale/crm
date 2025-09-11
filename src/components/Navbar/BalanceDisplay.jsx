import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { GET_ACCOUNT_DETAILS } from '../../API/ApiServices';



const BALANCE_STYLES = {
  accountTypeChip: {
    color: '#74D99D',
    marginRight: '4px',
    background: '#46CD7C29',
    px: 1,
    borderRadius: 1,
    fontSize: '0.75rem',
    fontWeight: 500,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      background: '#46CD7C40'
    }
  },
  
  balanceDisplay: {
    color: '#fff',
    textTransform: 'none',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'color 0.2s ease-in-out',
    '&:hover': {
      color: '#e0e0e0'
    }
  },
  
  menuItem: {
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    transition: 'background-color 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.05)'
    }
  }
};

const BalanceDisplay = () => {
  const navigate = useNavigate();
  const [anchorElBalance, setAnchorElBalance] = useState(null);
  const [accountDetails, setAccountDetails] = useState({});
  const isLoggedIn = useSelector(state => state.auth);

  // Real-time balance tracking
  const positions = useSelector((state) => {
    console.log("BalanceDisplay - Redux state:", state.positions);
    return state.positions.open;
  });
  const initialEquity = useRef(0);
  const [equity, setEquity] = useState(0);

  const handleOpenBalanceMenu = useCallback((event) => {
    setAnchorElBalance(event.currentTarget);
  }, []);

  const handleCloseBalanceMenu = useCallback(() => {
    setAnchorElBalance(null);
  }, []);

  const handleNavigateToLayout = useCallback(() => {
    navigate('/dashboard/lay-out');
    handleCloseBalanceMenu();
  }, []);

  const getUserAccDetails = useCallback(async () => {
    try {
      const res = await GET_ACCOUNT_DETAILS();
      setAccountDetails(res.data.result);
      const balance = Number(res.data.result?.balance) || 0;
      const credit = Number(res.data.result?.credit) || 0;
      const eq = balance + credit;
      initialEquity.current = eq;
      setEquity(eq);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getUserAccDetails();
  }, [getUserAccDetails]);



  // Note: Real-time price updates and profit calculations are now handled
  // in the Redux middleware

  useEffect(() => {
    console.log("BalanceDisplay - Positions changed:", positions.length, positions);

    if (positions.length === 0) {
      if (initialEquity.current > 0) {
        setEquity(initialEquity.current);
      }
      console.log("BalanceDisplay - No positions, setting equity to initial:", initialEquity.current);
      return;
    }

    const totalProfit = positions.reduce((acc, val) => {
      console.log(`BalanceDisplay - Position ${val.symbol}: profit=${val.profit}`);
      return acc + (val.profit || 0);
    }, 0);

    const newEquity = Number((initialEquity.current + totalProfit).toFixed(2));
    setEquity(newEquity);
    console.log("BalanceDisplay - Updated equity:", newEquity, "totalProfit:", totalProfit);
  }, [positions]);

  const balanceDetails = useMemo(() => {
    if (!Boolean(anchorElBalance)) return [];
    
    return [
      { 
        id: 'balance',
        label: 'Balance', 
        value: `${Number(accountDetails?.balance) || 0} USD` 
      },
      { 
        id: 'equity',
        label: 'Equity', 
        value: `${(equity || 0).toFixed(2)} USD` 
      },
      { 
        id: 'margin',
        label: 'Margin', 
        value: `${Number(accountDetails?.margin) || 0} USD` 
      },
      { 
        id: 'free_margin',
        label: 'Free margin', 
        value: `${((equity || 0) - (Number(accountDetails?.margin) || 0)).toFixed(2)} USD` 
      },
      { 
        id: 'margin_level',
        label: 'Margin level', 
        value: (accountDetails?.margin && Number(accountDetails.margin) > 0) 
          ? (((equity || 0) / Number(accountDetails.margin)) * 100).toFixed(2) + '%' 
          : '0.00%' 
      },
      { 
        id: 'account_leverage',
        label: 'Account leverage', 
        value: accountDetails?.accountLeverage || '1:100' 
      }
    ];
  }, [accountDetails, equity, anchorElBalance]);

  return (
    <Box sx={{ flexGrow: 0, mr: 2 }}>
      <Box display="flex" flexDirection="column" alignItems="start" mx={3}>
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.75rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box component="span" sx={BALANCE_STYLES.accountTypeChip}>
            {isLoggedIn?.data.client_MT5_id?.demo_id !== "" ? "Demo" : 'Real'}
          </Box>
          Standard
        </Typography>
        <Tooltip title="View account balance details" arrow>
          <Typography
            onClick={handleOpenBalanceMenu}
            sx={BALANCE_STYLES.balanceDisplay}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleOpenBalanceMenu(e);
              }
            }}
          >
            {equity.toFixed(2)} USD
            <KeyboardArrowDownIcon 
              sx={{ 
                ml: 0.5,
                transition: 'transform 0.2s ease-in-out',
                transform: anchorElBalance ? 'rotate(180deg)' : 'rotate(0deg)'
              }} 
            />
          </Typography>
        </Tooltip>
      </Box>

      <Menu
        sx={{ 
          mt: '45px',
          '& .MuiPaper-root': {
            minWidth: '300px',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }}
        id="balance-menu"
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
        {balanceDetails.map((item) => (
          <MenuItem key={item.id} sx={BALANCE_STYLES.menuItem} disabled>
            <Box sx={{  display: 'flex',  justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <Typography sx={{ textAlign: 'start',  minWidth: '120px', fontWeight: 500, color: 'text.secondary' }}>
                {item.label}
              </Typography>
              <Typography sx={{ textAlign: 'end', fontWeight: 600, color: 'text.primary' }}>
                {item.value}
              </Typography>
            </Box>
          </MenuItem>
        ))}
        
        <Divider sx={{ my: 1 }} />
        
        <MenuItem 
          onClick={handleNavigateToLayout}
          sx={{
            ...BALANCE_STYLES.menuItem,
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.08)'
            }
          }}
        >
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}>
            <Typography sx={{ 
              textAlign: 'start',
              fontWeight: 500
            }}>
              Manage Accounts
            </Typography>
            <ChevronRightIcon sx={{ fontSize: 20 }} />
          </Box>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default memo(BalanceDisplay);
