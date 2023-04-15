import React, { useState } from "react";
import { useUserAuth } from "../../context/UserAuthContext.js";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Modal } from "react-bootstrap";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { Login } = useUserAuth();
  const navigate = useNavigate();
  const { googleSignIn } = useUserAuth();

  //adding signin with google handler
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      navigate("/Profile");
    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message);
      setShowModal(true);
    }
  };

  /**
   *
   * @param {handlesubmit} e used for naivation purposes to see if it logs in right away or not
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Login(email, password);
      navigate("/Profile");
      console.log(Login(email, password));
    } catch (error) {
      console.log(error.message);
      setErrorMessage(error.message);
      setShowModal(true);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  //This closes the modal on the user's screen.
  const handleCloseModal = () => {
    setShowModal(false);
  };

  //This sets a custom message depending on the error that is captured upon trying to sign-in.
  const MyModal = ({ showModal, handleCloseModal, errorMessage }) => {
    if(errorMessage){

      let message = ''; //Error message variable is instantiated.

      //The appropriate message is assigned.
  
      if(errorMessage == "Firebase: Error (auth/user-not-found)."){
        message = "The entered email is not registered.";
      }

      else{
        message = "The password does not match with the email. Please try again.";
      };
  
      //Here we return the modal to the user.
      return (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Sign-In Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{message}</p>
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
            <Form.Text className="sign center">Sign In</Form.Text>
            <Button
              className="google_button sign_button mb-3 mt-4"
              onClick={handleGoogleSignIn}
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
                <Form.Text className="text-muted">
                  <a href="/" className="password">
                    Forgot Password?
                  </a>
                </Form.Text>
              </Form.Group>
            </center>
            <Button className="sign_button mb-3 mt-3" type="submit">
              Sign In
            </Button>
            <br></br>
            <Form.Text className="text-muted">
              New to ElevateNet?{" "}
              <a href="/JoinNow" className="join">
                Create an account
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
};

export default SignIn;
