import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ThemeProvider, CssBaseline } from '@mui/material';
import darkTheme from './dark.theme.js';
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store,persistor } from './redux/store.js'
createRoot(document.getElementById('root')).render(
  <StrictMode>
     <BrowserRouter>
     <ThemeProvider theme={darkTheme}>
    <CssBaseline /> {/* Ensures dark background + text colors */}
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <App />
    </PersistGate>
    </Provider>
    </ThemeProvider>
     </BrowserRouter>
  </StrictMode>,
)
