import { auth, db } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import {useState} from 'react'

function RequestsPage() {
    
   const [Users,SetUsers] = useState([]);
   const currentId = auth.currentUser.uid
   console.log(currentId)
   function getUsers(){
    const  dbRef = collection(db,'connection_requests')
    const q = query(dbRef, where("requests", "array-contains", currentId)
    )
    const allUsers = getDocs(q).then((users)=>{
        console.log(users.data)
    })
   }
   getUsers();
  return (
    <div>
     <h1>hello world</h1> 
    </div>
  )
}

export default RequestsPage
