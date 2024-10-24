import React, { useState, useEffect } from "react";
import { auth } from "../../firebase/confing";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import ShoppingCartIcon from "@heroicons/react/24/outline/ShoppingCartIcon";

export default function StickyNavbar() {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const provider = new GoogleAuthProvider();

  // Monitorea el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Función para iniciar sesión con email y contraseña
  const handleEmailLogin = async () => {
    const email = prompt("Ingrese su correo electrónico:");
    const password = prompt("Ingrese su contraseña:");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Inicio de sesión exitoso");
      setIsModalOpen(false); // Cierra el modal después del inicio de sesión
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error al iniciar sesión: " + error.message);
    }
  };

  // Función para iniciar sesión con Google
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      alert("Inicio de sesión con Google exitoso");
      setIsModalOpen(false); // Cierra el modal después del inicio de sesión
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      alert("Error al iniciar sesión con Google: " + error.message);
    }
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Sesión cerrada exitosamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Error al cerrar sesión: " + error.message);
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
              // Si el usuario está autenticado, muestra su correo, foto de perfil y opción para cerrar sesión
              <div className="flex items-center">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt="Foto de perfil"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <span className="ml-2">Hola, {user.displayName || user.email}</span>
                <button
                  onClick={handleLogout}
                  className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              // Si no está autenticado, muestra un botón para elegir método de inicio de sesión
              <div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center text-gray-600 dark:text-gray-300 focus:outline-none px-3 py-1 bg-blue-50 rounded hover:bg-blue-600"
                >
                  Iniciar Sesión
                </button>

                {/* Modal para elegir método de autenticación */}
                {isModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <h2 className="text-lg font-semibold mb-4">Elige un método de autenticación</h2>
                      <button
                        onClick={handleEmailLogin}
                        className="w-full mb-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                      >
                        Iniciar Sesión con Email
                      </button>
                      <button
                        onClick={handleGoogleLogin}
                        className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Iniciar Sesión con Google
                      </button>
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="mt-4 w-full px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

