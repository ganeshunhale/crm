// ThemeWrapper.jsx
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { lightTheme, darkTheme } from './theme';
import { useMemo } from 'react';

export default function ThemeWrapper({ children }) {
  const location = useLocation();

  const theme = useMemo(() => {
    if (location.pathname.startsWith('/dashboard/lay-out')) {
      return lightTheme;
    }
    if (location.pathname.startsWith('/sign')) {
      return lightTheme;
    }
     if (location.pathname.startsWith('/maintenance')) {
      return lightTheme;
    }
    return darkTheme;
  }, [location.pathname]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
