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
  
  const createPost =  async () => {
    const imageRef = ref(storage, `images/${ v4() + Picture}`);
    await uploadBytes(imageRef,Picture).then((word)=>{
         getDownloadURL(word.ref).then((url)=>{
            SetPicUrl(url)
            console.log(PicUrl)
         })
     })
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
    setPicture(event.target.files[0]);
  };
  return (
    <div>
      <div >
        <h1>Create A Post</h1>
        <div >
          <label> Title:</label>
          <input
            placeholder="Title..."
            id="title"
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </div>
        <div >
          <label> Post:</label>
          <textarea
            placeholder="Post..."
            id="post"
            onChange={(event) => {
              setPostText(event.target.value);
            }}
          />
        </div>
        <div>
        <label> Picture: </label>
        <input type="file" id="file" onChange={handlePictureChange} />
        </div>


        <button onClick={createPost}> Submit Post</button>
      </div>
    </div>
  );
}

export default CreatPost;