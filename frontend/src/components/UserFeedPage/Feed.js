/*
 * this file represent the feedpage component
 * in it, React hooks are used. (state to store user data and Effect to update the view accordingly to the model)
 * inside the useEffect an asynchronous function getData is responsible of fetching data from backend and store it in the Data variable
 * after storing the data in Data variable, we will use functional patterns such as map to display the informations stored in the UI
*/


import { useEffect, useState } from 'react';
import { useNavigate , Link} from 'react-router-dom';
import { getDoc,doc, collection, setDoc } from 'firebase/firestore';
import { db,auth } from '../../firebase';


function Feed() {
  const [input, setInput] = useState('');
  const [Data,SetData] = useState([])
  const currentId = auth.currentUser.uid
  const postRef = collection(db, "user_posts")
 
  useEffect(() => {
    async function getData() {
      const document = await getDoc(doc(postRef, currentId));
      const values = document.data();
      const postArray = Object.values(values).map((obj) => {
        return {
          title: obj.title,
          postText: obj.postText,
          PicUrl: obj.PicUrl,
        };
      });
      SetData(postArray);
      console.log(postArray)
    }
    getData();
  }, [currentId, SetData]);

  return (
    <div style={{ display: 'flex', flexDirection:'row', justifyContent: 'center'}}>
    {Data.map((post) => (
      <div key={post.title} style={{ flexDirection:'row', margin: '10px' }}>
        <h2>{post.title}</h2>
        <p>{post.postText}</p>
        {post.PicUrl!==null &&
        <img src={post.PicUrl} alt={post.title} style={{ width: '300px', height: 'auto' }} />
        }
      </div>
    ))}
  </div>
  )
 
}   

export default Feed;