import React, { useState } from 'react';
import '../styles/feed.css';
import Post from './Post';
import photo from '../images/photo.png';
import video from '../images/video.png';
import profile1 from '../images/profile1.png';
import post1 from '../images/post1.png';
import eventicon from '../images/eventicon.png';
import personicon from '../images/personicon.png';

function Feed() {
  const [input, setInput] = useState('');
  const posts = [
    {
      id: 1,
      data: {
        name: ' Cloud Fare',
        description: 'Storage Company',
        message: 'Today, we would like to highlight two of the employees promoted respectively to the positions of EMEA Sales Executive and Team Lead in Paris.',
        photo: profile1,
        image: post1 // Add image property here
      }
    }
  ];

  return (
    <div className="feed">
      <div className="feed-inputContainer">
        <div className="feed-input">
         
        <button onClick={() => window.location.href = 'CreatePost'}> 
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

      {posts.map(post => (
        <Post
          key={post.id}
          name={post.data.name}
          description={post.data.description}
          message={post.data.message}
          photo={post.data.photo}
          image={post.data.image} // Pass image property to Post component
        />
      ))}
    </div>
  );
}

export default Feed;
