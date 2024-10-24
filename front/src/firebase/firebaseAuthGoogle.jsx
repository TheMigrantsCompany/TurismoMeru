import { auth, googleProvider } from "../../firebase/confing";
import { signInWithPopup, updateProfile } from 'firebase/auth';
import axios from 'axios';

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        await updateProfile(user, { displayName: user.displayName });
        const token = await user.getIdToken();
        const userInfo = { 
            Mail: user.email, 
            Name: user.displayName, 
            Rol: true 
        };
        await sendUserInfoToBackend(userInfo, token);
        return user;  // Retorna el usuario autenticado
    } catch (error) {
        console.error('Error signing up with email:', error);
        throw error;  // Asegúrate de propagar el error para manejarlo en el componente
    }
};

const sendUserInfoToBackend = async (userInfo, token) => {
  try {
    await axios.post("https://lubricentro.onrender.com/users", userInfo, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error("Error sending user info to backend:", error);
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
				viewBox="0 0 48 48"
			>
				<path
					fill="#FFC107"
					d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
				></path>
				<path
					fill="#FF3D00"
					d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
				></path>
				<path
					fill="#4CAF50"
					d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
				></path>
				<path
					fill="#1976D2"
					d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
				></path>
			</svg>
			<span className="text-gray-700 dark:text-gray-300">
				Iniciar sesión con Google
			</span>
		</button>
	</div>
);

export default SignInButton;
