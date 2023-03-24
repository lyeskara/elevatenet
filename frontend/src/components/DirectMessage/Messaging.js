import React, { useState, useRef, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore"; // Importing Firestore functions
import { auth } from "../../firebase"; // Importing Firebase authentication
import { db } from "../../firebase"; // Importing Firebase Firestore database
import "./Messaging.css"; // Importing styling

const Message = () => {
  const currentUser = auth.currentUser; // Get the current authenticated user
  const [message, setMessage] = useState(""); // State for message input
  const [messages, setMessages] = useState([]); // State for messages
  const messageRef = useRef(); // Reference to the message input element
  const messagesRef = collection(db, "messages"); // Firestore collection reference for messages
  const [recipientId, setRecipientId] = useState(null); // State for the recipient's user ID
  const [users_information, setUsers] = useState([]); // State for users' information

  const fileRef = useRef(); // Reference to the file input element
  const [file, setFile] = useState(null); // State for selected file
  const handleFileChange = (e) => {
    // Event handler for file input change
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    // Effect hook for fetching users' information from Firestore
    const unsubscribe = onSnapshot(
      collection(db, "users_information"),
      (snapshot) => {
        const usersArray = [];
        snapshot.forEach((doc) => {
          usersArray.push({ id: doc.id, ...doc.data() });
        });
        setUsers(usersArray);
      }
    );
    return unsubscribe; // Unsubscribe from the snapshot listener when the component unmounts
  }, []);

  useEffect(() => {
    // Effect hook for fetching messages from Firestore
    const senderId = currentUser.uid;
    if (recipientId !== null) {
      // If a recipient is selected
      // Generate a unique conversation ID based on the IDs of the two users
      const conversationId = [senderId, recipientId].sort().join("-");
      const conversationRef = collection(
        messagesRef,
        conversationId,
        "conversation"
      );
      const q = query(conversationRef, orderBy("createdAt"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messagesArray = [];
        querySnapshot.forEach((doc) => {
          messagesArray.push(doc.data());
        });
        setMessages(messagesArray);
      });
      return unsubscribe; // Unsubscribe from the snapshot listener when the component unmounts
    }
  }, [currentUser.uid, recipientId]); // Re-run the effect when either the current user ID or recipient ID changes

  const handleSubmit = (e) => {
    // Event handler for message form submission
    e.preventDefault();
    const data = {
      text: messageRef.current.value,
      file: file,
      createdAt: serverTimestamp(), // Firestore server timestamp for message creation time
      sender: currentUser.uid, // ID of the message sender
    };
    try {
      // Generate a unique conversation ID based on the IDs of the two users
      const conversationId = [currentUser.uid, recipientId].sort().join("-");
      const conversationRef = collection(
        messagesRef,
        conversationId,
        "conversation"
      );
      addDoc(conversationRef, data); // Add the message to Firestore
      setMessages([...messages, data]); // Update the local state with the new message
      setMessage(""); // Clear the message input
      setFile(null); // Clear the selected file
    } catch (e) {
      console.log(e);
    }
  };

  // This function is called whenever the input field for the message changes
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
      {/* The main container for the chat */}
      <div className="container-m">
        {/* The chat list section */}
        <div className="chat-list-m">
          <h2>Chat List</h2>
          {/* Maps through all the users in the 'users_information' array, 
              except the current user, and renders a 'user-tab' div for each */}
          {users_information.map(
            (user) =>
              user.id !== currentUser.uid && (
                <div
                  key={user.id}
                  className="user-tab-m"
                  onClick={() => setRecipientId(user.id)}
                >
                  <img src={user.avatarUrl} style={{ marginRight: "20px" }} />
                  <h3>
                    {user.firstName} {user.lastName}
                  </h3>
                </div>
              )
            /*style={{
                    backgroundColor: msg.sender === currentUser.uid ? '#27746A' : 'grey',
                    textAlign: msg.sender === currentUser.uid ? 'right' : 'left',
                  }}
                  */ )}
        </div>

     

        {/* A divider between the chat list and messages section */}
        <div className="divider-m"></div>

        {/* The messages section */}
        <div className="messages-m">
          <div className="text-m">
            <h2>Messages</h2>
            {/* Renders all the messages in the 'messages' array, with the sender's 
                messages having a green background and the receiver's messages having 
                a grey background */}
            <div style={{ overflowY: "scroll", height: "300px" }}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message-m ${
                    msg.sender === currentUser.uid ? "sent-m" : "received-m"
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.file && (
                    <a href={msg.file.url} target="_blank" rel="noreferrer">
                      {msg.file.name}
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* A form for sending a message */}
            <form onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  value={message}
                  onChange={handleMessageChange}
                  ref={messageRef}
                  placeholder="Enter Message..."
                />
              </div>
              <div>
                <button
                  className="button-m"
                  type="button"
                  onClick={handleSubmit}
                >
                  Send
                </button>
              </div>
            </form>

            {/* An input field for uploading a file */}
            <input type="file" onChange={handleFileChange} ref={fileRef} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Message;
