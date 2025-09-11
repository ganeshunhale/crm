import { useState, useCallback, memo } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Typography,
  Divider
} from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

const USER_MENU_CONFIG = [
  {
    id: 'email',
    label: 'email',
    icon: AccountCircleOutlinedIcon,
    action: 'display_email'
  },
  {
    id: 'logout',
    label: 'LogOut',
    icon: LogoutOutlinedIcon,
    action: 'logout'
  }
];

const USER_PROFILE_STYLES = {
  profileIcon: {
    color: "#fff",
    fontSize: '35px',
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

const UserProfile = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const isLoggedIn = useSelector(state => state.auth);

  const handleOpenUserMenu = useCallback((event) => {
    setAnchorElUser(event.currentTarget);
  }, []);

  const handleCloseUserMenu = useCallback(() => {
    setAnchorElUser(null);
  }, []);

  const handleLogOut = useCallback(() => {
    localStorage.removeItem('persist:auth');
    window.location.href = "/";
  }, []);

  const handleUserMenuAction = useCallback((action) => {
    handleCloseUserMenu();
    if (action === 'logout') {
      handleLogOut();
    }
  }, [handleLogOut]);

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Open user profile" arrow>
        <IconButton 
          onClick={handleOpenUserMenu} 
          sx={{ 
            p: 0,
            transition: 'transform 0.2s ease-in-out',
            '&:hover': { transform: 'scale(1.1)' }
          }}
          aria-label="Open user profile menu"
        >
          <AccountCircleOutlinedIcon sx={USER_PROFILE_STYLES.profileIcon} />
        </IconButton>
      </Tooltip>

      <Menu
        sx={{ 
          mt: '45px',
          '& .MuiPaper-root': {
            minWidth: '250px',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }}
        id="user-menu"
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
        {USER_MENU_CONFIG.map((item, index) => {
          const IconComponent = item.icon;
          const isEmail = item.action === 'display_email';
          const displayText = isEmail ? isLoggedIn?.data?.data?.email : item.label;
          
          return (
            <div key={item.id}>
              <MenuItem 
                onClick={() => handleUserMenuAction(item.action)}
                sx={{
                  ...USER_PROFILE_STYLES.menuItem,
                  cursor: isEmail ? 'default' : 'pointer',
                  '&:hover': {
                    backgroundColor: isEmail ? 'transparent' : 'rgba(255,255,255,0.08)'
                  }
                }}
                disabled={isEmail}
              >
                <IconComponent sx={{ 
                  color: '#fff', 
                  fontSize: 20, 
                  mr: 1 
                }} />
                <Typography sx={{ 
                  textAlign: 'start', 
                  minWidth: '180px',
                  fontWeight: isEmail ? 400 : 500
                }}>
                  {displayText}
                </Typography>
              </MenuItem>
              {index < USER_MENU_CONFIG.length - 1 && <Divider />}
            </div>
          );
        })}
      </Menu>
    </Box>
  );
};

export default memo(UserProfile);
