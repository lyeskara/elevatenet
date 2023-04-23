import { useEffect, useState } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import defaultpic from ".././../images/test.gif";
import "../../styles/CompanySearch.css";
import {Card , Button } from "react-bootstrap";
import {
  getDoc,
  query,
  where,
  getDocs,
  setDoc,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { GrMailOption, GrPhone } from "react-icons/gr";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

/** 
   * Function that displays a list of object related to the company name
  */
function CompanySearch() {
  const { result } = useParams();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const { id } = useParams();
  const [follow, setfollow] = useState(false);
  const [followStatus, setFollowStatus] = useState([]);
  const location = useLocation();
  const currId = auth.currentUser.uid;
 
  const connection_requestsReference = collection(db, "connection_requests");
  
  useEffect(() => {
    
    if (location.search !== "") {
      const searchParams = new URLSearchParams(location.search);
      const search = searchParams.get("search");
      console.log("search is: " + search);
      setSearch(search);
      const resultParam = searchParams.get("result");
      setUsers(JSON.parse(decodeURIComponent(resultParam)));
      setFollowStatus(Array(JSON.parse(decodeURIComponent(resultParam)).length).fill(false));
      
    }
  }, [location]);
   //function that handles the following feature, checks if the user is following each other, if not, the connection is added to the database
   const handlefollow = async (user,index) => {
    const authdoc = doc(connection_requestsReference, currId);
    const array = [];
    const followedId = user.id;
    getDocs(connection_requestsReference)
      .then((word) => {
        word.docs.forEach((doc) => {
          array.push(doc.id);
        });
        const condition = array.includes(authdoc.id);
        if (!condition) {
          setDoc(doc(connection_requestsReference, currId), {
            requests: [followedId],
          });
        } else {
          getDoc(authdoc).then((document) => {
            const followedUsers = document.data().requests;
            if (!followedUsers.includes(followedId)) {
              followedUsers.push(followedId);
              return updateDoc(doc(connection_requestsReference, currId), {
                ...document.data(),
                requests: followedUsers,
              }).then(() => {
                const newStatus = [...followStatus];
                newStatus[index] = true;
                setFollowStatus(newStatus);
              });
            } else {
              console.log("already followed!");
            }
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setfollow(true);
  };

  return (
    <>
      <Card className="card">
      <h4 className="requests" >Results for "{search}"</h4>
      </Card>
      <ul className="search-results">
        {users.map((user,index) => (
          <li key={user.id}>
            <div className="search-result">
              <div className="search-pic-container">
                <img
                  className="search-pic"
                  src={user.profilePicUrl || defaultpic}
                  alt={user.firstName}
                />
              </div>
              <div className="user-info">
                <Link to={`/profile/${user.id}`}>
                  <h3>{user.firstName} {user.lastName}</h3>
                </Link>
                <li> {user.bio}</li>
                <li>Work experience at {user.workExperience}</li>
                
              </div>
                <Button className="connect_button" onClick={() => handlefollow(user,index)}>        
                {followStatus[index] ? "Requested" : "Connect"}
                </Button>
               </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default CompanySearch;