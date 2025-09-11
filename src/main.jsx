import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store,persistor } from './redux/store.js'
import ThemeWrapper from './ThemeWrapper.jsx'; 
createRoot(document.getElementById('root')).render(
  <StrictMode>
     <BrowserRouter>
     <ThemeWrapper>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <App />
    </PersistGate>
    </Provider>
    </ThemeWrapper>
     </BrowserRouter>
  </StrictMode>,
)
