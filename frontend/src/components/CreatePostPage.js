// import React, { useState } from 'react';
// import '../styles/createpost.css';
// import photo from '../images/photo.png';
// import video from '../images/video.png';
// import eventicon from '../images/eventicon.png';
// import profilephoto from '../images/profilephoto.png';

// function CreatePostPage() {
//   const [input, setInput] = useState('');

//   return (
//     <div className="create-post-container">
//       <div className="create-post-header">
//         <img src={profilephoto} alt="profilephoto-icon" className="create-post-profile-photo" />
//         <span className="create-post-profile-name">John Cane</span>
//       </div>
//       <form className="create-post-form">
//         <textarea
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Say something here..."
//         />
//         <div className="create-post-options">
//           <button>
//             <img src={photo} alt="photo" />
//           </button>
//           <button>
//             <img src={eventicon} alt="eventicon" />
//           </button>
//           <button class="transparent-button">
//   <img src={video} alt="video" />
// </button>

//           <button className="create-post-submit-button">Post</button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default CreatePostPage;
