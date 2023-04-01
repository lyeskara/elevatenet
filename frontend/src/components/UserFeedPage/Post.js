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
import React, { useEffect, useState } from "react";
import '../../styles/post.css';
import like from '../../images/like.png';
import comment from '../../images/comment.png';
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";


function Post({ user, name, description, message, photo, image, post_id }) {
  // state variables
  const [likes, setLikes] = useState(0);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [comments1, setComments1] = useState([]);


  const postsRef = collection(db, 'user_posts');
  const auth_id = auth.currentUser.uid
  const [post_data, Setpost_data] = useState({
    comments: [],
    likes: [],
    id: "",
    image: "",
    post_text: ""
  });

// function Post({ user,name, description, message, photo,image}) {
// // state variables
// const [likes, setLikes] = useState({});

// const [comments, setComments] = useState([]);
// const [showCommentBox, setShowCommentBox] = useState(false);
// const [commentText, setCommentText] = useState("");

// const handleLike = () => {
//   setLikes((prevLikes) => {
//     if (prevLikes[user]) {
//       // If the user has already liked the post, remove their like
//       const updatedLikes = { ...prevLikes };
//       delete updatedLikes[user];
//       return updatedLikes;
//     } else {
//       // If the user hasn't liked the post, add their like
//       return { ...prevLikes, [user]: true };
//     }
//   });
// };


// const handleCommentButtonClick = () => {
//   setShowCommentBox(!showCommentBox);
// };

  useEffect(()=>{
    getDoc(doc(postsRef, auth_id)).then((responce)=>{
      const posts_data = responce.data().posts
      posts_data.forEach(post => {
        if(post.id == post_id){
          setComments(post.comments)
        }
      });
    })
 },[])
 console.log(comments)
   
  async function handleLike() {
    const posts_data = (await getDoc(doc(postsRef, auth_id))).data().posts
    if (likes === 1) {
      setLikes((prev) => prev - 1);
      for (let i = 0; i < posts_data.length; i++) {
        if (posts_data[i].id === post_id) {
          Setpost_data(posts_data[i])
        }
      }
      if (post_data.likes.includes(auth_id)) {
        post_data.likes = post_data.likes.filter((item) => item !== auth_id)
        console.log(post_data.likes)
      } else {
        console.log("yo")
      }
      for (let i = 0; i < posts_data.length; i++) {
        if (posts_data[i].id === post_id) {
          posts_data[i].likes = post_data.likes
        }
      }
      updateDoc(doc(postsRef, auth_id), { "posts": posts_data })
    } else {
      setLikes(1);
      for (let i = 0; i < posts_data.length; i++) {
        if (posts_data[i].id === post_id) {
          Setpost_data(posts_data[i])
        }
      }
      if (!post_data.likes.includes(auth_id)) {
        post_data.likes.push(auth_id)
      } else {
        console.log("you already liked the post")
      }
      for (let i = 0; i < posts_data.length; i++) {
        if (posts_data[i].id === post_id) {
          posts_data[i].likes = post_data.likes
        }
      }
      updateDoc(doc(postsRef, auth_id), { "posts": posts_data })
    }
  };

const handleImageError = (e) => {
  e.target.classList.add("hidden");
};

  const handleCommentButtonClick = () => {
    setShowCommentBox(!showCommentBox);
  };

  async function handleCommentSubmit(e) {
    e.preventDefault();
    const posts_data = (await getDoc(doc(postsRef, auth_id))).data().posts
    const comment = {
      commenter_id: auth_id,
      comment: commentText,
      timeStamp: new Date().getTime()
    }
    for (let i = 0; i < posts_data.length; i++) {
      if (posts_data[i].id === post_id) {
        Setpost_data(posts_data[i])
      }
    }
      post_data.comments = comments
      post_data.comments.push(comment);
    for (let i = 0; i < posts_data.length; i++) {
        if (posts_data[i].id === post_id) {
          posts_data[i].comments = post_data.comments
        }
      }
      updateDoc(doc(postsRef, auth_id), { "posts": posts_data })
      setCommentText("");

    };
   

  // return (
  //   <div className="post">
  //     <div className="post-header">
  //       <div>
  //         <img src={photo} />
  //         <span className="username-forposts">{name}</span>
  //       </div>

  //       <div className="post-info">

  //         <p>{description}</p>
  //       </div>
  //     </div>
  //     <div className="post-body">
  //       <p>{message}</p>
  //       {image && <img src={image} onError={handleImageError} />}
        
  //     </div>

  //     <div className="post-buttons">
  //       <button onClick={handleLike}>
  //         <img src={like} alt="like" />
  //         <p> {Object.keys(likes).length} Like</p>
  //       </button>
  //       <button onClick={handleCommentButtonClick}>
  //         <img src={comment} alt="comment" />
  //         <p>Comment</p>
  //       </button>
  //     </div>

    return (
      <div className="post">
        <div className="post-header">
          <div>
            <img src={photo} alt={name} />
            <span className="username-forposts">{name}</span>
          </div>

          <div className="post-info">
            <h2>{description}</h2>
            <p>{description}</p>
          </div>
        </div>
        <div className="post-body">
          <p>{message}</p>
          {image && <img src={image} onError={handleImageError}  /> }

        </div>

        <div className="post-buttons">
          <button onClick={handleLike}>
            <img src={like} alt="like" />
            <p> {likes} Like</p>
          </button>
          <button onClick={handleCommentButtonClick}>
            <img src={comment} alt="comment" />
            <p>Comment</p>
          </button>
        </div>

        {showCommentBox && (
          <div className="post-commentBox">
            <form onSubmit={handleCommentSubmit} style={{ display: "flex", alignItems: "center" }}>
              <textarea
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                rows="2"
                style={{ flexGrow: 1 }}
              />
              <button type="submit" style={{ marginLeft: "10px" }}>Post</button>
            </form>
          </div>
        )}

        {comments.map((comment, index) => (
          <div key={index} className="post-comment">
            <strong>{name}</strong>

            <p>{comment.comment}</p>
          </div>
        ))}
      </div>
    );
  }

  export default Post;
