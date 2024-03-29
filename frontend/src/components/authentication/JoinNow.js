import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext.js";
import { auth } from "../../firebase.js";
import { collection, setDoc, doc } from "firebase/firestore";
import { db } from "../../firebase.js";
import { Container, Form, Button, Modal } from "react-bootstrap";
import "../../styles/JoinPages.css";

/** 
   * Handles the user signing into his account
   * 
  */
function JoinNow() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { Registration } = useUserAuth();
  const [recruiter, Setrecruiter] = useState(false);
  console.log(recruiter);
  const { googleSignUp } = useUserAuth();

  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  //adding signin with google handler
  const handleGoogleSignUp = async () => {
    try {
      await googleSignUp();
      await new Promise((resolve) => setTimeout(resolve, 200));
      if (recruiter) {
        navigate("/RecruiterForm");
      } else {
        navigate("/ProfileForm");
      }
    } catch (error) {
      console.log(error.message);
	  setErrorMessage(error.message);
	  setShowModal(true);
    }
  };

  const navigate = useNavigate();

  /**
   *
   * @param {*} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Registration(email, password).then((word) => {
        if (recruiter) {
          return setDoc(
            doc(
              collection(db, "recruiters_informations"),
              auth.currentUser.uid
            ),
            {
              firstName: "",
              lastName: "",
              city: "",
              company: "",
            }
          );
        } else {
          setDoc(
            doc(collection(db, "users_information"), auth.currentUser.uid),
            {
              profileImage: "",
              firstName: "",
              lastName: "",
              city: "",
              bio: "",
              workExperience: "",
              education: "",
              skills: [],
              languages: "",
              courses: [],
              projects: [],
              volunteering: [],
            }
          );
        }
      });
      if (recruiter) {
        navigate("/RecruiterForm");
      } else {
        navigate("/ProfileForm");
      }
    } catch (error) {
      console.log(error.message);
	  setErrorMessage(error.message);
      setShowModal(true);
    }
  };

  //This closes the modal on the user's screen.
  const handleCloseModal = () => {
    setShowModal(false);
  };

  //This sets a custom message depending on the error that is captured upon trying to sign-up.
  const MyModal = ({ showModal, handleCloseModal, errorMessage }) => {
    if(errorMessage){

      let message = ''; //Error message variable is instantiated.

      //The appropriate message is assigned.

	  if(errorMessage === "Firebase: Password should be at least 6 characters (auth/weak-password)."){
        message = "Your password should be at least 6 characters. Please try again.";
      }

      else{
        message = "This email is already in use. Please enter a different one.";
      };
  
      //Here we return the modal to the user.
      return (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Sign-Up Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {message}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" style={{ borderRadius: "20px" }} onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      );

    };
  };

  return (
    <>
      <Container fluid>
        <div>
          <p className="text-center slogan pt-4 pb-3">
            Bring your career to new heights
          </p>
        </div>
        <div className="text-center containerForm">
          <Form onSubmit={handleSubmit}>
            <Form.Text className="sign center">Sign Up</Form.Text>
            <div>
              <input
                className="input_radio mt-4"
                type="radio"
                id="recruiter"
                name="age"
                value="recruiter"
                onClick={() => Setrecruiter(true)}
                required
              ></input>
              <label for="recruiter" className="label_radio">
                I'm a Recruiter
              </label>
              <input
                className="input_radio"
                type="radio"
                id="seeker"
                name="age"
                value="seeker"
                onChange={() => Setrecruiter(false)}
              ></input>
              <label for="seeker" className="label_radio">
                I'm a Job Seeker
              </label>
            </div>
            <Button
              className="google_button sign_button mb-3 mt-4"
              onClick={handleGoogleSignUp}
            >
              Continue with Google
            </Button>
            <p className="line">
              <span className="span_line">OR</span>
            </p>
            <center>
              <Form.Group className="mb-3 mt-4" controlId="formBasicEmail">
                <Form.Control
                  className="input_box"
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control
                  className="input_box"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
            </center>
            <Button className="sign_button mb-3 mt-4" type="submit">
              Sign Up
            </Button>
            <br></br>
            <Form.Text className="text-muted">
              Already have an account?{" "}
              <a href="/SignIn" className="join">
                Sign In
              </a>
            </Form.Text>
          </Form>
        </div>
        <MyModal
          showModal={showModal}
          handleCloseModal={handleCloseModal}
          errorMessage={errorMessage}
        />
      </Container>
    </>
  );
}

export default JoinNow;
