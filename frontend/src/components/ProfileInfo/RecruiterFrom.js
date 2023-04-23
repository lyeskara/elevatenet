//Import all modules
import { useState } from "react";
import { useUserAuth } from "../../context/UserAuthContext";
import { auth, db } from "../../firebase";
import { collection, setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
/**
 * The RecruiterForm page displays form to be filled by recruiters when joining in.
 *
 * @return { Object } The page as a React component with the form for recruiter
 */
function RecruiterForm() {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    city: "",
    company: "",
  });

  //function to update the recruiter fields
  function update(e) {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  }

  //Function to create the recruiter document and add all the data related to that recruiter
  function create_user(e) {
    e.preventDefault();
    if (user) {
      setDoc(
        doc(collection(db, "recruiters_informations"), auth.currentUser.uid),
        {
          email: user.email,
          id: user.uid,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          company: profileData.company,
          city: profileData.city,
        }
      );
      // Clear the form fields
      setProfileData({
        firstName: "",
        lastName: "",
        city: "",
        company: "",
      });
      navigate("/Profile");
    } else {
      console.log("error happened. Try again!");
    }
  }
  return (
    <>
      <div className="text-center containerForm">
        <Form onSubmit={create_user}>
          <Form.Text className="sign center">About You</Form.Text>

          <center>
			{/*FORM FOR RECRUITER TO FILL*/}
            <Form.Group className="mb-3 mt-4" controlId="formFirstName">
              <Form.Control
                className="input_box"
                type="text"
                name="firstName"
                onChange={update}
                value={profileData.firstName}
                placeholder="First Name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formLastName">
              <Form.Control
                className="input_box"
                type="text"
                name="lastName"
                onChange={update}
                value={profileData.lastName}
                placeholder="Last Name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formCity">
              <Form.Control
                className="input_box"
                type="text"
                name="city"
                onChange={update}
                value={profileData.city}
                placeholder="City"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formcompany">
              <Form.Control
                as="textarea"
                rows={3}
                className="input_box"
                name="company"
                onChange={update}
                value={profileData.company}
                placeholder="company"
              />
            </Form.Group>
          </center>
          <Button className="sign_button mb-3 mt-3" type="submit">
            Register
          </Button>
          <br></br>
        </Form>
      </div>
    </>
  );
}

export default RecruiterForm;
