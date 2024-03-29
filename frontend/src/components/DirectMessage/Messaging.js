import React, { useState, useRef, useEffect } from "react";
import {collection,addDoc,onSnapshot,serverTimestamp,query,orderBy,getDoc,updateDoc,doc,setDoc,deleteDoc,getDocs
} from "firebase/firestore"; // Importing Firestore functions
import { auth } from "../../firebase"; // Importing Firebase authentication
import { db } from '../../firebase'; // Importing Firebase Firestore database
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import "../../styles/Messaging.css"; // Importing styling
import { Container, Form, Button, FormGroup } from "react-bootstrap";
import pin from ".././../images/paperclip.png";
import defpic from ".././../images/test.gif";
import mod_icon from ".././../images/icon_mark.png";
import generateKey from "../../generateKey";
import "../../styles/DMModerationMenu.css"; // Importing styling

// messaging.js
//import { connections } from '.././connection/ConnectionPage';
//import connectionsData from '.././connection/ConnectionPage'; // Import connectionPage.js


const Message = () => {
  // const connections = connectionsData;
  // console.log("heyyyyyy");
  // console.log("connections:"+ connections);
  // const connectionIds = connections.map(connection => connection.id);

  const currentUser = auth.currentUser; // Get the current authenticated user
  const [message, setMessage] = useState(""); // State for message input
  const [messages, setMessages] = useState([]); // State for messages
  const messageRef = useRef(); // Reference to the message input element
  const messagesRef = collection(db, "messages"); // Firestore collection reference for messages
  const colRef = collection(db, "connection");
  const [connections, Setconnections] = useState([]);
  const [ids, Setids] = useState([]);
  const authUserId = auth.currentUser.uid;
  const userRef = collection(db, "users_information");
  const [recipientId, setRecipientId] = useState(null); // State for the recipient's user ID
  const [users_information, setUsers] = useState([]); // State for users' information
  const [auth_user_info, setAuthUserInfo] = useState({
    firstName: "",
    lastName: "",
    profilePicUrl: ""
  })
  const fileRef = useRef(); // Reference to the file input element
  const [file, setFile] = useState(null); // State for selected file
  const handleFileChange = (e) => {
    // Event handler for file input change
    setFile(e.target.files[0]);
    window.alert("File has been selected, press Send");
  };
  const [reportedCount, setReportedCount] = useState(0);

  const [blockedUsers, setBlockedUsers] = useState([]);
  const blockUser = (userId) => {
    setBlockedUsers((prevBlockedUsers) => [...prevBlockedUsers, userId]);
  };
  
  const unblockUser = (userId) => {
    setTimeout(() => {
      setBlockedUsers((prevBlockedUsers) =>
        prevBlockedUsers.filter((blockedUserId) => blockedUserId !== userId)
      );
    }, 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
  };
  
  

  const handleDeleteMessages = async () => {
    const confirmed = window.confirm("Are you sure you want to delete all messages?");
    if (confirmed && recipientId !== null) {
      const senderId = currentUser.uid;
      const conversationId = [senderId, recipientId].sort().join("-");
      const conversationRef = collection(messagesRef, conversationId, "conversation");
      const querySnapshot = await getDocs(conversationRef);
      querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
      });
      setMessages([]); // clear the messages state after deleting all messages
    }
  };

  const handleReportUser = async () => {
    const confirmed = window.confirm("Are you sure you want to report this user?");
    if (confirmed && recipientId !== null) {
      const recipient = users_information.find((user) => user.id === recipientId);
      const reportedUserRef = collection(db, "reported_user");
      let reason = null;
      while (reason === null || reason === "") {
        reason = window.prompt("Please provide a reason for the report (empty response will not be accepted):");
        if (reason === null) {
          return; // exit the function if the user clicked "Cancel"
        }
      }
      await addDoc(reportedUserRef, {
        name: `${recipient.firstName} ${recipient.lastName}`,
        email: recipient.email,
        uid: recipientId,
        reason: reason
      });
      alert("User reported successfully!");
      
      // Check how many times the user has been reported
      const querySnapshot = await getDocs(query(collection(db, "reported_user"), where("uid", "==", recipientId)));
      const count = querySnapshot.size;
      setReportedCount(count);
      
      // If the user has been reported 3 or more times, add their UID to the blockedUsers state variable
      if (count >= 3) {
        blockUser(recipientId);
      }
    }
  };

  useEffect(() => {
    const checkReportedCount = async () => {
      const reportedUsersQuerySnapshot = await getDocs(collection(db, "reported_user"));
      reportedUsersQuerySnapshot.forEach((doc) => {
        const data = doc.data();
        const uid = data.uid;
        const count = reportedUsersQuerySnapshot.docs.filter((doc) => doc.data().uid === uid).length;
        if (count >= 3 && !blockedUsers.includes(uid)) {
          blockUser(uid);
        }
      });
    };
    
    checkReportedCount();
  }, [blockedUsers]);
  
  
  console.log(connections);
    /** 
   * Accepts a function that contains imperative, possibly effectful code.
   * @param effect — Imperative function that can return a cleanup function
   * @param deps — If present, effect will only activate if the values in the list change.
  */
  useEffect(() => {
    getDoc(doc(colRef, authUserId)).then((connection) => {
      Setids(connection.data().connections);
      console.log(ids);
    });
  }, []);

/** 
   * Accepts a function that contains imperative, possibly effectful code.
   * @param effect — Imperative function that can return a cleanup function
   * @param deps — If present, effect will only activate if the values in the list change.
  */
useEffect(() => {
  ids.forEach((id) => {
    getDoc(doc(userRef, id))
      .then((user) => {
        const { firstName, lastName } = user.data();
        const id = user.id;
        if (
          !connections.find(
            (user1) =>
              user1.firstName === firstName && user1.lastName === lastName
          )
        ) {
          Setconnections((prevData) => [
            ...prevData,
            { id, firstName, lastName },
          ]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
}, [ids]);

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
  }, []);
// setting the state variable to the current user informations
  useEffect(() => {
    setAuthUserInfo(users_information.find((obj) => obj.id === currentUser.uid));
  }, [users_information])

  console.log(auth_user_info)


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
          const messageData = doc.data();
          if (messageData.fileUrl) {

            // If a file URL exists, include the file URL and name in the message object
            messageData.file = {
              url: messageData.fileUrl,
              name: messageData.fileName
            };
            // Update the message text to include a download link for the file
            // messageData.text += `Download`;
          }
          messagesArray.push(messageData);
        });
        setMessages(messagesArray);

      });
      return unsubscribe; // Unsubscribe from the snapshot listener when the component unmounts
    }
  }, [currentUser.uid, recipientId]); // Re-run the effect when either the current user ID or recipient ID changes


  const storage = getStorage(); // Get Firebase Storage instance

  const handleSubmit = async (e) => {
    e.preventDefault();

    const message = messageRef.current.value.trim();
    if (!file && message === '') {
      // If the message is empty and no file was selected, return without submitting
      return;
    }

    if (blockedUsers.includes(recipientId)) {
      alert("This user is blocked and cannot send messages to them.");
      return;
    }

    let fileUrl = null;
    if (file) {
      const storageRef = ref(storage, `messages/${file.name}`);
      await uploadBytes(storageRef, file);
      fileUrl = await getDownloadURL(storageRef);
    }

    const data = {
      text: message,
      createdAt: serverTimestamp(),
      sender: currentUser.uid,
    };

    if (file) {
      const storageRef = ref(storage, `messages/${file.name}`);
      await uploadBytes(storageRef, file);
      data.fileName = file.name;
      data.fileUrl = await getDownloadURL(storageRef);
      window.alert("File Successfully Uploaded!");
    }

    try {
      const conversationId = [currentUser.uid, recipientId].sort().join('-');
      const conversationRef = collection(db, 'messages', conversationId, 'conversation');
    // procedure that fetch notifications settings to see if the value is true to send a dm notification and also make  POST request to the server if true.

      const notification_settings = (await getDoc(doc(collection(db, "notification_settings"), recipientId))).data();

      if (notification_settings !== undefined && notification_settings.dm !== false) {
        const receipient_notifications = (await getDoc(doc(collection(db, 'Notifications'), recipientId))).data();
        const note = {
          message: `${auth_user_info.firstName} ${auth_user_info.lastName} has sended you a message, go check it out!`,
          profilePicUrl: auth_user_info.profilePicUrl,
          receipient_notifications: generateKey(8),
        }
        if (receipient_notifications === undefined) {
          console.log("error is here")
          setDoc(doc(collection(db, 'Notifications'), recipientId), { notifications: [note] })
        } else {
          const notifications_array = receipient_notifications.notifications;
          let condition = false
          notifications_array.forEach((notif) => {
            if (!(notif.receipient_notifications === note.receipient_notifications)) {
              condition = true;
            }
          })
          if (condition) {
            notifications_array.push(note)
          }
          updateDoc(doc(collection(db, 'Notifications'), recipientId), {
            notifications: notifications_array
          })
        }
      }
      await addDoc(conversationRef, data);
      setMessages([...messages, data]);
      setMessage('');
      setFile(null);
    } catch (e) {
      console.log(e);
    }
  };

  const handleBlockUser = () => {
    if (blockedUsers.includes(recipientId)) {
      unblockUser(recipientId);
    } else {
      blockUser(recipientId);
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
              {connections.map(
                (user) =>
                  user.id !== currentUser.uid && (
                    <div
                      tabindex="0"
                      key={user.id}
                      className="user-tab-m"
                      onClick={() => setRecipientId(user.id)}
                    >
                      <img
                        className="chat-pic"
                        src={user.profilePicUrl || defpic}
                        style={{ marginRight: "20px" }}
                      />
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
              )}
            </div>
          </div>

          {/* A divider between the chat list and messages section*/}
          <div className="divider-m"></div>

          {/* The messages section */}
          <div className="text-m">
            <div className="containRequest">
              {recipientId &&
                users_information.find((user) => user.id === recipientId) && (
                  <img
                    src={
                      users_information.find((user) => user.id === recipientId)
                        .profilePicUrl || defpic
                    }
                    className="defpic-m"
                  ></img>
                )}

              <h2>
                {recipientId
                  ? users_information.find((user) => user.id === recipientId)
                      .firstName +
                    " " +
                    users_information.find((user) => user.id === recipientId)
                      .lastName
                  : "Message"}
              </h2>
              <div className="dropdown">
                {/* Render the DM moderation menu items */}
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ backgroundColor: "#27746a", backgroundColor: "transparent", border: "none" }}
                >
                  <img
                    src={mod_icon}
                    alt="shield icon"
                    style={{
                      height: "30px",
                      width: "30px",
                      marginRight: "8px",
                    }}
                  ></img>
                </button>
                <ul className="dropdown-menu">
                  {/* Add your DM moderation menu items as needed */}
                  <li>
                    <button
                      className="dropdown-item"
                      type="button"
                      style={{ backgroundColor: "#F3F3F3" }}
                      onClick={handleBlockUser}
                    >
                      {blockedUsers.includes(recipientId)
                        ? "Unblock User"
                        : "Block User"}{" "}
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      type="button"
                      style={{ backgroundColor: "#F3F3F3" }}
                      onClick={handleReportUser}
                    >
                      Report User
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      type="button"
                      style={{ backgroundColor: "#F3F3F3" }}
                      onClick={handleDeleteMessages}
                    >
                      Delete All Messages
                    </button>
                  </li>
                </ul>
              </div>
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
                  <p>
                    {msg.text}
                    {msg.file && (
                      <a
                        href={msg.fileUrl}
                        download={msg.fileName}
                        target="_blank"
                      >
                        <span
                          style={{
                            textDecoration: "underline",
                            fontSize: "0.8em",
                            color: "white",
                          }}
                        >
                          {msg.fileName}
                        </span>
                      </a>
                    )}
                  </p>
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

              <div className="containRequest right-side">
                <label for="file-upload">
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
