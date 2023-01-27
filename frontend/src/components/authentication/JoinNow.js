import React , {useState}from 'react'
import {useNavigate} from 'react-router-dom'
import { useUserAuth } from '../../context/UserAuthContext.js'
import { auth } from '../../firebase.js'
import { collection, setDoc, doc } from 'firebase/firestore'
import { db } from '../../firebase.js'



function JoinNow() {

  const [email, setEmail] = new useState("")
  const [password, setPassword] = new useState("")
  const {Registration} = useUserAuth();
  
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
        e.preventDefault();
    try {
      await Registration(email,password).then(word =>{
        return setDoc(doc(collection(db,'users_information'),auth.currentUser.uid),{  profileImage: '',
        firstName: '',
        lastName: '',
        city: '',
        bio: '',
        workExperience: '',
        education: '',
        skills: '',
        languages: ''})
       })
      navigate("/ProfileForm")
     
    } catch (error) {
      console.log(error.message);
    }
  
  };

      return (
    
    <form  onSubmit={handleSubmit}>
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
        <button type='submit' >Agree & Join</button>
</form>
    
  )
      }


export default JoinNow
