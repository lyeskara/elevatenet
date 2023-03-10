/*
 * this file is responsible for user post creation
 * at first, multiple functions, libraries are imported to facilitate our task
 * second, useState is used to declare title,posttext,picture,picurl variables and set to null
 * third, from the backend, the authenticated user and the post collection (table) are initialised inside the file 
 * fourth, a function is created for making post request for adding post documents(columns) into the post collection
 * the process first involved into making the html input tags, attaching event listeners which call the createpost() function 
 * which then will store the title, postText and picture input, for storing the picture inside a NOSQL database, we first worked on 
 * storing the image inside a storage unit in the backend, then these images are converted into browser urls, later we store these urls as strings
 * in the database
 * now into storing the data in the db, we first need to check whether there is a need into creating a new document for this user, if not then we just push additional posts data
 * then data is stored accordingly, if user has a document of posts, then update function is called otherwise setDoc is called
 * as for the user effect its just in case a user logout it will redirect to homepage and deny access to an unauthorized page 
 */



import React, { useState, useEffect } from "react";
import { setDoc, collection,doc, getDocs, getDoc, updateDoc, query } from "firebase/firestore";
import { db,auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import '../../styles/createpost.css';
import photo from '../../images/photo.png';
import video from '../../images/video.png';
import eventicon from '../../images/eventicon.png';
import profilephoto from '../../images/profilephoto.png';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage } from "../../firebase";
import { v4 } from "uuid";

function CreatPost() {

  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [Picture,setPicture] = useState(null); 
  const [PicUrl, SetPicUrl] = useState(null);
  const authUser = auth.currentUser
  const postsCollectionRef = collection(db, "user_posts");
  let navigate = useNavigate();
  
  const createPost = async () => {
    const imageRef = ref(storage, `images/${v4() + Picture.name}`);
    await uploadBytes(imageRef, Picture).then((word) => {
      getDownloadURL(word.ref).then((url) => {
        console.log(PicUrl);
        SetPicUrl(url);
        // Set the text area value to include an HTML img tag with the posted image URL
      setPostText(prevPostText => prevPostText + `<img src="${url}" />`);
      });
    });
    const AllDocs = (await getDocs(postsCollectionRef)).docs
    const documentData = (await getDoc(doc(postsCollectionRef,authUser.uid))).data()
    const array =[] 
    AllDocs.forEach((doc)=>{
      array.push(doc.id);
    })
    const condition = array.includes(authUser.uid)
    console.log(condition)
    const objectsSize = Object.keys(documentData).length
    console.log(objectsSize)
    const index = objectsSize + 1;
    if(!condition){
      await setDoc(doc(postsCollectionRef,authUser.uid), {
        [index]: {
          title, 
          postText,
          PicUrl
        }
      });
    }else{
        documentData[index] =  {
          title, 
          postText,
          PicUrl
        }
        console.log("test")
        await updateDoc(doc(postsCollectionRef,authUser.uid), documentData)
    }
  };
   
  useEffect(() => {
    if (!authUser) {
      navigate("/CreatPost");
    }else{

    }
  }, []);


const handlePictureChange = (event) => {
  const selectedImage = event.target.files[0];

  // Create a new FileReader to read the selected image
  const reader = new FileReader();

  // Set the onload function to update the preview box with the selected image
  reader.onload = (event) => {
    const imageUrl = event.target.result;
    const previewBox = document.getElementById("preview-box");
    const img = document.createElement("img");
    img.src = imageUrl;
    // Add the new image element to the preview box
    previewBox.appendChild(img);
  };
 // Read the selected image as a data URL
  reader.readAsDataURL(selectedImage);
};

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
          <button onClick={() => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = handlePictureChange;
  input.click();
}}>
  <img src={photo} alt="photo" />
</button>

          <button>
            <img src={eventicon} alt="eventicon" />
          </button>
          <button class="transparent-button">
            <img src={video} alt="video" />
          </button>

          <button className="create-post-submit-button" onClick={createPost}>Post</button>
        </div>
      
      </form>
    
    </div>
  );
}

export default CreatPost;