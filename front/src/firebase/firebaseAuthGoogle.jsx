import { auth, provider } from "./config";
import { signInWithPopup, updateProfile } from "firebase/auth";
import api from "../config/axios";

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await updateProfile(user, { displayName: user.displayName });
    const token = await user.getIdToken();
    const userInfo = {
      Mail: user.email,
      Name: user.displayName,
      Rol: true,
    };

    console.log("Información de usuario (Google):", userInfo);
    console.log("Token de autenticación:", token);

    console.log("Información de usuario (Google) a enviar:", userInfo); // Log antes de enviar
    await sendUserInfoToBackend(userInfo, token);

    console.log("Enviando información de inicio de sesión:", userInfo);
    return user; // Retorna el usuario autenticado
  } catch (error) {
    console.error("Error en la autenticación:", error);
    throw error;
  }
};

const sendUserInfoToBackend = async (userInfo, token) => {
  try {
    console.log("Enviando información al backend con el token:", token);
    const response = await api.post("/user/", userInfo, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Respuesta del backend:", response.data); // Log de la respuesta
  } catch (error) {
    console.error("Error sending user info to backend:", error);
    alert("Hubo un error al enviar la información del usuario al servidor.");
  }
};

const SignInButton = () => (
  <div className="flex flex-col items-center text-center">
    <button
      onClick={signInWithGoogle}
      className="flex flex-col items-center text-center mt-8 mb-5 justify-center space-y-2 p-4 bg-white dark:bg-gray-800 rounded-md shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="48"
        height="48"
        viewBox="0 0 48a48"
      >
        <path
          fill="#FFC107"
          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C30.869,3.48,27.02,1,24,1C10.745,1,0,11.745,0,25s10.745,24,24,24c13.25,0,24-10.745,24-24C48,24.126,46.974,22.158,45.343,20.837C44.928,20.6,44.327,20.083,43.611,20.083z"
        />
      </svg>
      <span className="text-gray-900 dark:text-gray-100">
        Iniciar sesión con Google
      </span>
    </button>
  </div>
);

export { SignInButton };
