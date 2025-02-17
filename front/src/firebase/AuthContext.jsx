import React, { createContext, useState, useEffect, useContext } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [id_User, setId_User] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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

        if (location.pathname === '/') {
          if (userRole === "admin") {
            navigate("/admin/reservas");
          } else if (userRole) {
            navigate("/user/profile");
          }
        }
      } else {
        setUser(null);
        setId_User(null);
        setRole(null);
        localStorage.removeItem("role");
        delete axios.defaults.headers.common["Authorization"];
        
        if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/user')) {
          navigate("/");
        }
      }
      setLoading(false);
    });
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    setUser(firebaseUser);
                    const email = firebaseUser.email;
                    if (email) {
                        const token = await firebaseUser.getIdToken();
                        const response = await fetch(`${API_URL}/user/email/${email}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        
                        if (!response.ok) {
                            throw new Error(`Error ${response.status}: ${response.statusText}`);
                        }
                        
                        const data = await response.json();
                        setId_User(data.id_User);
                    }
                } else {
                    setUser(null);
                    setId_User(null);
                }
            } catch (error) {
                console.error('Error en la autenticación:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        });

    return () => unsubscribe();
  }, [navigate, location.pathname]);

  const value = {
    user,
    id_User,
    role,
    loading,
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
        return (
            <div className="text-red-500 p-4 text-center">
                Error: {error}
            </div>
        );
  }

    return (
        <AuthContext.Provider value={{ user, id_User, error }}>
            {children}
        </AuthContext.Provider>
    );
};
