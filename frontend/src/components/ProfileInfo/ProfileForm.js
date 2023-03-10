import React, { useState } from "react";
import { useUserAuth } from "../../context/UserAuthContext";
import { auth, db } from "../../firebase";
import { collection, setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
function ProfileForm() {
	const { user } = useUserAuth();
	const navigate = useNavigate();
	const [profileData, setProfileData] = useState({
		profileImage: "",
		firstName: "",
		lastName: "",
		city: "",
		bio: "",
		workExperience: "",
		education: "",
		skills: [],
		languages: "",
		contact: "",
		courses: [],
		projects: [],
		volunteering: [],
	});

	function update(e) {
		const { name, value } = e.target;
		if (
			name === "skills" ||
			name === "courses" ||
			name === "projects" ||
			name === "volunteering"
		) {
			// split the input string into an array of strings
			const arrayValue = value.split(",");
			setProfileData({ ...profileData, [name]: arrayValue });
		} else {
			setProfileData({ ...profileData, [name]: value });
		}
	}

	function create_user(e) {
		e.preventDefault();
		if (user) {
			setDoc(doc(collection(db, "users_information"), auth.currentUser.uid), {
				firstName: profileData.firstName,
				lastName: profileData.lastName,
				education: profileData.education,
				city: profileData.city,
				bio: profileData.bio,
				workExperience: profileData.workExperience,
				skills: profileData.skills,
				email: auth.currentUser.email,
				languages: profileData.languages,
				contact: profileData.contact,
				courses: profileData.courses,
				volunteering: profileData.volunteering,
				projects: profileData.projects,
			});
			// Clear the form fields
			setProfileData({
				profileImage: "",
				firstName: "",
				lastName: "",
				city: "",
				bio: "",
				workExperience: "",
				education: "",
				skills: "",
				languages: "",
				contact: "",
				courses: "",
				volunteering: "",
				projects: "",
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

						<Form.Group className="mb-3" controlId="formBio">
							<Form.Control
								as="textarea"
								rows={3}
								className="input_box"
								name="bio"
								onChange={update}
								value={profileData.bio}
								placeholder="Bio"
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

						<Form.Group className="mb-3" controlId="formEducation">
							<Form.Control
								className="input_box"
								type="text"
								name="education"
								onChange={update}
								value={profileData.education}
								placeholder="Education"
							/>
						</Form.Group>

						<Form.Group className="mb-3" controlId="formWorkExperience">
							<Form.Control
								as="textarea"
								rows={3}
								className="input_box"
								name="workExperience"
								onChange={update}
								value={profileData.workExperience}
								placeholder="Work Experience"
							/>
						</Form.Group>

						<Form.Group className="mb-3" controlId="formSkills">
							<Form.Control
								className="input_box"
								type="text"
								name="skills"
								onChange={update}
								value={profileData.skills}
								placeholder="Skills"
							/>
						</Form.Group>

						<Form.Group className="mb-3" controlId="formLanguage">
							<Form.Control
								className="input_box"
								type="text"
								name="languages"
								onChange={update}
								value={profileData.languages}
								placeholder="Language"
							/>
						</Form.Group>

						<Form.Group className="mb-3" controlId="formContact">
							<Form.Control
								className="input_box"
								type="text"
								name="contact"
								onChange={update}
								value={profileData.contact}
								placeholder="contact-number"
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formCourses">
							<Form.Control
								as="textarea"
								rows={3}
								className="input_box"
								name="courses"
								onChange={update}
								value={profileData.courses}
								placeholder="Courses"
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formProjects">
							<Form.Control
								as="textarea"
								rows={3}
								className="input_box"
								name="projects"
								onChange={update}
								value={profileData.projects}
								placeholder="Projects"
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formVolunteering">
							<Form.Control
								as="textarea"
								rows={3}
								className="input_box"
								name="volunteering"
								onChange={update}
								value={profileData.volunteering}
								placeholder="Volunteering"
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

export default ProfileForm;
