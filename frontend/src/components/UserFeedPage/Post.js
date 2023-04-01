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
import React, { useEffect, useState, useMemo } from "react";
import '../../styles/post.css';
import like from '../../images/like.png';
import comment from '../../images/comment.png';
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";


function Post({ name, description, message, photo, image, post_id, id }) {
  // state variables
  const [likes, setLikes] = useState(0);
  const[on,seton]=useState(false)
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [comments1, setComments1] = useState([]);
  const [user,Setuser] = useState([])
  const poster_id = useMemo(() => {
    return id
  }, [id])
  const auth_id = auth.currentUser.uid
  const postsRef = collection(db, 'user_posts');
  const usersRef = collection(db, "users_information")
  const [post_data, Setpost_data] = useState({
    comments: [],
    likes: [],
    id: "",
    image: "",
    post_text: ""
  });
   
  useEffect(() => {
    getDoc(doc(postsRef, poster_id)).then((responce) => {
      const data = responce.data().posts
      data.forEach(post => {
        if (post.id == post_id) {
          setComments(post.comments)
          setLikes(post.likes.length)
          if(post.likes.includes(auth_id)){
            seton(true)
          }
        }
      });
    })
  }, [])
  

  async function handleLike() {
    const posts_data = (await getDoc(doc(postsRef, poster_id))).data().posts;
    const post_index = posts_data.findIndex(post => post.id === post_id);
    const post = posts_data[post_index];

    if (!post.likes.includes(auth_id)) {
      post.likes.push(auth_id);
    } else {
      console.log("you already liked the post");
    }

    posts_data[post_index] = post;

    updateDoc(doc(postsRef, poster_id), { "posts": posts_data });
    setLikes((prev)=>prev+1);
    seton(true)
  };

  async function handleUnlike() {
    const posts_data = (await getDoc(doc(postsRef, poster_id))).data().posts;
    const post_index = posts_data.findIndex(post => post.id === post_id);
    const post = posts_data[post_index];

    if (post.likes.includes(auth_id)) {
      post.likes = post.likes.filter((item) => item !== auth_id);
      console.log(post.likes);
    } else {
      console.log("you have not liked the post");
    }

    posts_data[post_index] = post;

    updateDoc(doc(postsRef, poster_id), { "posts": posts_data });
    setLikes(prev=>prev-1);
    seton(false)
  };

  const handleCommentButtonClick = () => {
    setShowCommentBox(!showCommentBox);
  };

  async function handleCommentSubmit(e) {
    e.preventDefault();
    const posts_data = (await getDoc(doc(postsRef, poster_id))).data().posts
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
    updateDoc(doc(postsRef, poster_id), { "posts": posts_data })
    setCommentText("");

  };


  return (
    <div className="post">
      <div className="post-header">
        <div>
          <img src={photo} alt={name} />
          <span>{name}</span>
        </div>

        <div className="post-info">
          <h2>{description}</h2>
          <p>{description}</p>
        </div>
      </div>
      <div className="post-body">
        <p>{message}</p>
        {image && <img src={image} alt="post-image" />}

      </div>

      <div className="post-buttons">
        {(on) ? (
          <button onClick={handleUnlike}>
            <img src={like} alt="like" />
            <p> {likes} Unlike</p>
          </button>
        ) : (
          <button onClick={handleLike}>
            <img src={like} alt="like" />
            <p> {likes} Like</p>
          </button>
        )}
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

      {comments.map((comment, commenter_id) => (
        <div key={commenter_id} className="post-comment">
          <strong>{name}</strong>

          <p>{comment.comment}</p>
        </div>
      ))}
    </div>
  );
}

export default Post;
