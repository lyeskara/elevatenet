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

  //This function fetches the post information as well as the like and comments
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

  //This function display the comments of the post
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

  //This function handles the like button. A like will increase the count and unliking will decrease the count
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

  //This function handles the unlike button. A like will increase the count and unliking will decrease the count. 
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

  //Function that will update the comment box
  const handleCommentButtonClick = () => {
    setShowCommentBox(!showCommentBox);
  };

  //Function that updates the database of the comment to be displayed
  async function handleCommentSubmit(e) {
    e.preventDefault();
    const commenter = await getDoc(doc(usersRef, auth_id));
    const { firstName, lastName } = commenter.data();
    const commenter_name = `${firstName} ${lastName}`;
    const comment_data = {
      commenter_id: auth_id,
      comment: commentText,
      commenter_name: commenter_name,
    };
    const posts_data = (await getDoc(doc(postsRef, poster_id))).data().posts;
    const post_index = posts_data.findIndex((post) => post.id === post_id);
    const post = posts_data[post_index];
    post.comments.push(comment_data);
    posts_data[post_index] = post;
    await updateDoc(doc(postsRef, poster_id), { "posts": posts_data });
    setComments((prevComments) => [...prevComments, comment_data]);
    setCommentText("");
  }
  

  //Fetch the files
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

  //handle the cancel function will nullify the post
  function handleCancel() {
    setUpdate(false)
    SetUImage(null)
    SetUmessage(message)
  }
  //This function handles submit where the info inputted will be stored into the database.
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

  //function that handles delete of the post. Post is removed from database
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
        <div className="post"  style={{ position: 'relative' }}>
          <div className="post"  style={{ position: 'relative' }}>
            <div className="post-header row">
              <div className="col text-left">
                <img src={photo} alt={name} />
                <span className="username-forposts">{name}</span>
              </div>
              {/* DELETE AND UPDATE BUTTONS */}
              <div className="col-4 d-flex justify-content-end">
                {(poster_id === auth_id) ?
                  ((isUpdated) ? (
                    <button className="btn btn-outline-secondary" onClick={handleCancel}>Cancel</button>
                  ) :
                    (
                      <>
                        <button className="btn btn-outline-danger me-2" onClick={handleDelete}>Delete</button>
                        <button className="btn btn-outline" style={{ borderColor: '#27764A', color: '#27764A' }} onClick={() => setUpdate(true)}>Update</button>
                      </>
                    )) : (<></>)}
              </div>

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
                  <button type="submit" className="btn btn-outline" style={{ borderColor: '#27764A', color: '#27764A' }}>Update</button>
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
          {/*LIKE BUTTON */}
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
          {/* DELETE AND UPDATE BUTTONS */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {(poster_id === auth_id) ?
              ((isUpdated) ? (
                <>
                  <button className="post-update-cancel" onClick={handleCancel} >cancel</button>
                </>
              ) :
                (
                  <>
                    <button className="post-delete"  onClick={handleDelete}>delete</button>
                    <button className="post-update" onClick={() => setUpdate(true)}>update</button>
                  </>
                )) : (<></>)}
          </div>

          {/*COMMENT BOX */}
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
