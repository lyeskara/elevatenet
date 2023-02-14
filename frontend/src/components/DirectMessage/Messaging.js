import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import React, { useRef , useState } from 'react';

const Message = () => {

//For sending messages
  const messageRef = useRef();
  const ref = collection(db, "messages");

//For retreving messages
  
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
      {/* <ul>
        {message.map((m, index) => (
          <li key={index}>{m}</li>
        ))}
      </ul> */}
      <form onSubmit={handleSubmit}>
        <label>Write a message...</label>
        <input type="text" 
       
        ref={messageRef}
         />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Message;