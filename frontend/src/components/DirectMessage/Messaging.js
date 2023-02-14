// Uncomment to implement Firebase
// import { collection,doc } from 'firebase/firestore'
// import { auth, db } from '../../firebase'

import React, { useState } from 'react';
//import { useNavigate } from "react-router-dom";

const Message = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Uncomment to implement Firebase
    // // Reference the "messages" collection and the document for the current user
    // const messagesRef = collection(db, "messages");
    // const userDocRef = doc(messagesRef, auth.currentUser.uid);
  
    // // Write the message to the Firestore database
    // userDocRef.set({
    //   messages: [...messages, message]
    // });
  
    setMessages([...messages, message]);
    setMessage('');
  };

  return (
    <div>
      <h2>Messages</h2>
      <ul>
        {messages.map((m, index) => (
          <li key={index}>{m}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Message;
