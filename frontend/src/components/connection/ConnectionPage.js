import { collection, doc, getDoc,updateDoc } from 'firebase/firestore';
import {useEffect,useState} from 'react'
import { auth, db } from '../../firebase';

function ConnectionPage() {
  
    const [connections,Setconnections] = useState([]);
    const [ids, Setids] = useState([]);
    const authUserId = auth.currentUser.uid
    const colRef = collection(db,'connection');
    const userRef = collection(db,'users_information')
    console.log(connections)
    useEffect(  ()=>{
        getDoc(doc(colRef,authUserId)).then((connection)=>{
        Setids(connection.data().connections )
        console.log(ids)
      })
    },[])
    useEffect(  ()=>{
         ids.forEach(id => {
            getDoc(doc(userRef,id)).then((user)=>{
                const {firstName,lastName} = user.data();
                const id = user.id
                if (!connections.find((user1) => user1.firstName === firstName && user1.lastName === lastName)) {
                   Setconnections((prevData) => [...prevData, { id,firstName, lastName }]);
               }
            }).catch((error)=>{
                console.log(error)
            })
        });
    },[ids])
  

    function handle(userId){
    getDoc(doc(colRef,userId)).then((user)=>{
        if(user.exists()){
            const userArray = user.data().connections
            const filteredArray = userArray.filter((id)=> id !== authUserId)
            console.log(filteredArray)
            updateDoc(doc(colRef,userId), {...user.data(), connections: filteredArray} )

        }
    });
    getDoc(doc(colRef,authUserId)).then((user)=>{
        if(user.exists()){
            const userArray = user.data().connections
            const filteredArray = userArray.filter((id)=> id !== userId)
            console.log(filteredArray)
            updateDoc(doc(colRef,authUserId), {...user.data(), connections: filteredArray} );
        }
    });
    Setconnections(connections.filter((element)=>element.id !== userId))

    }
  return (
    <div>
    {connections.map((user) => (
      <div key={user.id}>
        <p>{user.firstName} {user.lastName}</p>
        <button onClick={()=>{handle(user.id)}}>delete connection</button>
      </div>

    ))}
  </div>
  )
}

export default ConnectionPage
