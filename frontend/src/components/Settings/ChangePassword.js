// Importing necessary modules
import React, { useEffect, useState } from "react";
import {
  collection,
  getDoc,
  getDocs,
  doc,
  query,
  where,
} from "firebase/firestore";
import { auth, db, getAuth } from "../../firebase";

import "../../styles/JobPostings.css";
import { Container, Row, Col, Button, Modal, Card } from "react-bootstrap";
import backward from ".././../images/backward.png";
import { updatePassword, signOut } from "firebase/auth";
import "../../styles/setting.css";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext";

/**
 * Function that will change the connected user password
 *
 * @return none
 */
function ChangePassword() {
  const [user, setUser] = useState({});
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { logOut } = useUserAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [titleMessage, setTitleMessage] = useState("");

  const [userType, setUserType] = useState(null); // add state to store user type
  const userr = auth.currentUser;
  const getUserType = async () => {
    try {
       // Get the current user's email
    const email = auth.currentUser.email;
    if (!email) {
      console.log("No email found for current user.");
      return;
    }
      // Check if the email belongs to a recruiter
    const recruiterQuerySnapshot = await getDocs(
      query(collection(db, "recruiters_informations"), where("email", "==", email))
    ); 
    if (!recruiterQuerySnapshot.empty) {
      setUserType("recruiter");
      console.log("recruiter");
      return;
    }
      // Check if the email belongs to a job seeker
      const userQuerySnapshot = await getDocs(
        query(collection(db, "users_information"), where("email", "==", email))
      );
      if (!userQuerySnapshot.empty) {
        setUserType("job seeker");
        console.log("job seeker");
        return;
      }
      console.log({userType});
      console.log("No user found with the email: ", email);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserType();
  }, [userr]);

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

  useEffect(() => {
    getUserData();
  }, [auth]);

  /**
   * Function that will update the password and display error or success messages when needed
   * @param event: on click
   * @return none
   */
  const onChangePasswordClick = async (event) => {
    event.preventDefault();
    if (newPassword == "" || confirmPassword == "") {
      setShowModal(true);
      setErrorMessage("Missing input");
      setTitleMessage("Error");
      return;
    }
    if (newPassword !== confirmPassword) {
      setShowModal(true);
      setErrorMessage("Passwords do not match");
      setTitleMessage("Error");
      return;
    }

    try {
      // Update the user's password
      await updatePassword(auth.currentUser, newPassword);

      // Display a success message to the user
      setShowModal(true);
      setTitleMessage("Success");
      setErrorMessage("Your password has been updated successfully.");
    } catch (error) {
      console.log(error);
      setShowModal(true);
      setTitleMessage("Error");
      if (
        error ==
        "FirebaseError: Firebase: Password should be at least 6 characters (auth/weak-password)."
      )
        setErrorMessage("Password should be at least 6 characters");
      else {
        setErrorMessage("There was an error updating your password.");
      }
    }
  };
  const handleClose = () => setShowModal(false); // Add handleClose function

  // This component displays a page for job postings
  // and advertisements with a menu block on the left to navigate between them.

  return (
    <Container className="container mx-auto w-60">
      <Row className="gap-6">
        <Col>
          <center>
            {" "}
            <h5 className=" NetworkTitle mt-5">Change Password</h5>
          </center>
          <Card className="card">
            <div className="containRequest">
              <Link to="/Security">
                <img src={backward} alt="back" />
              </Link>
            </div>
            <center>
              <form>
                <div>
                {userType === "job seeker" && (
                  <>
                   <label htmlFor="formPassword" className="form-label">
                    <h3>Email</h3>
                  </label>
                  <input
                    className="form-control input-password"
                    type="text"
                    placeholder={user.email}
                    aria-label="default input example"
                    id="email"
                    name="email"
                    // onChange={handleInputChange}
                    style={{ backgroundColor: "#F3F3F3" }}
                    value={user.email}
                  ></input>
                  </>
                )}
                 
                </div>
                <label htmlFor="formPassword" className="form-label">
                  <h3>New Password</h3>
                </label>
                <input
                  className="form-control input-password"
                  type="password"
                  aria-label="default input example"
                  id="password"
                  name="passord"
                  required
                  placeholder="New password"
                  style={{ backgroundColor: "#F3F3F3" }}
                  onChange={(event) => setNewPassword(event.target.value)}
                ></input>
                <label htmlFor="formPassword" className="form-label">
                  <h3>Confirm Password</h3>
                </label>
                <input
                  className="form-control input-password"
                  type="password"
                  aria-label="default input example"
                  id="password"
                  name="passord"
                  required
                  placeholder="Confirm password"
                  style={{ backgroundColor: "#F3F3F3" }}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                ></input>
                <Button
                  className="button-password mt-4"
                  onClick={onChangePasswordClick}
                >
                  Change Password
                </Button>
              </form>
            </center>
          </Card>
        </Col>
      </Row>
      {/*Modal to display error message */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{titleMessage}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ChangePassword;
