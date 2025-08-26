import {lazy} from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoutes, PublicRoutes } from './ProtectedRoute';

function App() {
  const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
  const PaymentDetailPage =  lazy(() => import('./pages/PaymentDetails'));
  const Login = lazy(() => import('./pages/Login/Login'));
  const Register = lazy(() => import('./pages/Register/Register'));
  return (
    // <AuthProvider>
    <Routes>
      <Route element={<PublicRoutes />} >
        <Route path="/" element={ <Login /> }/>
        <Route path="/register" element={ <Register />  } />
      </Route>

      <Route element={<ProtectedRoutes />}>
      <Route
        path="/dashboard"
        element={
            <Dashboard />
        }
      />
      <Route
        path="/dashboard/payment-detail"
        element={
            <PaymentDetailPage />
        }
      />
      </Route>
    </Routes>
  // </AuthProvider>
  )
}

export default App
