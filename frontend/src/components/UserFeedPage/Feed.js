/*
 * this file represent the feedpage component
 * in it, React hooks are used. (state to store user data and Effect to update the view accordingly to the model)
 * inside the useEffect an asynchronous function getData is responsible of fetching data from backend and store it in the Data variable
 * after storing the data in Data variable, we will use functional patterns such as map to display the informations stored in the UI
*/

/**
 * FeedPage component
 * @hook {string} input - Stores the user input for creating a new post.
 * @hook {Array} Data - Stores the fetched data from the backend.
 * @hook {string|null} currentId - Stores the authenticated user's ID or null if the user is not authenticated.
 *
 * @function getData - Asynchronous function used to fetch data from the backend.
 *                     It checks if the user is authenticated, retrieves data from the backend,
 *                     and stores it in the Data state variable.
 *
 * @effect useEffect - React effect that calls the getData function and updates the view
 *                     accordingly when the currentId, SetData, or postRef values change.
 */


import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getDoc, doc, collection, setDoc, query, onSnapshot, where } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import '../../styles/feed.css';
import Post from './Post';
import photo from '../../images/photo.png';
import video from '../../images/video.png';
import profile1 from '../../images/profile1.png';
import post1 from '../../images/post1.png';
import eventicon from '../../images/eventicon.png';
import personicon from '../../images/personicon.png';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";
import { Carousel } from 'react-bootstrap';




function Feed() {

  // state variables
  const [input, setInput] = useState('');
  const [Data, SetData] = useState([]);
  const [user, SetUser] = useState();
  const [userInfo, SetUserInfo] = useState(null);

  // db references
  const currentId = auth.currentUser.uid
  const postRef = collection(db, "user_posts");
  const infoRef = collection(db, 'users_information')
  // fetching the user posts
  useEffect(() => {
    getDoc(doc(postRef, currentId)).then((posts) => {
      const post_Array = posts.data().posts
      SetData(post_Array);
    })
  }, []);
  let user_info = {
    profile_picture: "",
    first_name: "",
    last_name: ""
  }
  useEffect(() => {
    getDoc(doc(infoRef, currentId)).then((informations) => {
      const { profilePicUrl, firstName, lastName } = informations.data()
      const obj = {
        profile_picture: profilePicUrl,
        first_name: firstName,
        last_name: lastName
      }
      SetUserInfo(obj)
    })
  }
    , [])
  user_info = { ...user_info, ...userInfo };

  //having the job postings advertised
  const [postings, setPostings] = useState([]);
  
  useEffect(() => {
    const postingsCollection = collection(db, "posting");
    const q = query(postingsCollection, where("advertise", "in", [true, "on"]));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      const shuffledDocs = docs.sort(() => 0.5 - Math.random());
      const selectedDocs = shuffledDocs.slice(0, 5);
      setPostings(selectedDocs);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // the templates for markup
  return (
    <div className="feed">
      <div className="feed-inputContainer">
        <div className="feed-input">

          <img src={personicon} alt="person-icon" />

          <button class="create-post" onClick={() => (window.location.href = "CreatPost")}>
            Create a post
          </button>
        </div>

        <div className="feedinputOption">



        </div>
      </div>
      <h1>Sponsored</h1>
      <Carousel>
        {postings.map((posting) => (
          <Carousel.Item key={posting.id}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>{posting.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {posting.company}
                </Card.Subtitle>
                <Card.Text>{posting.description}</Card.Text>
                <Card.Text>{posting.skills}</Card.Text>
                <Button variant="primary" style={{ backgroundColor: "#27746A" }}>
                  Apply Now
                </Button>
              </Card.Body>
            </Card>
          </Carousel.Item>
        ))}
      </Carousel>

      {Data.map(post => (
        <Post
          post_id={post.id}
          key={post.title}
          photo={user_info.profile_picture}
          name={user_info.first_name + user_info.last_name}
          message={post.post_text}
          image={post.image}
        />
      ))}
    </div>
  );
}

export default Feed;
