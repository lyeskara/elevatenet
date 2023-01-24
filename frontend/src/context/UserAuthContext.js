import { createContext, useContext } from 'react';
import { createUserWithEmailAndPassword,
          signInWithEmailAndPassword,
          setPersistence,  signOut,

       } from 'firebase/auth';
import { auth } from '../firebase';
import { browserSessionPersistence } from 'firebase/auth';

const UserAuthContext = createContext();
  
export function UserAuthContextProvider({children}){
   function Registration(email,password){
    return createUserWithEmailAndPassword(auth,email,password);
   }


   function Login(email,password){
      setPersistence(auth, browserSessionPersistence)
      .then(() => {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        return signInWithEmailAndPassword(auth, email, password);
      })
      .catch((error) => {
        // Handle Errors here.
      console.log(error.message);
      });   
   }
   function logOut() {
      return signOut(auth);
    }   





   const value = {Login,Registration,logOut}
   return<UserAuthContext.Provider value={value}> {children}</UserAuthContext.Provider>
}

export function useUserAuth(){
  return useContext(UserAuthContext);
}
