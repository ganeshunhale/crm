import { Suspense } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import FallBackUi from "./components/FallBack/FallBackUI";

const DefaultLayout = () => (
  <Suspense fallback={<FallBackUi />}>
    <ReactErrorBoundary FallbackComponent={({ error }) => <ErrorBoundary error={error} />}>
      <Outlet />
    </ReactErrorBoundary>
  </Suspense>
);

export const ProtectedRoutes = () => {
  // Ensure you're selecting the correct slice shape
  const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);

  return isLoggedIn ? <DefaultLayout /> : <Navigate to="/sign-in" replace />;
};

export const PublicRoutes = () => {
  const isLoggedIn = useSelector((state) => state.auth?.isLoggedIn);

  return !isLoggedIn ? <DefaultLayout /> : <Navigate to="/dashboard" replace />;
};
