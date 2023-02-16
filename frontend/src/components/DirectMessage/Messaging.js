import React, { useState, useRef, useEffect } from 'react';
import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

const Message = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messageRef = useRef();
  const messagesRef = collection(db, 'messages');

  // Fetch old messages from Firestore and sort them by date when the component mounts
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