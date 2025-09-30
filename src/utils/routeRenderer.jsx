import { Route } from "react-router-dom";

export const renderRoutes = (routes) =>
  routes.map(({ path, element, children, redirect }, index) => (
    <Route key={index} path={path} element={redirect ? <Navigate to={redirect} /> : element}>
      {children && renderRoutes(children)}
    </Route>
  ));
