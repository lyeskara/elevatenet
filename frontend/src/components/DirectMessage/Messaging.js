import React, { useState, useRef, useEffect } from 'react';
import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy, where } from 'firebase/firestore';
import { auth } from "../../firebase";
import { db } from '../../firebase';
import "../../styles/Messaging.css";


// useState is used to update the messages with the most recent one
// message parameter is the message that has been recently inputed by the user
// messages contains an array of messages that has been sent so far
//useRef fetches inputed value
const Message = () => 
{
  const currentUser = auth.currentUser;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messageRef = useRef();
  const messagesRef = collection(db, 'messages');
  const [recipientId, setRecipientId] = useState(null);

// Fetch old messages from Firestore and sort them by date when the component mounts
//useEffect function is used to get previous messages and sort them by date (newest to oldest) 
//query function is used to retrieve data from Cloud Firestore
//onSnapshot is a function that listens for the latest data in real-time, which in this case updates the array of messages
//const unsubscribe prevents memory leaks of data when Firebase is not used
  useEffect(() => {
    const senderId = currentUser.uid;
    console.log('Recipient ID:', recipientId);
    if( recipientId !== null){
    const q = query(messagesRef,
       where ('sender', '==', senderId), 
       where ('recipient', '==', recipientId), 
       orderBy('createdAt'));
    console.log(' query:', q);
    console.log(' senderid:', senderId);
    console.log(' recipientId:', recipientId);


    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesArray = [];
      querySnapshot.forEach((doc) => {
        messagesArray.push(doc.data());
      });
      setMessages(messagesArray);
    });
    return unsubscribe;
  }}, [recipientId]);

// handleSubmit function creates a message object using the messageRef and serverTimestamp and send it to Firebase using the addDoc function

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      text: messageRef.current.value,
      createdAt: serverTimestamp(),
      sender:currentUser.uid,
      recipient:"WpubLzGEbHbgXhx4Bj1Bdh6mklg1"//leon
      
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
  };//map iterate through the array

  const handlePersonClick = (e) => {
    e.preventDefault();
    const recipientId = e.target.getAttribute('data-recipient-id');
    setRecipientId(recipientId);
  };
  
  return (
    
    <>
    <div className="container">
      <div className="chat-list">
      <h2>Chat List</h2>

        <ul>
          <li>Person 1:<a href="" onClick={handlePersonClick} data-recipient-id="WpubLzGEbHbgXhx4Bj1Bdh6mklg1"> WpubLzGEbHbgXhx4Bj1Bdh6mklg1</a></li>{/*leon*/}
          <li>Person 2:<a href="" onClick={handlePersonClick} data-recipient-id="v7nXsR4QSiUi5fLgapTsXtmJOF62">v7nXsR4QSiUi5fLgapTsXtmJOF62</a></li>{/*fatema*/}
          <li>Person 3:<a href="" onClick={handlePersonClick} data-recipient-id="5XAWmTROsXdhyqsqClXpfnXPIXm1">5XAWmTROsXdhyqsqClXpfnXPIXm1</a></li>{/*alan*/}
        </ul>
      </div>
    

      <h2>Messages</h2>
      <div className="messages">
      <div className='text'>
      {messages.map((msg, index) => (
        <p key={index}>{msg.text}</p>
      ))}
      </div>
      <form onSubmit={handleSubmit} className="button">
        <input
          type="text"
          value={message}
          onChange={handleMessageChange}
          ref={messageRef}
          placeholder="Enter Message..."
        />
        <button type="submit">Send</button>
      </form>
      
      
      </div>
      </div>
    </>
  );
};

export default Message;