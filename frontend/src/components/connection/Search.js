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

import { useEffect, useState } from "react";
import { getDocs, query, where, collection } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useNavigate, Link, useParams } from "react-router-dom";
import { async } from "@firebase/util";
import defaultpic from ".././../images/test.gif";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

function Search() {
  const [search, Setsearch] = useState("");
  const [Result, SetResult] = useState([]);
  const navigate = useNavigate();
  const [url, setUrl] = useState(null);
  const [profilePicURL, setProfilePicURL] = useState("");
  const storage = getStorage();

  useEffect(() => {
    async function getResult() {
      if (search !== "") {
        const usersRef = collection(db, "users_information");
        const q = query(usersRef, where("firstName", "==", search));
        const querySnapShot = await getDocs(q);
  
        // Fetch profile picture URLs for each user
        const promises = querySnapShot.docs.map(async (doc) => {
          const userId = doc.id;
          const profilePicRef = ref(storage, `users/${userId}/profile-pic.jpg`);
          try {
            const profilePicUrl = await getDownloadURL(profilePicRef);
            return { ...doc.data(), id: doc.id, profilePicUrl };
          } catch (error) {
            // If there is no profile picture for the user, use a default image
            return { ...doc.data(), id: doc.id, profilePicUrl: defaultpic };
          }
        });
  
        // Wait for all promises to resolve
        const users = await Promise.all(promises);
  
        SetResult(users);
      } else {
        SetResult([]);
      }
    }
    getResult();
  }, [search]);

  useEffect(() => {
    if (url) {
      if (url == auth.currentUser.uid) {
        navigate("/profile");
      } else {
        navigate(`/profile/${url}`);
      }
    }
  }, [url]);

  function handleClick(id) {
    Setsearch("");
    setUrl(id);
  }

  return (
    <>
      <form className="search_bar">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            Setsearch(e.target.value);
          }}
        />
      </form>
      <ul>
        {Result.map((user) => (
          <li className="off_point mt-2" key={user.id}>
            <div className="containRequest">
              <img
                src={user.profilePicURL || defaultpic}
                className="search_pic"
                alt={user.firstName}
              />
              <p
                onClick={() => {
                  handleClick(user.id);
                }}
              >
                {user.firstName} {user.lastName}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Search;