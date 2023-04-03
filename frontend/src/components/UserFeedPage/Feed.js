

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
import { getDoc, doc, collection, setDoc, query, onSnapshot, where, getDocs } from 'firebase/firestore';
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
  const [user, SetUser] = useState(null);
  const [user_info, SetUserInfo] = useState([]);
  const [ids, Setid] = useState([])
  // db references
  const currentId = auth.currentUser.uid
  const postRef = collection(db, "user_posts");
  const infoRef = collection(db, 'users_information')
  const connectionsRef = collection(db, 'connection')

  // fetching the posters ids
  useEffect(() => {
    const set = new Set([currentId]);
    getDoc(doc(connectionsRef, currentId)).then((data) => {
      console.log(data.data())
      if(!(data.data()== undefined)){
        const con_ids = data.data().connections;
        con_ids.forEach((id) => {
          set.add(id);
        })
        const post_ids = [...set]
        Setid(post_ids)
      }else{
        Setid(currentId)
      }
    })
  }, []);
  
  useEffect(() => {
    const posts_set = new Set()
    getDocs(postRef).then((posters) => {
      posters.docs.forEach((poster) => {
        if ((ids.includes(poster.id))) {
          poster.data().posts.forEach((post) => {
            posts_set.add({post:post,poster_id:poster.id})
          })
        }
        console.log(posts_set)
        const array = [...posts_set]
        SetData(array)
      })
    });
  }, [ids])


  let obj = {
    profile_picture: "",
    first_name: "",
    last_name: "",
    id:""
  }
  useEffect(() => {
    const set = new Set()
    getDocs(infoRef).then((posters)=>{
     posters.docs.forEach((poster)=>{
      if(ids.includes(poster.id)){
        const { profilePicUrl, firstName, lastName } = poster.data()
        obj = {
          profile_picture: profilePicUrl,
          first_name: firstName,
          last_name: lastName,
          id:poster.id
        }
        set.add(obj);
      }
      const array = [...set]
      SetUserInfo(array)
     })
    })
  }
    , [ids])

  for(let i = 0; i < Data.length; i++){
    for(let j = 0; j< user_info.length;j++){
      if (Data[i].poster_id === user_info[j].id) {
        Data[i].user_info = user_info[j];
      }
    }
  }

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

      {Data.map(obj => (
        <Post
          id={obj.poster_id}
          post_id={obj.post.id}
          key={obj.post.title}
          photo={obj.user_info.profile_picture}
          name={obj.user_info.first_name + obj.user_info.last_name}
          message={obj.post.post_text}
          image={obj.post.image}
        />
      ))}

    </div>
  );
}

export default Feed;
