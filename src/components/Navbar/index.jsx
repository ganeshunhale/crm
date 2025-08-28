import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useSelector } from 'react-redux';
import DepositDialog from '../DepositDialog/DepositDialog';
import Logo from "@/assets/Img/CFDUP_Logo_noBackground.png";
const pages = [''];
const settings = ['email', 'LogOut'];

function NavBar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [openDialog, setOpenDialog] = React.useState(false)
    const isLoggedIn = useSelector(state => state.auth)
    console.log("user login", isLoggedIn.data.data)

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handleLogOut = () => {
        localStorage.removeItem('persist:auth')
        window.location.href = "/";
    }

    return (
        <>
            <DepositDialog onOpen={openDialog} onClose={setOpenDialog} />

            <AppBar position="static" sx={{ borderBottom: '1px', border: "1px" }}>
                <Container maxWidth="100%">
                    <Toolbar disableGutters>
                        <Box
                            component="a"
                            href="/dashboard"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                alignItems: "center",
                                textDecoration: "none",
                            }}
                        >
                            <Box
                                component="img"
                                src={Logo}   // 👈 replace with your logo path
                                alt="CFDUP Logo"
                                sx={{
                                    height: 70,   // adjust as needed
                                    width: "auto",
                                }}
                            />
                        </Box>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
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
                                sx={{ display: { xs: 'block', md: 'none' } }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                                        <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>

                        <Box
                            component="a"
                            href="#app-bar-with-responsive-menu"
                            sx={{
                                mr: 2,
                                display: { xs: "flex", md: "none" },
                                flexGrow: 1,
                                alignItems: "center",
                                textDecoration: "none",
                            }}
                        >
                            <Box
                                component="img"
                                src={Logo}  // 👈 import Logo at the top
                                alt="SGFX Logo"
                                sx={{ height: 60, width: "auto" }}
                            />
                        </Box>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {pages.map((page) => (
                                <Button
                                    key={page}
                                    onClick={handleCloseNavMenu}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    {page}
                                </Button>
                            ))}
                        </Box>
                        <Box sx={{ flexGrow: 0 }}>

                            <Tooltip title="Open profile">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar sx={{ color: "#fff" }} alt={isLoggedIn?.data?.data?.first_name[0] + isLoggedIn?.data?.data?.last_name[0] || 'U'} src="/static/images/avatar/2.jpg" />
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
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={() => {
                                        handleCloseUserMenu();
                                        if (setting.toLowerCase() === "logout") {
                                            handleLogOut(); // 🔹 call your logout function here
                                        }
                                    }} sx={{ borderBlock: '1px' }}>
                                        <Typography sx={{ textAlign: 'center', minWidth: '200px' }}>{setting === "email" ? isLoggedIn?.data?.data?.email : setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                            <Button variant='contained' sx={{ ml: 2, background: '#4b5563' }} onClick={() => setOpenDialog(true)}>Deposit</Button>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
}
export default NavBar;
