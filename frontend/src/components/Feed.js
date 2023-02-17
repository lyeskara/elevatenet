import React, { useState } from 'react';
import './styles/Feed.css';
import Post from '../Post/Post';
import photo from '../images/logo.png';
import video from '../images/video.png';
import profile1 from '../images/profile1.png';
import eventicon from '../images/eventicon.png';
import personicon from '../images/personicon.png';
import FlipMove from 'react-flip-move';



function Feed() {
  const [input, setInput] = useState('');
  const posts = [
    { id: 1, data: { name: 'CloudFare', description: 'Storage Company', message: 'Today, we would like to highlight two of the employees promoted respectively to the positions of EMEA Sales Executive and Team Lead in Paris.', photo: profile1 } },   
  ];

  return (
    <div className="feed">
      <div className="feed-inputContainer">
        <div className="feed-input">
          <img src={personicon} alt="person-icon" />

          <form>
            <input value={input} onChange={e => setInput(e.target.value)} type="text" placeholder= "Create a post" />
          </form>

        </div>
        <div className="feed-inputOption">
          <button>
            <img src={photo} alt="photo" />
          </button>

          <button>
            <img src={video} alt="video" />
          </button>

          <button>
            <img src={eventicon} alt="eventicon" />
          </button>
        </div>
      </div>

    
      <FlipMove>
        {posts.map(({ id, data: { name, description, message, photo}}) => (
          <Post 
            key={id}
            name={name}
            description={description}
            message={message}
            photo={photo}
          />
        ))}
      </FlipMove>
    </div>
  );
}

export default Feed;
