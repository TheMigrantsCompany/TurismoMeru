import React, { useState, useEffect, useMemo } from "react";
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
import { motion } from "framer-motion";

export default function StickyNavbar() {
  const [user, setUser] = useState(null);
  const { clearCart, setUserId } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Intentamos recuperar el usuario desde localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUserId(parsedUser.uid); // Sincronizamos el UUID del carrito con el localStorage
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUserId(currentUser.uid); // Vinculamos el UID del usuario al carrito
        localStorage.setItem("user", JSON.stringify(currentUser)); // Guardamos al usuario en localStorage
      } else {
        setUser(null);
        setUserId(null); // Limpiamos el UUID del carrito
        clearCart(); // Limpia el carrito cuando no hay usuario
        localStorage.removeItem("user"); // Si no hay usuario, lo eliminamos del localStorage
        localStorage.removeItem("uuid"); // También eliminamos el UUID
      }
      //console.log("Estado de autenticación cambiado:", currentUser);
    });

    return () => unsubscribe();
  }, [setUserId, clearCart]); // Incluimos setUserId y clearCart en las dependencias

  const saveUserToBackend = async (userData, password, navigate) => {
    try {
      if (!userData)
        throw new Error("No se pudo obtener los datos del usuario.");

      const token = await userData.getIdToken();
      if (!token)
        throw new Error("No se pudo obtener el token de autenticación.");

      const response = await axios.post(
        "http://localhost:3001/user/",
        {
          name: userData.displayName || userData.name || "",
          email: userData.email,
          image: userData.photoURL || "",
          active: true,
          password,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { id_User, role } = response.data;
      localStorage.setItem("uuid", id_User);
      localStorage.setItem("role", role); // Guarda el rol en localStorage

      console.log("Usuario registrado con UUID:", id_User);

      setUserId(userData.uid); // Vincular UID al carrito

      // Redirigir según el rol
      if (role === "admin") {
        navigate("/admin/reservas"); // Redirige al dashboard de admin
      } else {
        navigate("/user/profile"); // Redirige al dashboard de usuario
      }
    } catch (error) {
      console.error("Error al guardar el usuario en el backend:", error);
      Swal.fire("Error al guardar usuario", error.message, "error");
    }
  };

  // Actualiza handleGoogleLogin y handleEmailLogin para pasar navigate
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await saveUserToBackend(result.user, null, navigate); // Pasa navigate como argumento
      Swal.fire("Inicio de sesión con Google exitoso", "", "success");
    } catch (error) {
      Swal.fire("Error al iniciar sesión con Google", error.message, "error");
    }
  };

  const handleEmailLogin = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await saveUserToBackend(result.user, password, navigate); // Pasa navigate como argumento
      Swal.fire("Inicio de sesión exitoso", "", "success");
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
      await saveUserToBackend(result.user, password, navigate); // Pasa navigate aquí
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
      <nav className="bg-[#f9f3e1] shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-2">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Ahora más a la izquierda */}
            <div className="flex-shrink-0 -ml-12">
              <a href="/" className="flex items-center">
                <img
                  src={logoImage}
                  alt="logo"
                  className="w-36 h-14 object-contain"
                />
              </a>
            </div>

            {/* Contenido alineado a la derecha */}
            <div className="flex items-center space-x-8">
              {/* Botón hamburguesa para mobile */}
              <button
                className="inline-flex items-center p-2 text-[#4256a6] rounded-lg md:hidden hover:bg-[#dac9aa]/20 transition-all duration-300"
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
                    className="flex items-center text-[#4256a6] hover:text-[#2a3875] transition-all duration-300"
                  >
                    <ShoppingCartIcon className="w-6 h-6" />
                  </a>
                )}

                {/* Mostrar Dashboard solo si el usuario está logueado */}
                {user && (
                  <a
                    href={localStorage.getItem("role") === "admin" ? "/admin/reservas" : "/user"}
                    className="text-[#4256a6] hover:text-[#2a3875] transition-all duration-300 font-poppins text-lg"
                  >
                    Dashboard
                  </a>
                )}
              </div>

              {/* Sección de usuario */}
              <div className="relative inline-block">
                {user ? (
                  <div className="flex items-center space-x-6">
                    {user.photoURL && (
                      <img
                        src={user.photoURL}
                        alt="Perfil"
                        className="w-10 h-10 rounded-full border-2 border-[#4256a6]"
                      />
                    )}
                    <span className="hidden md:block text-[#4256a6] font-poppins">
                      Hola, {user.displayName || user.email}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLogout}
                      className="px-5 py-2.5 bg-[#4256a6] text-white rounded-lg hover:bg-[#2a3875] transition-all duration-300 font-poppins shadow-md hover:shadow-lg"
                    >
                      Cerrar Sesión
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAuthAlert}
                    className="px-5 py-2.5 bg-[#4256a6] text-white rounded-lg hover:bg-[#2a3875] transition-all duration-300 font-poppins shadow-md hover:shadow-lg"
                  >
                    Iniciar Sesión
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    ),
    [user]
  );

  return renderedNavbar;
}