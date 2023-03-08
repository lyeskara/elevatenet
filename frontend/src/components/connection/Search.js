/**
 *this file is responsible of handling search functionality
 *first imported files are imported
 *second, variables that handle our inputs are created such as search, result useStates, 
 * the process goes as follows : a user write a firstname, then an event listener (onchange) set the search state into the input
 * then with the name stored a query a preformed to fetch all users with that first name and store results inside result variable.
 * inside the template, we use map to map these results as a user is writing the names, then if a user clicked.
 * we take that user id and pass it into a decorator which handles dynamic routing, later we redirect to that url which will be another component
 * that handles displaying other users info dynamically 
 */
 



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
