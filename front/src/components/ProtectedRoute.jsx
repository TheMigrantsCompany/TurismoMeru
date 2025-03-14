import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../firebase/AuthContext";

export const AdminRoute = ({ children }) => {
  const { user, role } = useContext(AuthContext);
  const location = useLocation();
  console.log("Protected Route Check:", {
    user,
    role,
    location: location.pathname,
  });

  // Si no hay usuario autenticado, redirigir al login
  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // Si el usuario no es admin, redirigir al perfil de usuario
  if (role !== "admin") {
    return <Navigate to="/user/profile" replace />;
  }

  return children;
};

export const UserRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Si no hay usuario autenticado, redirigir al login
  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};
