import React, { useState, useEffect, useMemo } from "react";
import { auth, googleProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "../../firebase/config";
import { signOut, onAuthStateChanged, signInWithPopup, updateProfile } from "firebase/auth";
import axios from "axios";
import ShoppingCartIcon from "@heroicons/react/24/outline/ShoppingCartIcon";
import Swal from "sweetalert2";

export default function StickyNavbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("Estado de autenticación cambiado:", currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Función para guardar los datos del usuario en el backend
  const saveUserToBackend = async (userData, password) => {
    try {
      if (!userData) {
        throw new Error("No se pudo obtener los datos del usuario.");
      }
      
      const token = await userData.getIdToken();
      if (!token) {
        throw new Error("No se pudo obtener el token de autenticación.");
      }

      await axios.post(
        "http://localhost:3001/user/",
        {
          name: userData.displayName || userData.name || "",
          email: userData.email,
          image: userData.photoURL || "",
          role: "customer",
          active: true,
          password,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Usuario guardado en el backend");
    } catch (error) {
      console.error("Error al guardar el usuario en el backend:", error);
      Swal.fire("Error al guardar usuario", error.message, "error");
    }
  };

  // Manejo de inicio de sesión con Google
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await saveUserToBackend(result.user);
      Swal.fire("Inicio de sesión con Google exitoso", "", "success");
    } catch (error) {
      Swal.fire("Error al iniciar sesión con Google", error.message, "error");
    }
  };

  // Manejo de inicio de sesión con email
  const handleEmailLogin = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await saveUserToBackend(result.user);
      Swal.fire("Inicio de sesión exitoso", "", "success");
    } catch (error) {
      Swal.fire("Error al iniciar sesión", error.message, "error");
    }
  };

  // Manejo de registro con email
  const handleEmailSignUp = async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName });
      await saveUserToBackend(result.user, password); // Guardar el nuevo usuario y su contraseña en el backend
      Swal.fire("Registro exitoso", "", "success");
    } catch (error) {
      Swal.fire("Error al registrarse", error.message, "error");
    }
  };

  // Mostrar el formulario de inicio de sesión o registro
  const handleAuthAlert = () => {
    Swal.fire({
      title: "Iniciar Sesión o Registrarse",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Iniciar Sesión",
      denyButtonText: "Registrarse",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        showLoginForm();
      } else if (result.isDenied) {
        showSignUpForm();
      }
    });
  };

  // Mostrar formulario de inicio de sesión
  const showLoginForm = () => {
    Swal.fire({
      title: "Iniciar Sesión",
      html: `
        <button id="googleLogin" class="swal2-confirm swal2-styled" style="background-color:#dd4b39; margin-bottom: 10px;">
          Iniciar sesión con Google
        </button>
        <br/>
        <input type="email" id="email" class="swal2-input" placeholder="Correo electrónico">
        <input type="password" id="password" class="swal2-input" placeholder="Contraseña">
      `,
      confirmButtonText: "Iniciar Sesión con Correo",
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const email = Swal.getPopup().querySelector("#email").value;
        const password = Swal.getPopup().querySelector("#password").value;
        if (!email || !password) {
          Swal.showValidationMessage(`Por favor ingresa email y contraseña`);
          return;
        }
        return { email, password };
      },
      didOpen: () => {
        const googleButton = Swal.getPopup().querySelector("#googleLogin");
        googleButton.addEventListener("click", handleGoogleLogin);
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { email, password } = result.value;
        handleEmailLogin(email, password);
      }
    });
  };

  // Mostrar formulario de registro
  const showSignUpForm = () => {
    Swal.fire({
      title: "Registrarse",
      html: `
        <input type="text" id="displayName" class="swal2-input" placeholder="Nombre de usuario">
        <input type="email" id="email" class="swal2-input" placeholder="Correo electrónico">
        <input type="password" id="password" class="swal2-input" placeholder="Contraseña">
      `,
      confirmButtonText: "Registrarse",
      showCancelButton: true,
      preConfirm: () => {
        const displayName = Swal.getPopup().querySelector("#displayName").value;
        const email = Swal.getPopup().querySelector("#email").value;
        const password = Swal.getPopup().querySelector("#password").value;
        if (!email || !password || !displayName) {
          Swal.showValidationMessage(`Todos los campos son requeridos`);
          return;
        }
        return { displayName, email, password };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { displayName, email, password } = result.value;
        handleEmailSignUp(email, password, displayName);
      }
    });
  };

  // Manejo de cierre de sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Swal.fire("Sesión cerrada exitosamente", "", "success");
    } catch (error) {
      Swal.fire("Error al cerrar sesión", error.message, "error");
    }
  };

  // Memorizar el renderizado de la navbar
  const renderedNavbar = useMemo(() => (
    <nav className="bg-white shadow dark:bg-gray-200 sticky top-0 z-50 opacity-50">
      <div className="container flex items-center justify-center p-1 mx-auto text-gray-900 capitalize dark:text-gray-300">
        <a href="#" className="text-gray-800 transition-colors duration-300 transform dark:text-gray-200 border-b-2 border-blue-500 mx-1.5 sm:mx-6">Home</a>
        <a href="#" className="border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6">Features</a>
        <a href="#" className="border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6">Pricing</a>
        <a href="#" className="border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6">Blog</a>

        <a href="/user/shoppingcart" className="flex items-center border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6">
          <ShoppingCartIcon className="w-6 h-6" />
        </a>

        <div className="relative inline-block text-left ml-auto">
          {user ? (
            <div className="flex items-center">
              {user.photoURL && <img src={user.photoURL} alt="Foto de perfil" className="w-8 h-8 rounded-full mr-2" />}
              <span className="ml-2">Hola, {user.displayName || user.email}</span>
              <button onClick={handleLogout} className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Cerrar Sesión</button>
            </div>
          ) : (
            <button onClick={handleAuthAlert} className="flex items-center text-gray-600 dark:text-gray-300 focus:outline-none px-3 py-1 bg-blue-50 rounded hover:bg-blue-600">Iniciar Sesión</button>
          )}
        </div>
      </div>
    </nav>
  ), [user]); // Solo se recalcula si el estado de user cambia

  return renderedNavbar;
}