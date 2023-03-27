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
import { db } from '../../firebase'; // Importing Firebase Firestore database
import { getStorage, ref, getDownloadURL,uploadBytes } from "firebase/storage";
import "../../styles/Messaging.css"; // Importing styling
import { Container, Form, Button, FormGroup } from "react-bootstrap";
import pin from ".././../images/paperclip.png";
import defpic from ".././../images/test.gif";

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
    const unsubscribe = onSnapshot(collection(db, 'users_information'), (snapshot) => {
      const usersArray = [];
      snapshot.forEach((doc) => {
        usersArray.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersArray);
    });
    return () => {
      unsubscribe();
    };
  }, [setUsers]);
  
  // useEffect(() => { // Effect hook for fetching users' information from Firestore
  //   const unsubscribe = onSnapshot(collection(db, 'users_information'), (snapshot) => {
  //     const usersArray = [];
  //     snapshot.forEach((doc) => {
  //       usersArray.push({ id: doc.id, ...doc.data() });
  //     });
  //     setUsers(usersArray);
  //   });
  //   return unsubscribe; // Unsubscribe from the snapshot listener when the component unmounts
  // }, []);


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

  const storage = getStorage(); // Get Firebase Storage instance

  const handleSubmit = async (e) => { // Event handler for message form submission
    e.preventDefault();
  
    // Upload file to Firebase Storage if a file was selected
    let fileUrl = null;
    if (file) {
      const storageRef = ref(storage, `messages/${file.name}`);
      await uploadBytes(storageRef, file);
      fileUrl = await getDownloadURL(storageRef);
    }
  
    const data = {
      text: messageRef.current.value,
      fileUrl: fileUrl, // Add the file's download URL to the message data
      createdAt: serverTimestamp(),
      sender: currentUser.uid,
    };
    try {
      const conversationId = [currentUser.uid, recipientId].sort().join('-');
      const conversationRef = collection(db, 'messages', conversationId, 'conversation');
      await addDoc(conversationRef, data);
      setMessages([...messages, data]);
      setMessage('');
      setFile(null);
    } catch (e) {
      console.log(e);
    }
  };
  

  // This function is called whenever the input field for the message changes
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  // const handlePersonClick = (e) => {
  //   e.preventDefault();
  //   const recipientId = e.target.getAttribute('data-recipient-id');
  //   setRecipientId(recipientId);
  // };

  return (
    <>
    <Container>
      {/* The main container for the chat */}
      <div className="container-m">
        {/* The chat list section */}
        <div className="chat-list-m">
          <h2 className="mb-5">Chat List</h2>
          <div style={{ overflowY: "scroll", height: "500px" }}>
          {/* Maps through all the users in the 'users_information' array, 
              except the current user, and renders a 'user-tab' div for each */}
          {users_information.map(
            (user) =>
              user.id !== currentUser.uid && (
                <div
                tabindex="0"
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
                  */
          )}</div>
        </div>

        {/* A divider between the chat list and messages section*/} 
        <div className="divider-m"></div>

        {/* The messages section */}
        <div className="text-m">
            <div className="containRequest">
          <img src={defpic} className="defpic-m"></img>
          <h2>{recipientId ? users_information.find(user => user.id === recipientId).firstName + " " + users_information.find(user => user.id === recipientId).lastName : "Message"}</h2>
            </div>
            {/* Renders all the messages in the 'messages' array, with the sender's 
                messages having a green background and the receiver's messages having 
                a grey background */}
            <div style={{ overflowY: "scroll", height: "400px" }}>
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
            <Form onSubmit={handleSubmit}>
           
            <div className="textarea-message form-group">  
                <textarea
                  type="text"
                  className="textarea-message"
                  rows={4}
                  value={message}
                  onChange={handleMessageChange}
                  onKeyDown={handleKeyDown} // Add event listener for "keydown" event
                  ref={messageRef}
                  placeholder="Enter Message..."
                ></textarea>
              </div>

              <div className="containRequest right-side"><label for="file-upload">
              <img src={pin}></img>
              <input
                className="file-m"
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                ref={fileRef}
              ></input>
            </label>
                <button
                  className="button-m form-control mt-2"
                  type="button"
                  onClick={handleSubmit}
                >
                  Send
                </button>
              </div>
              
            </Form>

            {/* An input field for uploading a file */}
           
          </div>
          </div>
      </Container>
    </>
  );
};

export default Message;
