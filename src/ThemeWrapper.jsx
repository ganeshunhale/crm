// ThemeWrapper.jsx
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { darkTheme, lightTheme } from './dark.theme';

export default function ThemeWrapper({ children }) {
  const location = useLocation();

  // Define your route condition for light vs dark
  const isLightPage = location.pathname.includes('/dashboard/lay-out');
  const theme = isLightPage ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
