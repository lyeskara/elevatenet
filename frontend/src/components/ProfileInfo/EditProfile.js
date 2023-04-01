import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db } from "../../firebase";
import { collection, setDoc, doc } from "firebase/firestore";

const storageRef = ref(
	"https://console.firebase.google.com/project/soen390-b027d/storage/soen390-b027d.appspot.com/images"
);
/**
 * EditProfile allows us to edit the database for an individual user and updating the information provided
 * by said user.
 * @constructor
 * @param {object} user - User object containing attributes.
 * @param {object} setUser - updated user attributes.
 */
function EditProfile({ user, setUser }) {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => {
		setUpdatedUser(user);
		setShow(true);
	};
	const storage = getStorage();
	const [selectedFile, setSelectedFile] = useState(null);
	const [selectedResume, setSelectedResume] = useState(null);
	const [selectedCL, setSelectedCL] = useState(null);
	const [updatedUser, setUpdatedUser] = useState(null); // create a copy of the user object using useState
	let downloadPicURL = null;
	let downloadResumeURL = null;
	let downloadCLURL = null;
	/**
	 * setUser allows us to set the User to our changled values stored in setUser.
	 * @constructor
	 * @param {object} user - User object containing attributes.
	 * @param {object} e - Any element.
	 */
	function update(e) {
		const name = e.target.name;
		const value = e.target.value;

		setUpdatedUser((prevState) => {
			// Handle array fields
			if (Array.isArray(prevState[name])) {
				const values = value.split(","); // split input by comma
				return { ...prevState, [name]: values };
			}
			// Handle non-array fields
			return { ...prevState, [name]: value };
		});
	}

	const [showNameModal, setShowNameModal] = useState(false);

	/**
	 * UpdateUser allows us to send the new information in the form to the database.
	 * @constructor
	 * @param {object} e - Any element.
	 */
	async function updateUser(e) {
		e.preventDefault();

		//Verify that the user's full name is indicated, and not null.
		if (!updatedUser.firstName || !updatedUser.lastName) {
			setShowNameModal(true);
			return;
   		}

		if (user) {
			if (selectedFile) {
				const storageRef = ref(
					storage,
					`profilepics/${auth.currentUser.uid}/profilePic`
				);
				const uploadPic = await uploadBytes(storageRef, selectedFile);
				downloadPicURL = await getDownloadURL(uploadPic.ref).then(
					console.log(downloadPicURL)
				);
			}
			if (selectedResume) {
				const storageRef = ref(
					storage,
					`resume/${auth.currentUser.uid}/resume`
				);
				const uploadResume = await uploadBytes(storageRef, selectedResume);
				downloadResumeURL = await getDownloadURL(uploadResume.ref);
			}
			if (selectedCL) {
				const storageRef = ref(storage, `CL/${auth.currentUser.uid}/CL`);
				const uploadCL = await uploadBytes(storageRef, selectedCL);
				downloadCLURL = await getDownloadURL(uploadCL.ref);
			}
			await setDoc(
				doc(collection(db, "users_information"), auth.currentUser.uid),
				{
					...user,
					...updatedUser,
					...(downloadPicURL && { profilePicUrl: downloadPicURL }),
					...(downloadResumeURL && { resumeUrl: downloadResumeURL }),
					...(downloadCLURL && { CLUrl: downloadCLURL }),
				}
			);
			console.log("Sending info");
			console.log(user);
			console.log("SPACED");
			console.log(updatedUser);
			setUser({ ...user, ...updatedUser });
			setShow(false);
			handleClose();
		}
	}

	return (
    <>
      <Button
        style={{ backgroundColor: "#27746A", borderColor: "#27746A" }}
        variant="primary"
        onClick={handleShow}
      >
        Edit
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Avatar</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Resume</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setSelectedResume(e.target.files[0])}
              />
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Cover Letter</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setSelectedCL(e.target.files[0])}
              />
            </Form.Group>
            <div style={{ display: "flex" }}>
              <Form.Group
                style={{ marginRight: "1rem" }}
                className="mb-3"
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
                className="mb-3"
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
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Location</Form.Label>
              <Form.Control
                name="location"
                type="text"
                defaultValue={user.city}
                onChange={update}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Languages</Form.Label>
              <Form.Control
                name="languages"
                type="text"
                defaultValue={user.languages}
                onChange={update}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                name="contact"
                type="text"
                defaultValue={user.contact}
                onChange={update}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Experience</Form.Label>
              <Form.Control
                name="workExperience"
                type="text"
                defaultValue={user.workExperience}
                onChange={update}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Education</Form.Label>
              <Form.Control
                name="education"
                type="text"
                defaultValue={user.education}
                onChange={update}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Skills</Form.Label>
              <Form.Control
                name="skills"
                type="text"
                defaultValue={user.skills}
                onChange={update}
                autoFocus
              />
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Bio</Form.Label>
              <Form.Control
                name="bio"
                as="textarea"
                defaultValue={user.bio}
                onChange={update}
                rows={3}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Courses</Form.Label>
              <Form.Control
                name="courses"
                as="textarea"
                defaultValue={user.courses}
                onChange={update}
                rows={3}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Awards</Form.Label>
              <Form.Control
                name="awards"
                type="text"
                defaultValue={user.awards}
                onChange={update}
                autoFocus
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Projects</Form.Label>
              <Form.Control
                name="projects"
                as="textarea"
                defaultValue={user.projects}
                onChange={update}
                rows={3}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Volunteering</Form.Label>
              <Form.Control
                name="volunteering"
                as="textarea"
                defaultValue={user.volunteering}
                onChange={update}
                rows={3}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ backgroundColor: "#27746A", borderColor: "#27746A" }}
            variant="secondary"
            onClick={handleClose}
          >
            Close
          </Button>
          <Button
            style={{ backgroundColor: "#27746A", borderColor: "#27746A" }}
            variant="primary"
            onClick={(e) => {
              updateUser(e);
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>


	  {/* Modal Notification to ensure that first and last names are required when edited. */}
      <Modal show={showNameModal} onHide={() => setShowNameModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Name cannot be empty.</Modal.Title>
        </Modal.Header>
        <Modal.Body>First and Last name fields are required.</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            style={{ backgroundColor: "#27746a", borderRadius: "20px" }}
            onClick={() => setShowNameModal(false)}
          >
            Got it!
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default EditProfile;
