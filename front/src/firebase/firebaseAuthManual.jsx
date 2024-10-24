import React, { useState } from "react";
import axios from "axios";
import {
    auth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "../../firebase/confing";
import { updateProfile } from "firebase/auth";

export const signUpWithEmail = async (email, password, displayName) => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;

        await updateProfile(user, { displayName });

        const token = await user.getIdToken();
        const userInfo = {
			Mail: user.email,
			Name: user.displayName, 
			Rol: true
		};
        await sendUserInfotoBackend(userInfo, token);
    } catch (error) {
        console.error("Hubo un error al iniciar sesión con email.", error);
    }
};

export const signInWithEmail = async (email, password) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;
        const token = await user.getIdToken();
        const userInfo = {
            Mail: user.email,
			Name: user.displayName,
			Rol: true
        };
        await sendUserInfotoBackend(userInfo, token);
    } catch (error) {
        if (error.code === "auth/user-disabled") {
            // Si el usuario está desactivado, no continuar con el inicio de sesión
            alert("Esta cuenta está desactivada. Por favor, contacta al administrador.");
            window.location.href = '/';
            return;
		} else {
			console.error("Error signing in with email:", error);
		}
    }
};

const sendUserInfotoBackend = async (userInfo, token) => {
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

const SignUpForm = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [displayName, setDisplayName] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		await signUpWithEmail(email, password, displayName);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<input
				type="text"
				value={displayName}
				onChange={(e) => setDisplayName(e.target.value)}
				placeholder="Nombre de usuario"
				required
				className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300"
			/>
			<input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Email"
				required
				className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300"
			/>
			<input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Contraseña"
				required
				className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300"
			/>
			<button
				type="submit"
				className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				Registrarse
			</button>
		</form>
	);
};

const SignInForm = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		await signInWithEmail(email, password);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Email"
				required
				className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300"
			/>
			<input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Contraseña"
				required
				className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300"
			/>
			<button
				type="submit"
				className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				Iniciar sesión
			</button>
		</form>
	);
};

export { SignUpForm, SignInForm };