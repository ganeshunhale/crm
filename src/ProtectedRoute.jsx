import { Suspense } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import FallBackUi from './components/FallBack/FallBackUI';
const DefaultLayout = () => {
    return (
        <Suspense fallback={<FallBackUi />}>
            <ReactErrorBoundary
        FallbackComponent={({ error }) => (
          <ErrorBoundary error={error} />
        )}
      >
                <Outlet />
                </ReactErrorBoundary>
        </Suspense>
    )
}

export const ProtectedRoutes = () => {
    const isLoggedIn = useSelector(state => state.auth)
    // const isLoggedIn = localStorage.getItem("isLoggedIn")
    return isLoggedIn?.isLoggedIn ? <DefaultLayout /> : <Navigate to="/" />;
    // return <DefaultLayout />
}

export const PublicRoutes = () => {
    const isLoggedIn = useSelector(state => state.auth?.isLoggedIn)
    // const isLoggedIn = localStorage.getItem("isLoggedIn")
    // const prevRoute = localStorage.getItem("currentRoute")
    return !isLoggedIn ? <DefaultLayout />: <Navigate to="/dashboard" />;
}