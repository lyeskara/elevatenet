import {React,useState,useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {getDoc,query,where,getDocs, setDoc,collection,doc,updateDoc, documentId} from 'firebase/firestore';
import { auth, db } from '../../firebase';
function OtherUsersProfile() {
  
  const [follow,setfollow] = useState(false)
  const {id} = useParams();
  const [user, setUser] =useState({})
  const currId = auth.currentUser.uid
  const followedId = id

  const handlefollow = ()=>{

    const followRef = collection(db,'follows')
    const authdoc = getDoc(doc(followRef,currId)).then((word)=>{
      if(word.exists){
        const followedUsers = word.data().followd
        if(!followedUsers.includes(followedId)){
          followedUsers.push(followedId)
          return updateDoc(doc(followRef, currId), {...word.data(), followd: followedUsers})
        }
      }else{
        return updateDoc(doc(followRef, currId), {followd:[followedId]});
      }
    }).catch((error)=>{
        console.log(error);
    })
    setfollow(true);
    }
  
  
   
  
  const handleunfollow = ()=>{
    const followRef = collection(db,'follows')
    const authdoc = getDoc(doc(followRef,currId)).then((word)=>{
      if(word.exists){
        const followedUsers = word.data().followd
        console.log(followedUsers)
        if(followedUsers.includes(followedId)){
          const updatedFollowedUsers = followedUsers.filter(userId => userId !== followedId);
          console.log(updatedFollowedUsers)
          return updateDoc(doc(followRef, currId), {...word.data(), followd: updatedFollowedUsers})
        }
      }
    }).catch((error)=>{
         console.log(error);
    })

    setfollow(false);
  }
 
  useEffect(
    ()=>{
          async function getData(){
             await getDoc(doc(collection(db, "users_information"),id))
              .then((doc)=>{
                   if(doc.exists){
                      setUser({...doc.data(), id: doc.id });
                   }else{
                      console.log("error")
                   }
              }).catch((error) => {
                  console.log(error);
                });            
             }
             return ()=>{
              getData(); 
             }
            }
     ,  [id])

  
    
return (
  <>
{currId !== id ? 
  !follow ? (
    <>
      <button onClick={handlefollow}>Follow</button>
      {informations(user)}
    </>
  ) : (
    <>
      <button onClick={handleunfollow}>Unfollow</button>
      {informations(user)}
    </>
  ) : (
    informations(user)
  )
}

    </>
)
}

function informations(user){
  return (
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
  )
}




export default OtherUsersProfile
