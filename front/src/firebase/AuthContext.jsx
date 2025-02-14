import React, { createContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [id_User, setId_User] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const checkUserInBackend = async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken(true);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.get(
        `http://localhost:3001/user/email/${firebaseUser.email}`
      );

      if (response.data) {
        setId_User(response.data.id_User);
        setRole(response.data.role);
        localStorage.setItem("role", response.data.role);
        return response.data.role;
      }
    } catch (error) {
      console.error("Error al verificar usuario en el backend:", error);
      delete axios.defaults.headers.common["Authorization"];
    }
    return null;
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userRole = await checkUserInBackend(firebaseUser);

        if (userRole === "admin") {
          navigate("/admin/reservas");
        } else if (userRole) {
          navigate("/user/profile");
        }
      } else {
        setUser(null);
        setId_User(null);
        setRole(null);
        localStorage.removeItem("role");
        delete axios.defaults.headers.common["Authorization"];
        navigate("/");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const value = {
    user,
    id_User,
    role,
    loading,
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
