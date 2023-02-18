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
      navigate("/login");
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
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </div>
        <div >
          <label> Post:</label>
          <textarea
            placeholder="Post..."
            onChange={(event) => {
              setPostText(event.target.value);
            }}
          />
        </div>
        <div>
        <label> Picture: </label>
        <input type="file" onChange={handlePictureChange} />
        </div>


        <button onClick={createPost}> Submit Post</button>
      </div>
    </div>
  );
}

export default CreatPost;