import React, { useState, useEffect, useMemo, useContext } from "react";
import {
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "../../firebase/config";
import {
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import axios from "axios";
import ShoppingCartIcon from "@heroicons/react/24/outline/ShoppingCartIcon";
import Swal from "sweetalert2";
import { useCart } from "../../views/shopping-cart/CartContext";
import { useNavigate } from "react-router-dom";
import logoImage from "../../assets/images/logo/logo.jpg";
import { AuthContext } from "../../firebase/AuthContext";

export default function StickyNavbar() {
  const { user, role } = useContext(AuthContext);
  const { clearCart, setUserId } = useCart();
  const navigate = useNavigate();

  const handleLogin = async (userData) => {
    try {
      const token = await userData.getIdToken(true);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.get(
        `http://localhost:3001/user/email/${userData.email}`
      );

      if (response.data) {
        localStorage.setItem("uuid", response.data.id_User);
        localStorage.setItem("role", response.data.role);
        setUserId(userData.uid);

        if (response.data.role === "admin") {
          navigate("/admin/reservas");
        } else {
          navigate("/user/profile");
        }
      }
    } catch (error) {
      console.error("Error al verificar usuario:", error);
      Swal.fire("Error", "No se pudo verificar el usuario", "error");
    }
  };

  // Actualiza handleGoogleLogin
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleLogin(result.user);
    } catch (error) {
      Swal.fire("Error al iniciar sesión con Google", error.message, "error");
    }
  };

  // Actualiza handleEmailLogin
  const handleEmailLogin = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await handleLogin(result.user);
    } catch (error) {
      Swal.fire("Error al iniciar sesión", error.message, "error");
    }
  };

  // Manejo de registro con email
  const handleEmailSignUp = async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(result.user, { displayName });
      await handleLogin(result.user);
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
      clearCart();
      Swal.fire("Sesión cerrada exitosamente", "", "success");
      navigate("/"); // Redirige al Home
    } catch (error) {
      Swal.fire("Error al cerrar sesión", error.message, "error");
    }
  };

  // Memorizar el renderizado de la navbar
  const renderedNavbar = useMemo(
    () => (
      <nav className="bg-[#f9f3e1] shadow dark:bg-gray-200 sticky top-0 z-50">
        <div className="container flex items-center justify-between px-4 py-2 mx-auto text-gray-900 capitalize dark:text-gray-300">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img
              src={logoImage}
              alt="logo"
              className="w-36 h-14 object-contain" // Tamaño del logo
            />
          </a>

          {/* Contenido alineado a la derecha */}
          <div className="flex items-center space-x-8">
            {" "}
            {/* Separación más amplia */}
            {/* Botón hamburguesa para mobile */}
            <button
              className="inline-flex items-center p-2 text-gray-800 rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:focus:ring-gray-600"
              aria-label="Toggle navigation"
              onClick={() => {
                const menu = document.querySelector("#mobile-menu");
                menu.classList.toggle("hidden");
              }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
            {/* Menú de navegación */}
            <div
              id="mobile-menu"
              className="hidden md:flex md:items-center space-x-8"
            >
              {/* Mostrar carrito solo si el usuario está logueado */}
              {user && (
                <a
                  href="/user/shopping-cart"
                  className="block md:inline items-center border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500"
                >
                  <ShoppingCartIcon className="w-6 h-6" />
                </a>
              )}

              {/* Mostrar Dashboard solo si el usuario está logueado */}
              {user && (
                <a
                  href={role === "admin" ? "/admin/reservas" : "/user/profile"}
                  className="block md:inline border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-blue-500"
                >
                  Dashboard
                </a>
              )}
            </div>
            {/* Sección de usuario */}
            <div className="relative inline-block text-left">
              {user ? (
                <div className="flex items-center space-x-6">
                  {" "}
                  {/* Más espacio entre elementos */}
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt="Foto de perfil"
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="hidden md:block">
                    Hola, {user.displayName || user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-md hover:from-red-600 hover:to-red-700 hover:shadow-lg transition-all duration-300 ease-in-out"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAuthAlert}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    ),
    [user, role]
  );

  return renderedNavbar;
}
