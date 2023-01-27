import { useNavigate,  } from "react-router-dom";
import { useUserAuth } from "./UserAuthContext";

function Protection({ children}) {
 
  const {user} = useUserAuth();
  const navigate = useNavigate();

  return (user) ? children : navigate('/');
};




export default Protection;
