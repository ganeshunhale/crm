import { memo } from 'react';
import { Box } from '@mui/material';
import Logo from "@/assets/Img/SGFX logo-LIGHT.svg";

const LOGO_STYLES = {
  height: 60,
  width: "auto",
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)'
  }
};

const NavbarLogo = ({ isMobile = false }) => {
  return (
    <Box
      component="a"
      href="/dashboard"
      sx={{
        mr: 2,
        display: isMobile ? { xs: "flex", md: "none" } : { xs: 'none', md: 'flex' },
        flexGrow: isMobile ? 1 : 0,
        alignItems: "center",
        textDecoration: "none",
      }}
    >
      <Box
        component="img"
        src={Logo}
        alt="SGFX Logo"
        sx={LOGO_STYLES}
      />
    </Box>
  );
};

export default memo(NavbarLogo);
