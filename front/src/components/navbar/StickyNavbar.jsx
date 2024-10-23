import React, { useState, useEffect } from "react";
import { auth } from "../../firebase/confing";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import ShoppingCartIcon from "@heroicons/react/24/outline/ShoppingCartIcon";

export default function StickyNavbar() {
  const [user, setUser] = useState(null);

  // Monitorea el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Función para iniciar sesión (ejemplo simple)
  const handleLogin = async () => {
    const email = prompt("Ingrese su correo electrónico:");
    const password = prompt("Ingrese su contraseña:");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Inicio de sesión exitoso");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Sesión cerrada exitosamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <nav className="bg-white shadow dark:bg-gray-200 sticky top-0 z-50 opacity-50">
      <div className="container flex items-center justify-center p-1 mx-auto text-gray-900 capitalize dark:text-gray-300">
        <a href="#" className="text-gray-800 transition-colors duration-300 transform dark:text-gray-200 border-b-2 border-blue-500 mx-1.5 sm:mx-6">
          home
        </a>

        <a href="#" className="border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6">
          features
        </a>

        <a href="#" className="border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6">
          pricing
        </a>

        <a href="#" className="border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6">
          blog
        </a>

        <a href="/user/shoppingcart" className="flex items-center border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6">
          <ShoppingCartIcon className="w-6 h-6" />
        </a>

        <div className="relative inline-block text-left">
          <div>
            {user ? (
              // Si el usuario está autenticado, muestra su correo y opción para cerrar sesión
              <div className="flex items-center">
                <span className="ml-2">Hola, {user.email}</span>
                <button
                  onClick={handleLogout}
                  className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              // Si no está autenticado, muestra la opción para iniciar sesión
              <button
                onClick={handleLogin}
                className="flex items-center text-gray-600 dark:text-gray-300 focus:outline-none"
              >
                <svg className="w-2 h-1 fill-current" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 15.36l4.52 2.236-.865-5.044 3.664-3.682-5.047-.733L12 2l-1.748 5.184-5.048.733 3.664 3.682-.865 5.044L12 15.36z" />
                </svg>
                <span className="ml-2">Iniciar Sesión</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
