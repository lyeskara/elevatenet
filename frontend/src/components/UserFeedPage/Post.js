/**
 * Post component
 * @param {Object} props - Contains the properties passed to this component.
 * @param {string} props.user - User id.
 * @param {string} props.name - User name.
 * @param {string} props.description - Post description.
 * @param {string} props.message - Post message.
 * @param {string} props.photo - User profile photo URL.
 * @param {string} props.image - Post image URL.
 *
 * @returns {JSX.Element} A rendered Post component.
 */
import React, { useState } from "react";
import '../../styles/post.css';
import like from '../../images/like.png';
import comment from '../../images/comment.png';


function Post({ user,name, description, message, photo,image}) {
// state variables
const [likes, setLikes] = useState({});

const [comments, setComments] = useState([]);
const [showCommentBox, setShowCommentBox] = useState(false);
const [commentText, setCommentText] = useState("");

const handleLike = () => {
  setLikes((prevLikes) => {
    if (prevLikes[user]) {
      // If the user has already liked the post, remove their like
      const updatedLikes = { ...prevLikes };
      delete updatedLikes[user];
      return updatedLikes;
    } else {
      // If the user hasn't liked the post, add their like
      return { ...prevLikes, [user]: true };
    }
  });
};


const handleCommentButtonClick = () => {
  setShowCommentBox(!showCommentBox);
};

const handleCommentSubmit = (e) => {
  e.preventDefault();
  setComments([...comments, commentText]);
  setCommentText("");
};

const handleImageError = (e) => {
  e.target.classList.add("hidden");
};

  return (
    <div className="post">
      <div className="post-header">
        <div>
          <img src={photo} />
          <span className="username-forposts">{name}</span>
        </div>

        <div className="post-info">

          <p>{description}</p>
        </div>
      </div>
      <div className="post-body">
        <p>{message}</p>
        {image && <img src={image} onError={handleImageError} />}
        
      </div>

      <div className="post-buttons">
        <button onClick={handleLike}>
          <img src={like} alt="like" />
          <p> {Object.keys(likes).length} Like</p>
        </button>
        <button onClick={handleCommentButtonClick}>
          <img src={comment} alt="comment" />
          <p>Comment</p>
        </button>
      </div>

      {showCommentBox && (
        <div className="post-commentBox">
          <form onSubmit={handleCommentSubmit}style={{ display: "flex", alignItems: "center" }}>
            <textarea
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              rows="2"
              style={{ flexGrow: 1 }} 
            />
            <button type="submit"style={{ marginLeft: "10px" }}>Post</button>
          </form>
        </div>
      )}

      {comments.map((comment, index) => (
        <div key={index} className="post-comment">
         <strong>{name}</strong>

          <p>{comment}</p>
        </div>
      ))}
    </div>
  );
}

export default Post;


