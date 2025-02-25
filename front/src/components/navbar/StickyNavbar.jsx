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
import { useNavigate, Link } from "react-router-dom";
import logoImage from "../../assets/images/logo/logo.jpg";
import { motion } from "framer-motion";
import { AuthContext } from "../../firebase/AuthContext";

export default function StickyNavbar() {
  const { user, role, setAllowHomeNavigation, isUserActive } =
    useContext(AuthContext);
  const { clearCart, setUserId } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

        setUserId(response.data.id_User);
        // Cerrar cualquier SweetAlert abierto
        Swal.close();

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserId(null);
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

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

  const handleLogoClick = () => {
    setAllowHomeNavigation(true);
    navigate("/");
  };

  const renderedNavbar = useMemo(
    () => (
      <nav className="bg-[#f9f3e1] shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" onClick={handleLogoClick} className="flex items-center bg-[#f9f3e1]">
                <img
                  src={logoImage}
                  alt="logo"
                  className="w-36 h-14 object-contain"
                />
              </Link>
            </div>

            {/* Menú de navegación y botones */}
            <div className="flex items-center space-x-8">
              {/* Botón hamburguesa para mobile */}
              <button
                className="inline-flex items-center p-2 text-[#4256a6] rounded-lg md:hidden hover:bg-[#dac9aa]/20 transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">Abrir menú</span>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>

              {/* Menú de navegación */}
              <div
                className={`${
                  isMobileMenuOpen ? "block" : "hidden"
                } md:flex md:items-center space-x-8`}
              >
                {user && isUserActive && (
                  <>
                    {/* Carrito */}
                    <Link
                      to="/user/shopping-cart"
                      className="flex items-center text-[#4256a6] hover:text-[#2a3875] transition-all duration-300"
                    >
                      <ShoppingCartIcon className="w-6 h-6" />
                    </Link>

                    {/* Dashboard */}
                    <Link
                      to={
                        role === "admin" ? "/admin/reservas" : "/user/profile"
                      }
                      className="text-[#4256a6] hover:text-[#2a3875] transition-all duration-300 font-poppins text-lg"
                    >
                      Dashboard
                    </Link>
                  </>
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
    [user, role, isMobileMenuOpen, isUserActive]
  );

  return renderedNavbar;
}
