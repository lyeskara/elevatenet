import { collection, doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { Card, Container, Col, Row } from "react-bootstrap";
import "../styles/Notification.css";

function Notification() {
  const [Notifications, SetNotifications] = useState([]);
  const [unNotified, setUnNotified] = useState(false);
  const auth_id = auth.currentUser.uid;
  useEffect(() => {
    getDoc(doc(collection(db, "Notifications"), auth_id)).then((promise) => {
      if (promise.data() === undefined) {
        setUnNotified(true);
      } else {
        const data = promise.data().notifications;
        SetNotifications(data);
      }
    });
  }, []);
  console.log(Notifications);
  return (
    <>
      <center>
        <h1 className="notif-title">Notification Center</h1>
      </center>
      {Notifications ? (
        Notifications.slice(0,5).map((Notification) => {
          return (
            <Container>
                <center>
              <Card className="notif-card">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={Notification.profilePicUrl}
                    alt="profilephoto-icon"
                    className="create-post-profile-photo notif-pic"
                  />
                  <p style={{ marginRight: "10px" }}>
                    {Notification.message}
                  </p>
                </div>
              </Card></center>
            </Container>
          );
        })
      ) : (
        <h1>No notification recieved</h1>
      )}
    </>
  );
}

export default Notification;
