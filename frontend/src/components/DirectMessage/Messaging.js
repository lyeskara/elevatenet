import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import React, { useRef } from 'react';

const Message = () => {
  const messageRef = useRef();
  const ref = collection(db, "messages");
  
  //On send, the msg is sent to firebase
  const handleSubmit = (e) => {
    //to not reload when send is clicked
    e.preventDefault();

    let data = {
        message:messageRef.current.value,
    };
    try{
      addDoc(ref,data)
    }catch(e){
      console.log(e);
    }

  };

  return (
    <div>
      <h2>Messages</h2>
   
      <form onSubmit={handleSubmit}>
        <label>Write a message...</label>
        <input type="text" 
        //value={message} 
       // onChange={(e) => setMessage(e.target.value)} 
        ref={messageRef}
         />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Message;