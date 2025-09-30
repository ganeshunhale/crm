import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
import AccountSelector from './AccoutSection';
import { addTradingAccountDetails } from '../../redux/tradingAccoutDetailsSLice';

const BALANCE_STYLES = {
  demoAccountTypeChip: {
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
  realAccountTypeChip: {
    color: "#FFD700",
    marginRight: '4px',
    background: "rgba(255,215,0,0.15)",
    px: 1,
    borderRadius: 1,
    fontSize: '0.75rem',
    fontWeight: 500,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      background: "rgba(255,215,0,0.15)",
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
  const activeId = useSelector(state => state.auth.activeId)
  const initialEquity = useRef(0);
  const navigate = useNavigate();
  const [anchorElBalance, setAnchorElBalance] = useState(null);
  // const [accountDetails, setAccountDetails] = useState({});
  const isLoggedIn = useSelector(state => state.auth);
  const accountDetails = useSelector(state => state.tradingAccouts);
  const accountType= isLoggedIn?.accountType

  const positions = useSelector((state) => state.positions.open);
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

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const res = await GET_ACCOUNT_DETAILS();
        dispatch(addTradingAccountDetails(res.data.result));
      } catch (error) {
        console.log(error);
      }
    })()
  }, [dispatch]);

  useEffect(() => {
    if (!activeId) return;
    const balance = Number(accountDetails[activeId]?.balance) || 0;
    const credit = Number(accountDetails[activeId]?.credit) || 0;
    const eq = balance + credit;
    initialEquity.current = eq;
    setEquity(eq);
  }, [activeId, accountDetails]);

  useEffect(() => {
    if (positions.length === 0) {
      initialEquity.current > 0 && setEquity(initialEquity.current); 
      return
    }

    const totalProfit = positions.reduce((acc, val) => acc + (val.profit || 0), 0);

    // Use current equity state and add profit (exactly like Footer)
    const newEquity = Number((initialEquity.current + totalProfit).toFixed(2));
    setEquity(newEquity);
  }, [positions]);

  const balanceDetails = useMemo(() => {
    if (!Boolean(anchorElBalance) || !activeId) return [];
    // Match Footer's exact access patterns
    const margin = Number(accountDetails[activeId]?.margin) || 0;
    const balance = Number(accountDetails[activeId]?.balance) || 0;

    return [
      {
        id: 'balance',
        label: 'Balance',
        value: `${balance} USD`
      },
      {
        id: 'equity',
        label: 'Equity',
        value: `${(equity || 0).toFixed(2)} USD`
      },
      {
        id: 'margin',
        label: 'Margin',
        value: `${margin} USD`
      },
      {
        id: 'free_margin',
        label: 'Free margin',
        value: `${((equity || 0) - (Number(accountDetails[activeId]?.margin) || 0)).toFixed(2)} USD`
      },
      {
        id: 'margin_level',
        label: 'Margin level',
        value: ((equity / (accountDetails[activeId]?.margin || 1)) * 100).toFixed(2) + '%'
      },
      {
        id: 'account_leverage',
        label: 'Account leverage',
        value: accountDetails[activeId]?.accountLeverage || '1:100'
      }
    ];
  }, [accountDetails, equity, anchorElBalance, activeId,accountType]);


  return (
    <Box sx={{ flexGrow: 0, mr:{md:2} }}>
      <Box display="flex" flexDirection="column" alignItems="start"  sx={{ mx: { md: 3, xs: 0 } }}>
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.75rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box component="span" sx={isLoggedIn?.accountType === "Demo" ?  BALANCE_STYLES.demoAccountTypeChip : BALANCE_STYLES.realAccountTypeChip}>
            {isLoggedIn?.accountType === "Demo" ? "Demo" : 'Real'}
          </Box>
          {activeId || 'No Account Selected'}
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <Typography sx={{ textAlign: 'start', minWidth: '120px', fontWeight: 500, color: 'text.secondary' }}>
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

          <Divider sx={{ my: 1 }} />
        </MenuItem>
        {/* === Choose an account section === */}
        <Divider sx={{ my: 1 }} />
        <AccountSelector/>
      </Menu>
    </Box>
  );
};

export default memo(BalanceDisplay);