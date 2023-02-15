import React, { useState, useRef } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const Message = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messageRef = useRef();
  const ref = collection(db, 'messages');

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      text: messageRef.current.value,
    };
    try {
      addDoc(ref, data);
      setMessages([...messages, messageRef.current.value]); // Add the message to the messages array
      setMessage(''); // Clear the message input after sending the message
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

      {/* Display the messages */}
      {messages.map((msg, index) => (
        <p key={index}>{msg}</p>
      ))}
    </div>
  );
};

export default Message;