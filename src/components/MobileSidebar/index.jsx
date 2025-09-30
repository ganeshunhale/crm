import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import InstrumentsPanel from '../../components/Instruments/Intruments'
import { useWebSocket } from '../../customHooks/useWebsocket';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useSelector } from 'react-redux';
import MobilePositionsCards from './PositionPortfolio';
import NavbarLogo from '../Navbar/NavbarLogo';
import { Stack } from '@mui/material';
const ticksSocketUrl = import.meta.env.VITE_REACT_WS_TICKS_BRODCASTER_URL


const MENU_CONFIG = [
    {
        id: 1,
        label: 'Email',
        icon: <AccountCircleOutlinedIcon />,
        value: 'email'
    },
    {
        id: 2,
        label: 'LogOut',
        icon: <LogoutOutlinedIcon />,
        value: 'logout'
    },
    {
        id: 3,
        label: 'Instruments',
        icon: <MenuOutlinedIcon />,
        value: 'instruments'
    },
    {
        id: 4,
        label: 'Portfolio',
        icon: <BusinessCenterOutlinedIcon />,
        value: 'portfolio'
    },

];

export default function MobileDrawer({ open, setOpen }) {


    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
        setSelectedPanel(null)
    };
    const [selectedPanel, setSelectedPanel] = useState(null);
    const { socket: ticksSocket, sendMessage: sendTicksMessage } = useWebSocket(ticksSocketUrl)
    const isLoggedIn = useSelector(state => state.auth);

    console.log("isLoggedIn", isLoggedIn.data.data.email)

    const renderSelectedPanel = () => {
        switch (selectedPanel) {
            case 'instruments':
                return <Box p={3}><InstrumentsPanel ticksSocket={ticksSocket} /></Box>
            case 'portfolio':
                return <MobilePositionsCards/>;
            default:
                return null;
        }
    };

    const handleRedirect = (value) => {
        setSelectedPanel(value)
        if (value === "logout") {
            localStorage.removeItem('persist:auth');
            window.location.href = "/";
        }
    }

    const DrawerList = (
        <Box sx={{ width: '100%' }}>
            <Stack direction="row" alignItems="center" pr={2}>
                <NavbarLogo isMobile />
                <CloseOutlinedIcon onClick={toggleDrawer(false)} />
            </Stack>
            {renderSelectedPanel() ?? (
                <>


                    <List>
                        {MENU_CONFIG.map((item) => (
                            <>
                                <ListItem key={item.id} disablePadding>
                                    <ListItemButton onClick={() => handleRedirect(item.value)}>
                                        <ListItemIcon>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={item.value === "email" ? isLoggedIn.data.data.email : item.label} />

                                    </ListItemButton>
                                </ListItem>
                                {item.id === 2 && <Divider />}
                            </>
                        ))}
                    </List>
                    <Divider />
                </>
            )}
        </Box>
    );

    return (

        <Drawer open={open} onClose={toggleDrawer(false)} PaperProps={{
            sx: {
                width: '100%',
                maxWidth: '100vw',
                backgroundColor: 'black'

            }
        }}>
            {DrawerList}
        </Drawer>

    );
}
