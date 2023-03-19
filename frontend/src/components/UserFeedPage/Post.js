import React from "react";
import '../../styles/post.css';
import like from '../../images/like.png';
import comment from '../../images/comment.png';


function Post({ name, description, message, photo,image}) {
  return (
    <div className="post">
      <div className="post-header">
        <div>
          <img src={photo} alt={name} />
          <span>{name}</span>
        </div>

        <div className="post-info">
          <h2>{name}</h2>
          <p>{description}</p>
        </div>
      </div>
      <div className="post-body">
        <p>{message}</p>
        {image && <img src={image} alt="post-image" />} {/* Render image if it exists */}
        
      </div>

      <div className="post-buttons">
        <button>
          <img src={like} alt="like" />
          <p>Like</p>
        </button>
        <button>
          <img src={comment} alt="comment" />
          <p>Comment</p>
        </button>
      </div>
    </div>
  );
}

export default Post;

