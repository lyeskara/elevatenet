//import { useUserAuth } from '../../context/UserAuthContext';
//import { auth, db } from '../../firebase';
//import { collection, setDoc ,doc} from 'firebase/firestore';

import React, { useState } from 'react';
//import { useNavigate } from "react-router-dom";

const Message = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
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
