import { useEffect, useState } from 'react';
import '../../styles/feed.css'
import Post from './Post';
import photo from '../../images/logo.JPG';
import video from '../../images/video.png';
import profile1 from '../../images/profile1.png';
import eventicon from '../..//images/eventicon.png';
import personicon from '../../images/personicon.png';
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
        <img src={post.PicUrl} alt={post.title} style={{ width: '300px', height: 'auto' }} />
      </div>
    ))}
  </div>
  )
 
  
 

 

}   

export default Feed;
