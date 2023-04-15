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
import React, { useEffect, useState, useMemo, useRef } from "react";
import '../../styles/post.css';
import like from '../../images/like.png';
import comment from '../../images/comment.png';
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../../firebase";
import { v4 } from "uuid";

function Post({ name, description, message, photo, image, post_id, id }) {
  // state variables
  const [likes, setLikes] = useState(0);
  const [on, seton] = useState(false)
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [comments1, setComments1] = useState([]);
  const [user, Setuser] = useState([])
  const [extended_comments, Setextend] = useState([]);
  const [isUpdated, setUpdate] = useState(false);
  const [UImage, SetUImage] = useState(null)
  const [Umessage, SetUmessage] = useState(message);
  const inputRef = useRef();
  const [PicUrl, SetPicUrl] = useState(image);
  const [del, Setdel] = useState(false);
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
          if (post.likes.includes(auth_id)) {
            seton(true)
          }
        }
      });
    })
  }, [])

  useEffect(() => {
    let set = new Set()
    comments.forEach((comment) => {
      getDoc(doc(usersRef, comment.commenter_id)).then((commenter) => {
        const { firstName, lastName, profilePicUrl } = commenter.data();
        let commenter_data = {
          full_name: `${firstName} ${lastName}`,
          profile_Picture: profilePicUrl
        }
        const extend = Object.assign({}, comment, commenter_data)
        set.add(extend)
        const array = [...set]
        Setextend(array)
      })
    })
  }, [comments])

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
    setLikes((prev) => prev + 1);
    seton(true)
  };

  async function handleUnlike() {
    const posts_data = (await getDoc(doc(postsRef, poster_id))).data().posts;
    const post_index = posts_data.findIndex(post => post.id === post_id);
    const post = posts_data[post_index];
    console.log(post)
    if (post.likes.includes(auth_id)) {
      post.likes = post.likes.filter((item) => item !== auth_id);
      console.log(post.likes);
    } else {
      console.log("you have not liked the post");
    }

    posts_data[post_index] = post;

    updateDoc(doc(postsRef, poster_id), { "posts": posts_data });
    setLikes(prev => prev - 1);
    seton(false)
  };
  const handleImageError = (e) => {
    e.target.classList.add("hidden");
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

  useEffect(() => {
    if (!(UImage === null)) {
      const imageRef = ref(storage, `Uimages/${v4() + UImage}`);
      uploadBytes(imageRef, UImage).then((word) => {
        getDownloadURL(word.ref).then((url) => {
          SetPicUrl(url)
        })
      })
    }
  }, [UImage])

  function handleCancel() {
    setUpdate(false)
    SetUImage(null)
    SetUmessage(message)
  }
  async function submitForm(e) {
    e.preventDefault();
    const posts_data = (await getDoc(doc(postsRef, poster_id))).data().posts;
    const post_index = posts_data.findIndex(post => post.id === post_id);
    const post = posts_data[post_index];
    post.post_text = Umessage
    post.image = PicUrl
    posts_data[post_index] = post;
    updateDoc(doc(postsRef, poster_id), { "posts": posts_data })
    setUpdate(false);
  }
  async function handleDelete() {
    const posts_data = (await getDoc(doc(postsRef, poster_id))).data().posts;
    const post_index = posts_data.findIndex(post => post.id === post_id);
    const post = posts_data[post_index];
    const posts = posts_data.filter((todelete_post) => todelete_post !== post)
    updateDoc(doc(postsRef, poster_id), { "posts": posts })
    Setdel(true)
  }
  return (

    (del) ?
      (<>
      </>)
      :
      (
        <div className="post">
          {(poster_id === auth_id) ?
            ((isUpdated) ? (
              <>
                <button onClick={handleCancel} >cancel</button>
              </>
            ) :
              (
                <>
                  <button onClick={handleDelete}>delete</button>
                  <button onClick={() => setUpdate(true)}>update</button>
                </>
              )) : (<></>)}

          <div className="post-header">
            <div>
              <img src={photo} alt={name} />
              <span className="username-forposts">{name}</span>
            </div>
          </div>

          {(isUpdated) ?
            (
              <>
                <h2>Edit post</h2>

                <form onSubmit={submitForm}>
                  <textarea
                    onChange={(e) => SetUmessage(e.target.value)}
                    placeholder="Write your post message..."
                    rows="5"
                  />
                  <label htmlFor="file" className="create-post-option" >
                    <img src={image} alt="photo" />
                    <input
                      type="file"
                      id="file"
                      ref={inputRef}
                      onChange={(e) => {
                        const selectedImage = e.target.files[0];
                        SetUImage(selectedImage);
                      }}
                    />
                  </label>
                  <button type="submit">Update</button>
                </form>
              </>
            ) :
            (
              <>
                <div className="post-body">
                  <p>{Umessage} </p>
                  {PicUrl && <img src={PicUrl} onError={handleImageError} />}
                </div>
              </>)}

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

          {extended_comments.map((comment) => (
            <div key={comment.commenter_id} className="post-comment">
              <img src={comment.profile_Picture} alt="like" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
              <strong>{comment.full_name}</strong>

              <p>{comment.comment}</p>
            </div>
          ))}
        </div>
      )

  );

}

export default Post;
//reh