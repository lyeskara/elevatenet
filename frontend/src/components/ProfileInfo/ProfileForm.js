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
		workExperience: [
			{
				company: "",
				position: "",
				startDate: "",
				endDate: "",
			},
		],
		education: [{ name: "", major: "", startDate: "", endDate: "" }],
		skills: [],
		languages: "",
		contact: "",
		awards: [],
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
			name === "volunteering" ||
			name === "awards"
		) {
			// split the input string into an array of strings
			const arrayValue = value.split(",");
			setProfileData({ ...profileData, [name]: arrayValue });
		} else if (name.startsWith("workExperience")) {
			const [index, field] = name.split(".").slice(1);
			const newWork = [
				...profileData.workExperience.slice(0, index),
				{ ...profileData.workExperience[index], [field]: value },
				...profileData.workExperience.slice(index + 1),
			];
			setProfileData({ ...profileData, workExperience: newWork });
		} else if (name.startsWith("education")) {
			const [index, field] = name.split(".").slice(1);
			const newEducation = [
				...profileData.education.slice(0, index),
				{ ...profileData.education[index], [field]: value },
				...profileData.education.slice(index + 1),
			];
			setProfileData({ ...profileData, education: newEducation });
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
				awards: profileData.awards,
				profilePicUrl: "",
				resumeUrl: "",
				CLUrl: "",
			});
			// Clear the form fields
			setProfileData({
				profileImage: "",
				firstName: "",
				lastName: "",
				city: "",
				bio: "",
				workExperience: {
					position: "",
					company: "",
					startDate: "",
					endDate: "",
				},
				education: {
					name: "",
					startDate: "",
					endDate: "",
					major: "",
				},
				skills: [],
				languages: "",
				contact: "",
				courses: [],
				volunteering: [],
				projects: [],
				awards: [],
			});
			navigate("/Profile");
		} else {
			console.log("error happened. Try again!");
		}
	}
	function addEducation() {
		setProfileData({
			...profileData,
			education: [
				...profileData.education,
				{ name: "", major: "", startDate: "", endDate: "" },
			],
		});
	}

	function removeEducation(index) {
		const newEducation = [...profileData.education];
		newEducation.splice(index, 1);
		setProfileData({ ...profileData, education: newEducation });
	}

	function addWork() {
		setProfileData({
			...profileData,
			workExperience: [
				...profileData.workExperience,
				{ position: "", company: "", startDate: "", endDate: "" },
			],
		});
	}

	function removeWork(index) {
		const newWork = [...profileData.workExperience];
		newWork.splice(index, 1);
		setProfileData({ ...profileData, workExperience: newWork });
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
							{profileData.education.map((edu, index) => (
								<div key={index}>
									<Form.Control
										style={{ marginBottom: "1rem", marginTop: "1rem" }}
										className="input_box"
										type="text"
										name={`education.${index}.name`}
										onChange={update}
										value={edu.name}
										placeholder="School Name"
									/>
									<Form.Control
										style={{ marginBottom: "1rem", marginTop: "1rem" }}
										className="input_box"
										type="text"
										name={`education.${index}.major`}
										onChange={update}
										value={edu.major}
										placeholder="Major"
									/>
									<Form.Control
										style={{ marginBottom: "1rem", marginTop: "1rem" }}
										className="input_box"
										type="text"
										name={`education.${index}.startDate`}
										onChange={update}
										value={edu.startDate}
										placeholder="Start Date"
									/>
									<Form.Control
										style={{ marginBottom: "1rem", marginTop: "1rem" }}
										className="input_box"
										type="text"
										name={`education.${index}.endDate`}
										onChange={update}
										value={edu.endDate}
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
								onClick={addEducation}
							>
								Add Education
							</Button>
						</Form.Group>

						<Form.Group className="mb-3" controlId="formWorkExperience">
							{profileData.workExperience.map((exp, index) => (
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
								</div>
							))}
							<Button
								className="sign_button mb-3 mt-3"
								variant="outline-primary"
								onClick={addWork}
							>
								Add Work Experience
							</Button>
							<Button
								className="sign_button mb-3 mt-3"
								variant="outline-primary"
								onClick={removeWork}
							>
								Remove Work Experience
							</Button>
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
						<Form.Group className="mb-3" controlId="formAwards">
							<Form.Control
								as="textarea"
								rows={3}
								className="input_box"
								name="awards"
								onChange={update}
								value={profileData.awards}
								placeholder="Awards"
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
