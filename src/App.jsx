import { lazy } from 'react'
import './App.css'
import { Route, Routes, Navigate } from 'react-router-dom';
import { ProtectedRoutes, PublicRoutes } from './ProtectedRoute';
import GlobalSnackbar from './components/Snackbar';

function App() {
  const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
  const LayOutPage = lazy(() => import('./pages/LayOut'));
  const RegisterPage = lazy(() => import('./pages/Register/RegisterPage'))
  const LoginPage = lazy(() => import('./pages/Login/LoginPage'))
  const SummaryPage = lazy(() => import('./sections/Trading/Summary'));
  const AccountPage = lazy(() => import('./sections/Trading/Accounts'));
  const UserProfileFormPage = lazy(() => import('./sections/Trading/Accounts/NewAaccount'));
  const OrderHistory = lazy(() => import('./sections/Trading/History'))
  const Deposit = lazy(() => import('./sections/Trading/Deposit/Deposit'));
  const TransactionHistory = lazy(() => import('./sections/Payment/TransactionHistory'));
  const Widrow = lazy(() => import('./sections/Trading/Withdrawal/Withdrawal'))
  const MaintenancePage = lazy(() => import('./components/Maintenance'))
  return (
    // <AuthProvider>
    <>
      <GlobalSnackbar />
      <Routes>
        <Route element={<PublicRoutes />} >
          <Route path="/" element={<Navigate to="/sign-in" replace />} />
          <Route path="/sign-in" element={<LoginPage />} />
          <Route path="/sign-up" element={<RegisterPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />

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
            <Route path="order-history" element={<SummaryPage />} />
            <Route path="deposit" element={<Deposit />} />
            <Route path="withdrawal" element={<Widrow />} />
            <Route path="transaction-history" element={<TransactionHistory />} />
            <Route path="profile" element={<UserProfileFormPage />} />
          </Route>
        </Route>
      </Routes>
    </>
    // </AuthProvider>

  )
}

export default App
