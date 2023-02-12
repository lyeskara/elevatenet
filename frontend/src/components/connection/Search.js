import { useEffect, useState } from "react"
import { getDocs, query ,where,collection} from "firebase/firestore"
import { db } from "../../firebase"
import { useNavigate, Link, useParams} from "react-router-dom"
function Search() {
   const [search, Setsearch]= useState("")
   const [Result,SetResult] = useState([])
   const navigate = useNavigate()
  
   useEffect( ()=>{
    async function getResult(){
        const usersRef =  collection(db,"users_information")
        const q = query(usersRef, where("firstName","==",search))
        const querySnapShot = await getDocs(q);
        SetResult(querySnapShot.docs.map(doc =>({ ...doc.data(), id: doc.id })));
    }
     getResult();
   },[search])

   const { id } = useParams();



  return (
    <>
    <form >
    <input type="text" placeholder="Search..." 
           value={search} onChange={(e)=>{ Setsearch(e.target.value) }}
          
           />
  </form>
  <ul>
        {Result.map((user) => (    
          <li key={user.id}>
             <Link 
             to={`/profile/${user.id}`}
             onClick={(e) =>{
              navigate(`/profile/${user.id}`)
              Setsearch("")
            }}
             >
            {user.firstName} {user.lastName}
            </Link>
            </li>
        ))
    }
      </ul>
  </>
  //show list of users, with link to route of each
  )
}

export default Search
