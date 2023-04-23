import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from "../../firebase";
function NotificationSettings() {
  // state declared to hold the value of the feed and notifications settings
  const [dmNotifications, setDmNotifications] = useState(false);
  const [newsfeedNotifications, setNewsfeedNotifications] = useState(false);
  // database and authentication middlewares
  const settingsdb = collection(db, "notification_settings");
  const auth_id = auth.currentUser.uid
  // a hook that runs async when the pages is rendered to display the current state of the button
  useEffect(() => {
    getDoc(doc(settingsdb, auth_id)).then((data) => {
      setDmNotifications(data.data().dm);
      setNewsfeedNotifications(data.data().feed);
    })
  }, [])
// function to update notifications settings
  const handleDmNotifications = async (e) => {
    setDmNotifications(e.target.checked);
    const data = (await getDoc(doc(settingsdb, auth_id))).data()
    if (data === undefined) {
      setDoc(doc(settingsdb, auth_id), { dm: e.target.checked, feed: "" });
    } else {
      data.dm = e.target.checked
      updateDoc(doc(settingsdb, auth_id), data)
    }
  };
// function to update notifications settings
  const handleNewsfeedNotifications = async (e) => {
    setNewsfeedNotifications(e.target.checked);
    const data = (await getDoc(doc(settingsdb, auth_id))).data()
    if (data === undefined) {
      setDoc(doc(settingsdb, auth_id), { dm: "", feed: e.target.checked });
    } else {
      data.feed = e.target.checked
      updateDoc(doc(settingsdb, auth_id), data)
    }
  };

  // Function to redirect to the "Account Preferences" page
  const handleClickAccount = () => {
    window.location.href = "/ProfileInfoSettings";
  };

  // Function to redirect to the "Security" page
  const handleClickSecurity = () => {
    window.location.href = "/Security";
  };

  return (
    <Container className="container d-flex justify-content-center mx-auto">
      <Row
        className="gap-6 d-flex justify-content-center"
        style={{ minWidth: "80%" }}
      >
        <Col xs={12} sm={8} lg={4} style={{ minWidth: "30%" }}>
          {/* This card displays the setting menu */}
          <Card className="jobs-menu">
            <h2>Settings</h2>
            <hr></hr>

            <h4 onClick={handleClickAccount} style={{ color: "#888888" }}>
              {" "}
              Account Preferences{" "}
            </h4>
            {/* Security */}
            <h4 onClick={handleClickSecurity} style={{ color: "#888888" }}>
              {" "}
              Security{" "}
            </h4>
            {/* Notifications */}
            <h4 style={{ color: "#27746a" }}>Notifications</h4>
          </Card>
        </Col>

        <Col xs={12} sm={12} lg={8}>
          <Card className="card">
            <h2 style={{ color: "#555555" }}>Notification Preferences</h2>
            <hr></hr>
            <Form>
              <Form.Group className="mb-3" controlId="dmNotifications">
                <Form.Check
                  type="checkbox"
                  label="Receive notifications for DMs"
                  checked={dmNotifications}
                  onChange={handleDmNotifications}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="newsfeedNotifications">
                <Form.Check
                  type="checkbox"
                  label="Receive notifications for Newsfeed"
                  checked={newsfeedNotifications}
                  onChange={handleNewsfeedNotifications}
                />
              </Form.Group>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default NotificationSettings;
