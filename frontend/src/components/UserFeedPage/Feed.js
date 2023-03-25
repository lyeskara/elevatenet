/*
 * this file represent the feedpage component
 * in it, React hooks are used. (state to store user data and Effect to update the view accordingly to the model)
 * inside the useEffect an asynchronous function getData is responsible of fetching data from backend and store it in the Data variable
 * after storing the data in Data variable, we will use functional patterns such as map to display the informations stored in the UI
*/


import { useEffect, useState } from 'react';
import { useNavigate , Link} from 'react-router-dom';
import { getDoc,doc, collection, setDoc } from 'firebase/firestore';
import { db,auth } from '../../firebase';
import '../../styles/feed.css';
import Post from './Post';
import photo from '../../images/photo.png';
import video from '../../images/video.png';
import profile1 from '../../images/profile1.png';
import post1 from '../../images/post1.png';
import eventicon from '../../images/eventicon.png';
import personicon from '../../images/personicon.png';



function Feed() {

  // state variables
  const [input, setInput] = useState('');
  const [Data,SetData] = useState([])
  // db references
  const currentId = auth.currentUser.uid
  const postRef = collection(db, "user_posts")
 // fetching the user posts
  useEffect(() => {
       getDoc(doc(postRef, currentId)).then((posts)=>{
        const values = posts.data();
        const postArray = Object.values(values).map((obj) => {
          return {
            postText: obj.postText,
            PicUrl: obj.PicUrl,
          };
        });
        SetData(postArray);
       })    
  }, []);
 // the templates for markup
  return (
    <div className="feed">
      <div className="feed-inputContainer">
        <div className="feed-input">
         
        <button onClick={() => window.location.href = 'CreatPost'}> 
         <img src={personicon} alt="person-icon" /> 
      </button>
 

          <form class="create-post">
            <input value={input} onChange={e => setInput(e.target.value)} type="text" placeholder="Create a post" />
          </form>
        </div>

        <div className="feedinputOption">
          <button>
            <img src={photo} alt="photo" />
          </button>
          <button>
            <img src={eventicon} alt="eventicon" />
          </button>


          <button>
            <img src={video} alt="video" />
          </button>

          
        </div>
      </div>

      {Data.map(post => (
        <Post
          key={post.title}
          name={post.title}
          description={post.postText}
          message={post.postText}
          image={post.PicUrl} 
        />
      ))}
    </div>
  );
}

export default Feed;
