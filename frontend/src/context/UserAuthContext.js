import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";
import { browserSessionPersistence } from "firebase/auth";

//ADDING GOOGLE SIGN IN AND SIGN IN WITH REDIRECT TO GOOGLE PAGE
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

export const UserAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null);

  //adding google signin 
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  }
  
  //adding google signup
  const googleSignUp = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  }
  

  function Registration(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  const Login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setPersistence(auth, browserSessionPersistence)
        .then(() => {
          signInWithEmailAndPassword(auth, email, password)
            .then((response) => resolve(response))
            .catch((error) => reject(error));
        })
        .catch((error) => reject(error));
    });
  };

  function logOut() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      return currentuser ? setUser(currentuser) : null;
    });

    return () => unsubscribe();
  }, []);

  const value = { Login, Registration, logOut, googleSignIn, googleSignUp, user};
  return (
    <UserAuthContext.Provider value={value}>
      {" "}
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(UserAuthContext);
}
