import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../firebase/AuthContext";

export const AdminRoute = ({ children }) => {
  const { user, role } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" />;
  }

  if (role !== "admin") {
    return <Navigate to="/user/profile" />;
  }

  return children;
};

export const UserRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};
