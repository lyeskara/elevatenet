import { useNavigate,Route, Await } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
function Protection({ children}) {
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(  ()=>{
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      if(currentuser){
        setAuthenticated(true)
        console.log("Auth", currentuser);
      }else{
        setAuthenticated(false)
      }

     });
 
     return () =>    unsubscribe(); 
 },[])
 
if (authenticated){
  return children;
} else{
   return  navigate('/');
}


};

export default Protection;
