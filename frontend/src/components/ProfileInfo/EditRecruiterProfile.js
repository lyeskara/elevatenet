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
function EditRecruiterProfile({ user, setUser }) {
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => {
		setUpdatedUser(user);
		setShow(true);
	};
	const storage = getStorage();
	const [selectedFile, setSelectedFile] = useState(null);
	const [updatedUser, setUpdatedUser] = useState({}); // create a copy of the user object using useState
	let downloadPicURL = null;

	/**
	 * setUser allows us to set the User to our changled values stored in setUser.
	 * @constructor
	 * @param {object} user - User object containing attributes.
	 * @param {object} e - Any element.
	 */
	function update(e) {
		const { name, value } = e.target;
		setUpdatedUser((prevUser) => ({ ...prevUser, [name]: value }));
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

		if (auth.currentUser) {
			if (selectedFile) {
				const storageRef = ref(
					storage,
					`profilepics/${auth.currentUser.uid}/profilePic`
				);
				const uploadPic = await uploadBytes(storageRef, selectedFile);
				downloadPicURL = await getDownloadURL(uploadPic.ref).then();
			}

			/**
			 * setDoc allows us to set the document in the database to the new information provided by the user.
			 * @constructor
			 * @param {object} docRef - Reference to the document in the database.
			 * @param {object} updatedUser - Updated user object containing attributes.
			 * @param {object} downloadPicURL - Download URL for the profile picture.
			 * @param {object} downloadResumeURL - Download URL for the resume.
			 * @param {object} downloadCLURL - Download URL for the cover letter.
			 */
			await setDoc(
				doc(collection(db, "recruiters_informations"), auth.currentUser.uid),
				{
					...updatedUser,
					...(downloadPicURL && { profilePicUrl: downloadPicURL }),
				}
			);
			setUser(updatedUser);
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

						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<Form.Label>Company</Form.Label>
							<Form.Control
								name="company"
								type="text"
								defaultValue={user.company}
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
							updateUser(e).then(() => {
								window.location.reload();
							});
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
export default EditRecruiterProfile;
