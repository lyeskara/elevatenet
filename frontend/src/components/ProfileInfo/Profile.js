import React, { useEffect, useState } from 'react'
import { collection, getDoc,doc } from 'firebase/firestore'
import { auth, db } from '../../firebase'
import '../../styles/profile.css'
function Profile() {
    const [user, setUser] =useState({})
    useEffect(
        ()=>{
            async function getData(){
               await getDoc(doc(collection(db, "users_information"),auth.currentUser.uid))
                .then((doc)=>{
                    console.log("doc");
                     if(doc.exists){
                        console.log(doc.data + " " );
                        setUser({...doc.data(), id: doc.id });
                     }else{
                        console.log("nikmok")
                     }
                }).catch((error) => {
                    console.log(error);
                  });            
             
               }
               console.log(getData());

               return ()=>{
                getData();
               }
        }
   
      ,  [] )
  return (
    <div>
        <div className="user-profile">
  <h1 className="name">{user.firstName} {user.lastName}</h1>
  <p className="bio">{user.bio}</p>
  <div className="education">
    <h2>Education</h2>
    <ul>
      <li>{user.education}</li>
    </ul>
  </div>
  <div className="work-experience">
    <h2>Work Experience</h2>
    <ul>
      <li> {user.workExperience}</li>
    </ul>
  </div>
  <div className="skills">
    <h2>Skills</h2>
    <ul>
      <li>{user.skills}</li>
    </ul>
  </div>
  <div className="languages">
    <h2>Languages</h2>
    <ul>
      <li>{user.languages}</li>
    </ul>
  </div>
</div>
    </div>
  )
}

export default Profile
