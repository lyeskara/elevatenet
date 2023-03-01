import { useEffect } from "react";
import { useNavigate,  } from "react-router-dom";
import { useUserAuth } from "./UserAuthContext";

function Protection({ children}) {
 
  const {user} = useUserAuth();
  const navigate = useNavigate();
 
 useEffect(()=>{
  if(user){
    return children
  }else{
    navigate('/');
  }
 },[])
  
};


export default Protection;
