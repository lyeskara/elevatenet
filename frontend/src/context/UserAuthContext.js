import { createContext, useContext, useEffect,useState } from 'react';
import { createUserWithEmailAndPassword,
          signInWithEmailAndPassword,
          signOut,
          onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';


const UserAuthContext = createContext();
  
export function UserAuthContextProvider({children}){
   const [user,setUser] = useState("");
   function Registration(email,password){
    return createUserWithEmailAndPassword(auth,email,password);
   }
   function Login(email,password){
    return signInWithEmailAndPassword(auth,email,password);
   }
   useEffect(()=>{
      const unsubscribe = onAuthStateChanged(auth, (current_user)=>{
                 setUser(current_user);
       })
       return ()=>{
        unsubscribe();
       }
   },[])

   const value = {user,Login,Registration}
   return<UserAuthContext.Provider value={value}> {children}</UserAuthContext.Provider>
}

export function useUserAuth(){
  return useContext(UserAuthContext);
}
