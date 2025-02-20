import { createContext, useContext } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDKhIlfVR4Ej3maTgmY-f8Tz6hx63cfwQg",
    authDomain: "meruvyt.firebaseapp.com",
    projectId: "meruvyt",
    storageBucket: "meruvyt.appspot.com",
    messagingSenderId: "549392748184",
    appId: "1:549392748184:web:b96b5dacbf3a01de7e0aed"
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