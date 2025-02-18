import React, { createContext, useState, useEffect, useContext } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [id_User, setId_User] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [error, setError] = useState(null);
  const [allowHomeNavigation, setAllowHomeNavigation] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          const token = await firebaseUser.getIdToken(true);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          try {
            const response = await axios.get(
              `${API_URL}/user/email/${firebaseUser.email}`
            );

            if (response.data) {
              setId_User(response.data.id_User);
              setRole(response.data.role);
              localStorage.setItem("role", response.data.role);

              // Solo redirigir si estamos en la página principal y no se ha permitido la navegación al home
              if (location.pathname === "/" && !allowHomeNavigation) {
                if (response.data.role === "admin") {
                  navigate("/admin/reservas");
                } else {
                  navigate("/user/profile");
                }
              }
            }
          } catch (error) {
            console.error("Error al verificar usuario en el backend:", error);
            setError("Error al verificar usuario en el backend");
          }
        } else {
          setUser(null);
          setId_User(null);
          setRole(null);
          localStorage.removeItem("role");
          delete axios.defaults.headers.common["Authorization"];

          // Redirigir al home solo si está en rutas protegidas
          if (
            location.pathname.startsWith("/admin") ||
            location.pathname.startsWith("/user")
          ) {
            navigate("/");
          }
        }
      } catch (error) {
        console.error("Error en la autenticación:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate, location.pathname, allowHomeNavigation]);

  // Resetear allowHomeNavigation cuando cambie la ruta
  useEffect(() => {
    if (location.pathname !== "/") {
      setAllowHomeNavigation(false);
    }
  }, [location.pathname]);

  const value = {
    user,
    id_User,
    role,
    loading,
    error,
    allowHomeNavigation,
    setAllowHomeNavigation,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="ml-2">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">Error: {error}</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
