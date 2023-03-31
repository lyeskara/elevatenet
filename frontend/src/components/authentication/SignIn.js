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

  const [showModal, setShowModal] = useState(false);

  //adding signin with google handler
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      navigate("/Profile");
    } catch (error) {
      console.log(error);
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
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Invalid Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Your username or password is incorrect. Please try again.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default SignIn;
