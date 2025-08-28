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
  const TestPage = lazy(() => import('./pages/Payment'));
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
          <Route path="/dashboard/lay-out/" element={<LayOutPage />}>
            <Route path="accounts" element={<TestPage />} />
          </Route>
        </Route>
      </Routes>
    </>
    // </AuthProvider>

  )
}

export default App
