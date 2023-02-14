//Uncomment code to use these imports

// import { collection, doc, onSnapshot } from 'firebase/firestore';
// import { auth, db } from '../../firebase';
//import React, { useState, useEffect } from 'react';
import React, { useState} from 'react';

const Message = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  //Uncomment code to use Firebase function (must uncomment imports first) like onSnapshot

  // useEffect(() => {
  //   const messagesRef = collection(db, "messages");
  //   const userDocRef = doc(messagesRef, auth.currentUser.uid);

  //   // Listen for updates to the user's messages
  //   const unsubscribe = onSnapshot(userDocRef, (doc) => {
  //     if (doc.exists()) {
  //       setMessages(doc.data().messages);
  //     }
  //   });

  //   // Unsubscribe from real-time updates when the component unmounts
  //   return unsubscribe;
  // }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    //Uncomment code to use Firebase db (must uncomment import first)

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