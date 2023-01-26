import { useNavigate,Route, Await } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
function Protection({ children}) {
  const {user} = useUserAuth();
  const navigate = useNavigate();

  
 
if (user){
  return children;
} else{
   return  navigate('/');
}


};
};

export default Protection;
