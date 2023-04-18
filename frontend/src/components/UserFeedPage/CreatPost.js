import React, { useState, useEffect, useRef } from "react";
import { setDoc, collection, doc, getDocs, getDoc, updateDoc, query } from "firebase/firestore";
import { db, auth } from "../../firebase";
import '../../styles/createpost.css';
import photo from '../../images/photo.png';
import video from '../../images/video.png';
import eventicon from '../../images/eventicon.png';
import profilephoto from '../../images/profilephoto.png';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../../firebase";
import { v4 } from "uuid";
import { useNavigate } from "react-router-dom";
import generateKey from "../../generateKey";
import { useUserAuth } from '../../context/UserAuthContext';

function CreatPost() {
  // const on info of the connected user
  const { user } = useUserAuth();
  // initializing state for inputs
  const [postText, setPostText] = useState("");
  const [Picture, setPicture] = useState(null);
  const [PicUrl, SetPicUrl] = useState(null);
  const [userInfo, SetUserInfo] = useState(null);
  const [condition, setcondition] = useState(false);
  // reference hook
  const inputRef = useRef();
  // Initialize useNavigate
  const navigate = useNavigate();
  // creating references to database instances
  const currentId = auth.currentUser.uid
  const postsCollectionRef = collection(db, "user_posts");
  const usersRef = collection(db, 'users_information')
  // useEffect which handles storing picture in google storage bucket and converting it to browser url when the Picture state is mutated
  useEffect(() => {
    const imageRef = ref(storage, `images/${v4() + Picture}`);
    uploadBytes(imageRef, Picture).then((word) => {
      getDownloadURL(word.ref).then((url) => {
        SetPicUrl(url)
      })
    })
  }, [Picture])
  let user_info = {
    profile_picture: "",
    first_name: "",
    last_name: ""
  }
  useEffect(() => {
    getDoc(doc(usersRef, currentId)).then((informations) => {
      const { profilePicUrl, firstName, lastName } = informations.data()
      const obj = {
        profile_picture: profilePicUrl,
        first_name: firstName,
        last_name: lastName
      }
      SetUserInfo(obj)
    })
  }
    , [])
  user_info = { ...user_info, ...userInfo };

  const post = {
    post_text: postText,
    image: PicUrl,
    id: generateKey(28),
    likes: [],
    comments: [],
    created_by: user.email
  }

  //function which pushes the data inputed in the form into the collection user-posts under the user id
  async function PostCreation(event) {
    event.preventDefault(); // prevent the form from being submitted
    const posts = await getDocs(postsCollectionRef)
    const auth_doc = await getDoc(doc(postsCollectionRef, currentId));
    if (auth_doc.data() === undefined) {
      setDoc(doc(postsCollectionRef, currentId), { "posts": [post] })
    } else {
      const posts_data = auth_doc.data().posts
      let condition = false
      for (let i = 0; i < posts_data.length; i++) {
        if (posts_data[i].id === post.id) {
          condition = true;
        }
      }
      if (condition) {
        console.log("you have already made a post.")
      } else {
        if ((postText == "") && (Picture == null)) {
          alert("empty fields please write something or put an image")
        } else {
          if (((await getDoc(doc(collection(db, "connection"), currentId))).data()) !== undefined) {
            const connections = (await getDoc(doc(collection(db, "connection"), currentId))).data().connections;
            connections.forEach(id => {
              getDoc(doc(collection(db, "notification_settings"), id)).then((note_data) => {
                if (note_data.data() !== undefined) {
                  if (note_data.data().feed) {
                    getDoc(doc(collection(db, 'Notifications'), id)).then((followed_doc) => {
                      const note = {
                        message: `${user_info.first_name} ${user_info.last_name} has created a new post, go check it out!`,
                        profilePicUrl: user_info.profile_picture,
                        id: generateKey(8),
                        post_id: post.id
                      }
                      if ((followed_doc.data() === undefined) || (followed_doc.data())) {
                        console.log
                        setDoc(doc(collection(db, 'Notifications'), id), { notifications: [note] })
                      } else {
                        const notifications_array = followed_doc.data().notifications;
                        let condition = false
                        notifications_array.forEach((notif) => {
                          if (!(notif.id === note.id)) {
                            condition = true;
                          }
                        })
                        if (condition) {
                          notifications_array.push(note)
                        }
                        console.log(notifications_array)
                        updateDoc(doc(collection(db, 'Notifications'), id), {
                          notifications: notifications_array
                        })
                      }
                    })
                  }
                }
              })
            });
          } else {
            console.log("you have no connections.")
          }


          posts_data.push(post)
          updateDoc(doc(postsCollectionRef, currentId), { "posts": posts_data })
          // Navigate to the feed page
          navigate('/feed')
        }
      }
    }



  };

  // the template for post creation
  return (
    <div className="create-post-container">
      <div className="create-post-header">
        <img src={user_info.profile_picture} alt="profilephoto-icon" className="create-post-profile-photo" />
        <span className="create-post-profile-name">{user_info.first_name} {user_info.last_name}</span>
      </div>
      <form className="create-post-form">
        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="Say something here... "
        />
        {PicUrl && <img src={PicUrl} />}

        <div className="create-post-preview-box" id="preview-box"></div>
        <div className="create-post-options">
          <button >
            <label htmlFor="file" className="create-post-option" >
              <img src={photo} alt="photo" />
              <input
                type="file"
                id="file"
                ref={inputRef}
                onChange={(e) => {
                  const selectedImage = e.target.files[0];
                  setPicture(selectedImage);

                }}
              />
            </label>
          </button>
          <button onClick={() => navigate("/Event")}>
            <img src={eventicon} alt="eventicon" />
          </button>
          <button
            className="btn btn-primary create-post-submit-button"
            style={{ backgroundColor: "#27746a" }}
            onClick={PostCreation}
          >
            Post
          </button>
        </div>

      </form>

    </div>
  );
}

export default CreatPost;


/**
 * 
 *   const AllDocs = (await getDocs(postsCollectionRef)).docs 

    const documentData = (await getDoc(doc(postsCollectionRef, currentId)))
    const array = []
    AllDocs.forEach((doc) => {
      array.push(doc.id);
    })
    const condition = array.includes(currentId)
    console.log(condition)

    let objectsSize = 0;
    if (documentData.data() === undefined) {
      objectsSize = 0;
    } else {
      objectsSize = Object.keys(documentData.data()).length
    }
    const index = objectsSize + 1;
    if (!condition) {
      await setDoc(doc(postsCollectionRef, currentId), {
        [index]: {
          postText,
          PicUrl
        }
      });
    } else {
      const obj = {
        postText,
        PicUrl
      }
      const Posts = documentData.data()
      Posts[index] = obj
      updateDoc(doc(postsCollectionRef, currentId), Posts)
      // Navigate to the feed page
      navigate("/feed");
    }
 */
