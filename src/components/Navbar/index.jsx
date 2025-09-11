import { useState, memo } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

import BalanceDisplay from './BalanceDisplay';
import UserProfile from './UserProfile';
import DepositButton from './DepositButton';
import NavbarLogo from './NavbarLogo';

const NAVIGATION_PAGES = [];

const NAVBAR_STYLES = {
  appBar: {
    borderBottom: '1px solid',
    borderColor: 'divider',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }
  }
};

function NavBar() {
    const [anchorElNav, setAnchorElNav] = useState(null);

    const handleCloseNavMenu = () => setAnchorElNav(null);

    return (
        <AppBar position="static" sx={NAVBAR_STYLES.appBar}>
            <Container maxWidth="100%">
                <Toolbar disableGutters>
                    <NavbarLogo />

                    {/* Mobile Navigation Menu */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="Open navigation menu"
                            aria-controls="mobile-menu-appbar"
                            aria-haspopup="true"
                            onClick={(e) => setAnchorElNav(e.currentTarget)}
                            color="inherit"
                            sx={{
                                transition: 'transform 0.2s ease-in-out',
                                '&:hover': { transform: 'scale(1.1)' }
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="mobile-menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                                '& .MuiPaper-root': {
                                    borderRadius: 2,
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                                }
                            }}
                        >
                            {NAVIGATION_PAGES.map((page) => (
                                <MenuItem
                                    key={page}
                                    onClick={handleCloseNavMenu}
                                    sx={{
                                        transition: 'background-color 0.2s ease-in-out',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.05)'
                                        }
                                    }}
                                >
                                    <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* Mobile Logo */}
                    <NavbarLogo isMobile />

                    {/* Desktop Navigation */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {NAVIGATION_PAGES.map((page) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{
                                    my: 2,
                                    color: 'white',
                                    display: 'block',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        transform: 'translateY(-1px)'
                                    }
                                }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>

                    {/* Balance Display */}
                    <BalanceDisplay />

                    {/* User Profile */}
                    <UserProfile />

                    {/* Deposit Button */}
                    <DepositButton />
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default memo(NavBar);