import { createContext, useContext } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDbEYGuefkr4ZP_flHER0OCFbZH8gtU3Rw",
    authDomain: "turismomeru.firebaseapp.com",
    projectId: "turismomeru",
    storageBucket: "turismomeru.appspot.com",
    messagingSenderId: "689519457256",
    appId: "1:689519457256:web:999034d39a78e1abce6a5d",
    measurementId: "G-BL6W7YPEFE"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

const FirebaseContext = createContext({ app, auth, googleProvider });

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
    return (
            <FirebaseContext.Provider value={{ app, auth, googleProvider }}>
                {children}
            </FirebaseContext.Provider>
        );
    };

export { signInWithEmailAndPassword, createUserWithEmailAndPassword };