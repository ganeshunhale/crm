import { lazy } from "react";
import {  Navigate } from 'react-router-dom';

// Lazy imports
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const LayOutPage = lazy(() => import("../pages/LayOut"));
const LoginPage = lazy(() => import("../pages/Login/LoginPage"));
const RegisterPage = lazy(() => import("../pages/Register/RegisterNew"));
const MaintenancePage = lazy(() => import("../components/Maintenance"));
const AccountPage = lazy(() => import("../sections/Trading/Accounts"));
const SummaryPage = lazy(() => import("../sections/Trading/Summary"));
const Deposit = lazy(() => import("../sections/Trading/Deposit/Deposit"));
const Withdrawal = lazy(() => import("../sections/Trading/Withdrawal/Withdrawal"));
const TransactionHistory = lazy(() => import("../sections/Payment/TransactionHistory"));
const UserProfileFormPage = lazy(() => import("../sections/Trading/Accounts/NewAaccount"));

export const publicRoutes = [
  { path: "/", element: <Navigate to="/sign-in" replace /> },
  { path: "/sign-in", element: <LoginPage /> },
  { path: "/sign-up", element: <RegisterPage /> },
  { path: "/maintenance", element: <MaintenancePage /> },
];

export const protectedRoutes = [
  { path: "/dashboard", element: <Dashboard /> },
  {
    path: "/dashboard/lay-out",
    element: <LayOutPage />,
    children: [
      { path: "accounts", element: <AccountPage /> },
      { path: "summary", element: <SummaryPage /> },
      { path: "deposit", element: <Deposit /> },
      { path: "withdrawal", element: <Withdrawal /> },
      { path: "transaction-history", element: <TransactionHistory /> },
      { path: "profile", element: <UserProfileFormPage /> },
    ],
  },
];
