import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [id_User, setId_User] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                try {
                    // Obtener el correo del usuario autenticado
                    const email = firebaseUser.email;
                    if (email) {
                        // Hacer la petición al backend para obtener el id_User
                        const response = await fetch(`http://localhost:3001/user/email/${email}`);
                        if (!response.ok) {
                            throw new Error('Error al obtener el ID de usuario desde el backend');
                        }
                        const data = await response.json();
                        setId_User(data.id_User); // Guardar el ID del usuario en el estado
                    }
                } catch (error) {
                    console.error('Error al obtener el ID de usuario:', error);
                }
            } else {
                setUser(null);
                setId_User(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, id_User }}>
            {children}
        </AuthContext.Provider>
    );
};