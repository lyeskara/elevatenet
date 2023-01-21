import React , {useState}from 'react'
import {createUserWithEmailAndPassword} from 'firebase/auth'
import { auth } from '../../firebase.js'



function JoinNow() {
  const [email, setEmail] = new useState("")
  const [password, setPassword] = new useState("")
  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(user);
    } catch (error) {
      console.log(error.message);
    }
  };
 
  return (
    <form >
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
        <button  onClick={register}>Register</button>
</form>
  )
}

export default JoinNow
