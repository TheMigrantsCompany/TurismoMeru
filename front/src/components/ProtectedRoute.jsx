import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../firebase/AuthContext";

export const AdminRoute = ({ children }) => {
  const { user, role, allowHomeNavigation } = useContext(AuthContext);
  const location = useLocation();

  // Permitir navegación al home si está explícitamente permitido
  if (location.pathname === "/" && allowHomeNavigation) {
    return children;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (role !== "admin") {
    return <Navigate to="/user/profile" />;
  }

  return children;
};

export const UserRoute = ({ children }) => {
  const { user, allowHomeNavigation } = useContext(AuthContext);
  const location = useLocation();

  // Permitir navegación al home si está explícitamente permitido
  if (location.pathname === "/" && allowHomeNavigation) {
    return children;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};
