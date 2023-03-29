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

function CreatPost() {

  // initializing state for inputs
  const [postText, setPostText] = useState("");
  const [Picture, setPicture] = useState(null);
  const [PicUrl, SetPicUrl] = useState(null);

  // reference hook
  const inputRef = useRef();
  // Initialize useNavigate
  const navigate = useNavigate();

  // creating references to database instances
  const currentId = auth.currentUser.uid
  const postsCollectionRef = collection(db, "user_posts");
  // useEffect which handles storing picture in google storage bucket and converting it to browser url when the Picture state is mutated
  useEffect(() => {
    const imageRef = ref(storage, `images/${v4() + Picture}`);
    uploadBytes(imageRef, Picture).then((word) => {
      getDownloadURL(word.ref).then((url) => {
        SetPicUrl(url)
        console.log(PicUrl)
      })
    })
  }, [Picture])
  //function which pushes the data inputed in the form into the collection user-posts under the user id
  async function PostCreation(event) {
    event.preventDefault(); // prevent the form from being submitted

    const AllDocs = (await getDocs(postsCollectionRef)).docs 

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
  };

  // the template for post creation
  return (
    <div className="create-post-container">
      <div className="create-post-header">
        <img src={profilephoto} alt="profilephoto-icon" className="create-post-profile-photo" />
        <span className="create-post-profile-name">John Cane</span>
      </div>
      <form className="create-post-form">
        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="Say something here..."
        />
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
          <button>
            <img src={eventicon} alt="eventicon" />
          </button>
          <button class="transparent-button">
            <img src={video} alt="video" />
          </button>

          <button className="create-post-submit-button" onClick={PostCreation}>Post</button>
        </div>

      </form>

    </div>
  );
}

export default CreatPost;