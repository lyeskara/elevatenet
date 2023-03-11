import React, { useState, useRef, useEffect } from 'react';
import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { auth } from "../../firebase";
import { db } from '../../firebase';
import "../../styles/Messaging.css";

const Message = () => {
  const currentUser = auth.currentUser;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messageRef = useRef();
  const messagesRef = collection(db, 'messages');
  const [recipientId, setRecipientId] = useState(null);
  const [users_information, setUsers] = useState([]);

  useEffect(() => {
    console.log('currentUser',currentUser);
    const unsubscribe = onSnapshot(collection(db, 'users_information'), (snapshot) => {
      const usersArray = [];
      snapshot.forEach((doc) => {
        usersArray.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersArray);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const senderId = currentUser.uid;
    if (recipientId !== null) {
      // Generate a unique conversation ID based on the IDs of the two users
      const conversationId = [senderId, recipientId].sort().join('-');
      const conversationRef = collection(messagesRef, conversationId, 'conversation');
      const q = query(conversationRef, orderBy('createdAt'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messagesArray = [];
        querySnapshot.forEach((doc) => {
          messagesArray.push(doc.data());
        });
        setMessages(messagesArray);
      });
      return unsubscribe;
    }
  }, [currentUser.uid, recipientId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      text: messageRef.current.value,
      createdAt: serverTimestamp(),
      sender: currentUser.uid,
    };
    try {
      // Generate a unique conversation ID based on the IDs of the two users
      const conversationId = [currentUser.uid, recipientId].sort().join('-');
      const conversationRef = collection(messagesRef, conversationId, 'conversation');
      addDoc(conversationRef, data);
      setMessages([...messages, data]);
      setMessage('');
    } catch (e) {
      console.log(e);
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // const handlePersonClick = (e) => {
  //   e.preventDefault();
  //   const recipientId = e.target.getAttribute('data-recipient-id');
  //   setRecipientId(recipientId);
  // };

  return (
    <>
      <div className="container">
      <div className="chat-list">
      <h2>Chat List</h2>
      {users_information.map((user) => (
        user.id !== currentUser.uid && (
          <div key={user.id} className="user-tab" onClick={() => setRecipientId(user.id)}>

          <img src={user.avatarUrl} style={{ marginRight: '20px' }}  />
              <h3>{user.firstName} {user.lastName}</h3>
              
            
          </div>
        )
      ))}
    </div>
        <div className="divider"></div>
        <div className="messages">
          <div className="text">
            <h2>Messages</h2>
            <div style={{ overflowY: 'scroll', height: '300px' }}>
  {messages.map((msg, index) => (
    <p
      key={index}
      // sender and receiver have different background colors
      style={{
        backgroundColor: msg.sender === currentUser.uid ? 'rgb(7, 80, 19)' : 'grey',
        textAlign: msg.sender === currentUser.uid ? 'right' : 'left'
      }}
    >
      {msg.text}
    </p>
  ))}
</div>
            <form onSubmit={handleSubmit}>
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
      </div>
    </>
  );
};

export default Message;
