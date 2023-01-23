import React , {useState}from 'react'
import { useUserAuth } from '../../context/UserAuthContext.js'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebase.js'


function SignIn() {

  const [email, setEmail] = new useState("")
  const [password, setPassword] = new useState("")
  const {Login} = useUserAuth()
  const navigate = useNavigate()
  
 
 
  const handleSubmit = async (e) => {
        e.preventDefault()
   
      try {
       await Login(email,password);
       navigate("/ProfileForm");
       console.log(Login(email,password));
       
    } catch (error) {
      console.log(error.message);
    }
  
  };
 
      return (
    
    <form  onSubmit={handleSubmit} >
    <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
    </label>
    <br />
    <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
    </label>
    <br />
        <button type='submit'>  Agree & Join</button>
</form>
    
  )
      }


export default SignIn

