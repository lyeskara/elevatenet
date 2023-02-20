import React, { useState, useRef, useEffect } from 'react';
import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

// useState is used to update the messages with the most recent one
// message parameter is the message that has been recently inputed by the user
// messages contains an array of messages that has been sent so far
//useRef fetches inputed value
const Message = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messageRef = useRef();
  const messagesRef = collection(db, 'messages');

// Fetch old messages from Firestore and sort them by date when the component mounts
//useEffect function is used to get previous messages and sort them by date (newest to oldest) 
//query function is used to retrieve data from Cloud Firestore
//onSnapshot is a function that listens for the latest data in real-time, which in this case updates the array of messages
//const unsubscribe prevents memory leaks of data when Firebase is not used
  useEffect(() => {
    const q = query(messagesRef, orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesArray = [];
      querySnapshot.forEach((doc) => {
        messagesArray.push(doc.data());
      });
      setMessages(messagesArray);
    });
    return unsubscribe;
  }, []);

// handleSubmit function creates a message object using the messageRef and serverTimestamp and send it to Firebase using the addDoc function

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      text: messageRef.current.value,
      createdAt: serverTimestamp()
    };
    try {
      addDoc(messagesRef, data);
      setMessages([...messages, data]);
      setMessage('');
    } catch (e) {
      console.log(e);
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  //map iterate through the array
  return (
    <div>
      <h2>Messages</h2>

      <form onSubmit={handleSubmit}>
        <label>Write a message...</label>
        <input
          type="text"
          value={message}
          onChange={handleMessageChange}
          ref={messageRef}
        />
        <button type="submit">Send</button>
      </form>

      {messages.map((msg, index) => (
        <p key={index}>{msg.text}</p>
      ))}
    </div>
  );
};

export default Message;