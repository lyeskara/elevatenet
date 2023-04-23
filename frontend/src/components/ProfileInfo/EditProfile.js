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
	const [updatedUser, setUpdatedUser] = useState({}); // create a copy of the user object using useState
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
		const { name, value } = e.target;
		if (
			name === "skills" ||
			name === "courses" ||
			name === "projects" ||
			name === "volunteering" ||
			name === "awards"
		) {
			// split the input string into an array of strings
			const arrayValue = value.split(",");
			setUpdatedUser((prevUser) => ({ ...prevUser, [name]: arrayValue }));
		} else if (name.startsWith("workExperience")) {
			const [index, field] = name.split(".").slice(1);
			const newWork = [
				...updatedUser.workExperience.slice(0, index),
				{ ...updatedUser.workExperience[index], [field]: value },
				...updatedUser.workExperience.slice(index + 1),
			];
			setUpdatedUser((prevUser) => ({ ...prevUser, workExperience: newWork }));
		} else if (name.startsWith("education")) {
			const [index, field] = name.split(".").slice(1);
			const newEducation = [
				...updatedUser.education.slice(0, index),
				{ ...updatedUser.education[index], [field]: value },
				...updatedUser.education.slice(index + 1),
			];
			setUpdatedUser((prevUser) => ({ ...prevUser, education: newEducation }));
		} else {
			setUpdatedUser((prevUser) => ({ ...prevUser, [name]: value }));
		}
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
				doc(collection(db, "users_information"), auth.currentUser.uid),
				{
					...updatedUser,
					...(downloadPicURL && { profilePicUrl: downloadPicURL }),
					...(downloadResumeURL && { resumeUrl: downloadResumeURL }),
					...(downloadCLURL && { CLUrl: downloadCLURL }),
					education: updatedUser.education.map((edu) => ({
						name: edu.name,
						major: edu.major,
						startDate: edu.startDate,
						endDate: edu.endDate,
					})),
					workExperience: updatedUser.workExperience.map((work) => ({
						position: work.position,
						company: work.company,
						startDate: work.startDate,
						endDate: work.endDate,
					})),
				}
			);
			setUser(updatedUser);
			setShow(false);
			handleClose();
		}
	}
	/**
	 * addEducation allows us to add a new education object to the user's education array.
	 * @constructor
	 * @param {object} e - Any element.
	 * @param {object} updatedUser - Updated user object containing attributes.
	 * @param {object} setUpdatedUser - Function to set the updated user object.
	 * @param {object} updatedUser.education - Updated user object containing attributes.
	 */
	function addEducation() {
		setUpdatedUser({
			...updatedUser,
			education: [
				...updatedUser.education,
				{ name: "", major: "", startDate: "", endDate: "" },
			],
		});
	}
	/**
	 * removeEducation allows us to remove an education object from the user's education array.
	 * @constructor
	 * @param {object} e - Any element.
	 * @param {object} updatedUser - Updated user object containing attributes.
	 * @param {object} setUpdatedUser - Function to set the updated user object.
	 * @param {object} updatedUser.education - Updated user object containing attributes.
	 * @param {object} index - Index of the education object to be removed.
	 */
	function removeEducation(index) {
		const newEducation = [...updatedUser.education];
		newEducation.splice(index, 1);
		setUpdatedUser({ ...updatedUser, education: newEducation });
	}
	/**
	 * addWork allows us to add a new work object to the user's work array.
	 * @constructor
	 * @param {object} e - Any element.
	 * @param {object} updatedUser - Updated user object containing attributes.
	 * @param {object} setUpdatedUser - Function to set the updated user object.
	 * @param {object} updatedUser.workExperience - Updated user object containing attributes.
	 * @param {object} index - Index of the work object to be removed.
	 */
	function addWork() {
		setUpdatedUser({
			...updatedUser,
			workExperience: [
				...updatedUser.workExperience,
				{ position: "", company: "", startDate: "", endDate: "" },
			],
		});
	}
	/**
	 * removeWork allows us to remove a work object from the user's work array.
	 * @constructor
	 * @param {object} e - Any element.
	 * @param {object} updatedUser - Updated user object containing attributes.
	 * @param {object} setUpdatedUser - Function to set the updated user object.
	 * @param {object} updatedUser.workExperience - Updated user object containing attributes.
	 * @param {object} index - Index of the work object to be removed.
	 */
	function removeWork(index) {
		const newWork = [...updatedUser.workExperience];
		newWork.splice(index, 1);
		setUpdatedUser({ ...updatedUser, workExperience: newWork });
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
							{updatedUser.workExperience &&
								updatedUser.workExperience.map((exp, index) => (
									<div key={index}>
										<Form.Control
											className="input_box"
											style={{ marginBottom: "1rem", marginTop: "1rem" }}
											type="text"
											name={`workExperience.${index}.position`}
											onChange={update}
											value={exp.position}
											placeholder="Position"
										/>
										<Form.Control
											className="input_box"
											style={{ marginBottom: "1rem", marginTop: "1rem" }}
											type="text"
											name={`workExperience.${index}.company`}
											onChange={update}
											value={exp.company}
											placeholder="Company"
										/>
										<Form.Control
											className="input_box"
											style={{ marginBottom: "1rem", marginTop: "1rem" }}
											type="text"
											name={`workExperience.${index}.startDate`}
											onChange={update}
											value={exp.startDate}
											placeholder="Start Date"
										/>
										<Form.Control
											className="input_box"
											style={{ marginBottom: "1rem", marginTop: "1rem" }}
											type="text"
											name={`workExperience.${index}.endDate`}
											onChange={update}
											value={exp.endDate}
											placeholder="End Date"
										/>
										<Button
											className="sign_button mb-3 mt-3"
											variant="outline-primary"
											onClick={removeWork}
										>
											Remove Work Experience
										</Button>
									</div>
								))}
							<Button
								className="sign_button mb-3 mt-3"
								variant="outline-primary"
								onClick={addWork}
							>
								Add Work Experience
							</Button>
						</Form.Group>
						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							{updatedUser.education &&
								updatedUser.education.map((edu, index) => (
									<div key={index}>
										<Form.Control
											style={{ marginBottom: "1rem", marginTop: "1rem" }}
											className="input_box"
											type="text"
											name={`education.${index}.name`}
											onChange={update}
											defaultValue={edu.name}
											placeholder="School Name"
										/>
										<Form.Control
											style={{ marginBottom: "1rem", marginTop: "1rem" }}
											className="input_box"
											type="text"
											name={`education.${index}.major`}
											onChange={update}
											defaultValue={edu.major}
											placeholder="Major"
										/>
										<Form.Control
											style={{ marginBottom: "1rem", marginTop: "1rem" }}
											className="input_box"
											type="text"
											name={`education.${index}.startDate`}
											onChange={update}
											defaultValue={edu.startDate}
											placeholder="Start Date"
										/>
										<Form.Control
											style={{ marginBottom: "1rem", marginTop: "1rem" }}
											className="input_box"
											type="text"
											name={`education.${index}.endDate`}
											onChange={update}
											defaultValue={edu.endDate}
											placeholder="End Date"
										/>
										<Button
											className="sign_button mb-3 mt-3"
											variant="outline-primary"
											onClick={() => removeEducation(index)}
										>
											Remove Education
										</Button>
									</div>
								))}
							<Button
								className="sign_button mb-3 mt-3"
								variant="outline-primary"
								onClick={() => addEducation()}
							>
								Add Education
							</Button>
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
							window.location.reload();
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
