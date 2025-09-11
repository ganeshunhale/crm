import { lazy } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoutes, PublicRoutes } from './ProtectedRoute';
import GlobalSnackbar from './components/Snackbar';

function App() {
  const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
  const LayOutPage = lazy(() => import('./pages/LayOut'));
  const Login = lazy(() => import('./pages/Login/Login'));
  const Register = lazy(() => import('./pages/Register/Register'));
  const SummaryPage = lazy(() => import('./sections/Trading/Summary'));
  const AccountPage = lazy(() => import('./sections/Trading/Accounts'));
  return (
    // <AuthProvider>
    <>
      <GlobalSnackbar />
      <Routes>
        <Route element={<PublicRoutes />} >
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route
            path="/dashboard"
            element={
              <Dashboard />
            }
          />
          <Route path="/dashboard/lay-out" element={<LayOutPage />}>
            <Route path="accounts" element={<AccountPage />} />
              <Route path="summary" element={<SummaryPage />} />
          </Route>
        </Route>
      </Routes>
    </>
    // </AuthProvider>

  )
}

export default App
