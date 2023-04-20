// Importing necessary modules
import React, { useEffect, useState } from "react";

import "../../styles/JobPostings.css";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Card,
  Form,
} from "react-bootstrap";
import backward from ".././../images/backward.png";
import { auth, db } from "../../firebase";
import {
  collection,
  getDoc,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
/**
   * Function that will display the menu for settings and direct to the option to change password

   * @return none
   */
function NameSetting() {
  const [user, setUser] = useState({});
  const [updatedUser, setUpdatedUser] = useState(null); // create a copy of the user object using useState
  const [showModal, setShowModal] = useState(false);

  const getUserData = async () => {
    try {
      const userDoc = await getDoc(
        doc(collection(db, "users_information"), auth.currentUser.uid)
      );

      if (userDoc.exists) {
        // Set the user state
        setUser({ ...userDoc.data() });
      } else {
        console.log("User not found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // This function updates the user information in the database
  const updateUser = async (e) => {
    e.preventDefault();

    try {
      const userRef = doc(
        collection(db, "users_information"),
        auth.currentUser.uid
      );

      await updateDoc(userRef, {
        firstName: updatedUser.firstName || user.firstName,
        lastName: updatedUser.lastName || user.lastName,
        city: updatedUser.city || user.city,
        contact: updatedUser.contact || user.contact,
      });

      // Update the user state with the new data
      setUser({ ...user, ...updatedUser });

      // Reset the updatedUser state
      setUpdatedUser(null);
      setShowModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  // This function updates the updatedUser state as the user types in the form
  const update = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
    
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleClose = () => setShowModal(false); // Add handleClose function

  // This component displays a page for settings

  return (
    <Container className="container mx-auto w-60">
      <Row className="gap-6">
        <Col>
          <center>
            {" "}
            <h5 className=" NetworkTitle mt-5">Change Settings</h5>
          </center>
          <Card className="card">
            <div className="containRequest">
              <Link to="/ProfileInfoSettings">
                <img src={backward} alt="back" />
              </Link>
            </div>
            <Form>
              <div className="containRequest">
                <Form.Group
                  style={{ marginRight: "1rem" }}
                  className="mb-3 width-name"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    name="firstName"
                    type="text"
                    defaultValue={user.firstName}
                    onChange={update}
                    autoFocus
                    required
                  />
                </Form.Group>

                <Form.Group
                  className="mb-3 width-name"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    name="lastName"
                    type="text"
                    defaultValue={user.lastName}
                    onChange={update}
                    autoFocus
                    required
                  />
                </Form.Group>
              </div>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Location</Form.Label>
                <Form.Control
                  name="city"
                  type="text"
                  defaultValue={user.city}
                  onChange={update}
                  autoFocus
                />
              </Form.Group>

              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  name="contact"
                  type="text"
                  defaultValue={user.contact}
                  onChange={update}
                  autoFocus
                />
              </Form.Group>

              <Button
                style={{ backgroundColor: "#27746A", borderColor: "#27746A" }}
                variant="primary"
                onClick={(e) => {
                  updateUser(e);
                }}
              >
                Save Changes
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>

        {/*Modal to display error message */}
        <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>The changes were made successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}

export default NameSetting;
