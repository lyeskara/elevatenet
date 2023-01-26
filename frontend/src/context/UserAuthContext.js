import { createContext, useContext , useEffect, useState} from 'react';
import { createUserWithEmailAndPassword,
          signInWithEmailAndPassword,
          setPersistence,  signOut,onAuthStateChanged

       } from 'firebase/auth';
import { auth } from '../firebase';
import { browserSessionPersistence } from 'firebase/auth';

const UserAuthContext = createContext();
  
export function UserAuthContextProvider({children}){
   const [user,setUser] = useState(null);
   function Registration(email,password){
    return createUserWithEmailAndPassword(auth,email,password);
   }


   const Login = async (email, password) => {
    await setPersistence(auth, browserSessionPersistence).then(() => {
      return signInWithEmailAndPassword(auth, email, password);
    });
  }; 
   
   function logOut() {
      return signOut(auth);
    } 
    
    useEffect(  ()=>{
      const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
       return  (currentuser) ? setUser(currentuser) : null;
       });
   
       return () =>    unsubscribe(); 
   },[])





   const value = {Login,Registration,logOut,user}
   return<UserAuthContext.Provider value={value}> {children}</UserAuthContext.Provider>
}

export function useUserAuth(){
  return useContext(UserAuthContext);
}
