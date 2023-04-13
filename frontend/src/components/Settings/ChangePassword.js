// Importing necessary modules
import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDoc,
  doc,
  onSnapshot,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db, getAuth } from "../../firebase";
import Card from "react-bootstrap/Card";
import "../../styles/JobPostings.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import backward from ".././../images/backward.png";
import { updatePassword,  signOut } from "firebase/auth";
import "../../styles/setting.css";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext";
function ChangePassword() {
  const [user, setUser] = useState({});
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { logOut } = useUserAuth();
  const navigate = useNavigate();
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


  const onChangePasswordClick = async (event) => {
    event.preventDefault();
    if (newPassword == "" || confirmPassword == "") {
      alert("Missing input.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      // Update the user's password
      await updatePassword(auth.currentUser, newPassword);

      await signOut(auth);
      navigate("/");
     // Display a success message to the user
      alert("Your password has been updated successfully. Please log in again.");
    } catch (error) {
      console.log(error);
      alert("There was an error updating your password.");
    }
  };

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
    </Container>
  );
}

export default ChangePassword;
