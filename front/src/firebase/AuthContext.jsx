import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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
    const [error, setError] = useState(null);

    useEffect(() => {
        const auth = getAuth();

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
    }, []);

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