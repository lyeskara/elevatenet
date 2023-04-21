//In this CreateNewPosting class with the CreateNewPosting() function
//users and enter in the fields job title,company, description and deadline
// and with after doing so and clicking post they can create a job posting job

import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import Card from "react-bootstrap/Card";
import "../../styles/JobPostings.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import "firebase/firestore";
import { useUserAuth } from "../../context/UserAuthContext";
import { useNavigate } from "react-router-dom";
import { collection, setDoc, doc, addDoc, getDoc } from "firebase/firestore";
import generateKey from "../../generateKey";

function CreateNewPosting() {
	const { user } = useUserAuth();
	const currentId = auth.currentUser.uid;
	const navigate = useNavigate();
	const [startDate, setStartDate] = useState(new Date());
	const [userInfo, SetUserInfo] = useState(null);
	//fields of posting
	let user_info = {
		profile_picture: "",
		first_name: "",
		last_name: "",
	};
	const [postingData, setPostingData] = useState({
		job_title: "",
		company: "",
		description: "",
		apply_here: "",
		deadline: "",
		resume_required: false,
		cover_letter_required: false,
		advertise: false,
		skills: [],
	});
	//update with the handleCancel() method
	// @param ()
	//handles cancel, redirects to /JobPostings page
	const handleCancel = () => {
		window.location.href = "/JobPostings";
	};
	//update with the handleInputChange() method
	// @param (event)
	//handles changes to the input and updates field
	const handleInputChange = (event) => {
		const { name, value } = event.target;
		if (name === "skills") {
			const skillsArray = value.split(",");
			setPostingData((prevState) => ({
				...prevState,
				[name]: skillsArray,
			}));
		} else {
			setPostingData((prevState) => ({
				...prevState,
				[name]: value,
			}));
		}
	};

	useEffect(() => {
		getDoc(doc(collection(db, "users_information"), currentId)).then(
			(informations) => {
				const { profilePicUrl, firstName, lastName } = informations.data();
				const obj = {
					profile_picture: profilePicUrl,
					first_name: firstName,
					last_name: lastName,
				};
				SetUserInfo(obj);
			}
		);
	}, []);
	user_info = { ...user_info, ...userInfo };

	//creates the job posting with handleSubmit() method
	// @param event
	// adds the posting parameters job title, company, description, and deadline to the database
	const handleSubmit = async (event) => {
		event.preventDefault();
		if (user) {
			// setDoc( doc(collection(db,'posting'),auth.currentUser.uid),{
			const docRef = await addDoc(collection(db, "posting"), {
				job_title: postingData.job_title,
				company: postingData.company,
				description: postingData.description,
				apply_here: postingData.apply_here,
				deadline: postingData.deadline,
				created_by: user.email,
				resume_required: postingData.resume_required,
				cover_letter_required: postingData.cover_letter_required,
				advertise: postingData.advertise,
				skills: postingData.skills,

				// full_time: postingData.full_time,                      no going to be used for this sprint
			});

			if (
				(await getDoc(doc(collection(db, "connection"), currentId))).data() !==
				undefined
			) {
				const connections = (
					await getDoc(doc(collection(db, "connection"), currentId))
				).data().connections;
				console.log(connections);
				connections.forEach((id) => {
					getDoc(doc(collection(db, "notification_settings"), id)).then(
						(note_data) => {
							if (note_data.data() !== undefined) {
								if (note_data.data().jobs) {
									getDoc(doc(collection(db, "Notifications"), id)).then(
										(followed_doc) => {
											const note = {
												message: `${user_info.first_name} ${user_info.last_name} has created a new Job Application, go check it out!`,
												profilePicUrl: user_info.profile_picture,
												id: generateKey(8),
											};
											console.log(note);
											if (
												followed_doc.data() === undefined ||
												followed_doc.data()
											) {
												setDoc(doc(collection(db, "Notifications"), id), {
													notifications: [note],
												});
												console.log(note);
											} else {
												const notifications_array =
													followed_doc.data().notifications;
												let condition = false;
												notifications_array.forEach((notif) => {
													if (notif.id !== note.id) {
														condition = true;
													}
													console.log(note);
												});
												if (condition) {
													notifications_array.push(note);
													console.log(note);
												}
												console.log(notifications_array);
												updateDoc(doc(collection(db, "Notifications"), id), {
													notifications: notifications_array,
												});
												console.log(note);
											}
										}
									);
								}
							}
						}
					);
				});
			}
			// Clear the form fields
			setPostingData({
				job_title: "",
				company: "",
				description: "",
				apply_here: "",
				deadline: "",
				resume_required: false,
				cover_letter_required: false,
				advertise: false,
				skills: "",
				// full_time: false
			});
			navigate("/JobPostings");
		} else {
			console.log("error happened. Try again!");
		}
	};

	//function handleDateInputChange() to handle both functions for date picker field
	// @param {Date}
	// handles changes to date chosen and updates the field to current choice
	// const handleDateInputChange = (date) => {
	//     setStartDate(date);
	//     setPostingData((prevState) => ({
	//       ...prevState,
	//       deadline: date.toISOString(),
	//     }));
	//   };

	useEffect(() => {}, [user]);
	// return of the CreateNewPosting() function
	// lets users cancel the form
	// lets users change inputs on the form
	// lets users submit the form
	// return users to JobPosting page with updates from database created with form submission
	return (
		//Container for new job posting
		<Container className="container mx-auto container-job">
			<Row className="gap-6">
				<Col>
					<Card className="card">
						{/* INPUT FORM */}
						<form onSubmit={handleSubmit}>
							<h5 className="text-center">Create a new Job Posting</h5>
							<hr></hr>
							{/* JOB TITLE */}
							<div className="form-group mb-3">
								<label htmlFor="formFile" className="form-label">
									<h6>Job Title</h6>
								</label>
								<input
									className="form-control"
									type="text"
									placeholder="Add the title you are hiring for"
									aria-label="default input example"
									id="job_title"
									name="job_title"
									value={postingData.job_title}
									onChange={handleInputChange}
									style={{ backgroundColor: "#F3F3F3" }}
									required
								/>
							</div>
							{/* COMPANY */}
							<div className="form-group mb-3">
								<label htmlFor="formFile" className="form-label">
									<h6>Company</h6>
								</label>
								<input
									className="form-control"
									type="text"
									placeholder="The company the job is for"
									aria-label="default input example"
									id="company"
									name="company"
									value={postingData.company}
									onChange={handleInputChange}
									style={{ backgroundColor: "#F3F3F3" }}
									required
								/>
							</div>
							{/* DESCRIPTION */}
							<div className="form-group mb-3">
								<label htmlFor="formFile" className="form-label">
									<h6>Description</h6>
								</label>
								<textarea
									className="form-control"
									rows="3"
									placeholder="Tell us about the position and its requirements"
									// id="exampleFormControlTextarea1"
									id="description"
									name="description"
									value={postingData.description}
									onChange={handleInputChange}
									style={{ backgroundColor: "#F3F3F3" }}
									required
								></textarea>
							</div>
							{/* SKILLS */}
							<div className="form-group mb-3">
								<label htmlFor="formFile" className="form-label">
									<h6>Skills</h6>
								</label>
								<input
									className="form-control"
									type="text"
									placeholder="Skills related to the position"
									aria-label="default input example"
									id="skills"
									name="skills"
									value={postingData.skills}
									onChange={handleInputChange}
									style={{ backgroundColor: "#F3F3F3" }}
									required
								/>
							</div>
							{/* RESUME OR COVER LETTER REQUIRED */}
							<div className="form-group mb-3">
								<label htmlFor="formFile" className="form-label">
									<h6>Documents Required</h6>
								</label>
								<div
									className="form-check"
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
									}}
								>
									<button
										type="button"
										className={`btn ${
											postingData.resume_required
												? "btn-success"
												: "btn-outline-secondary"
										}`}
										onClick={() =>
											setPostingData({
												...postingData,
												resume_required: !postingData.resume_required,
											})
										}
										style={{
											backgroundColor: postingData.resume_required
												? "#27746a"
												: "",
										}}
									>
										{postingData.resume_required
											? "Resume Required"
											: "Resume Optional"}
									</button>
									<button
										type="button"
										className={`btn ${
											postingData.cover_letter_required
												? "btn-success"
												: "btn-outline-secondary"
										}`}
										onClick={() =>
											setPostingData({
												...postingData,
												cover_letter_required:
													!postingData.cover_letter_required,
											})
										}
										style={{
											marginLeft: "10px",
											backgroundColor: postingData.cover_letter_required
												? "#27746a"
												: "",
										}}
									>
										{postingData.cover_letter_required
											? "Cover Letter Required"
											: "Cover Letter Optional"}
									</button>
								</div>
							</div>

							{/* APPLY HERE (OPTIONAL) */}
							<div className="form-group mb-3">
								<label htmlFor="formFile" className="form-label">
									<h6>Apply Here (optional)</h6>
								</label>
								<input
									className="form-control"
									rows="3"
									placeholder="To redirect to a third-party website"
									// id="exampleFormControlTextarea1"
									id="apply_here"
									name="apply_here"
									value={postingData.apply_here}
									onChange={handleInputChange}
									style={{ backgroundColor: "#F3F3F3" }}
								/>
							</div>
							{/* DATE PICKER FOR DEADLINE */}
							{/* <div className="form-group mb-3">
                                <label htmlFor="formFile" className="form-label">
                                    <h6>Deadline</h6>
                                </label>
                                <div className="date-picker">
                                    <DatePicker
                                    selected={startDate}
                                    onChange={handleDateInputChange}
                                    minDate={new Date()}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-control"
                                    name="deadline"
                                    required
                                    />
                                </div>
                            </div> */}
							{/*Start Date */}
							<div className="form-group mb-3">
								<label htmlFor="formFile" className="form-label">
									<h6>Deadline</h6>
								</label>
								<div>
									<input
										type="date"
										onChange={handleInputChange}
										id="deadline"
										name="deadline"
										required
									></input>
								</div>
							</div>
							{/* CHECKBOX TO KNOW IF POSTING SHOULD BE ADVERTISED   */}
							<div className="form-group mb-3">
								<label htmlFor="formFile" className="form-label">
									<h6>Advertise to Job Seekers</h6>
								</label>
								<div className="form-check">
									{/* xxxxxxxxxxxxxxxxxxx */}
									<button
										type="button"
										className={`btn ${
											postingData.advertise
												? "btn-success"
												: "btn-outline-secondary"
										}`}
										onClick={() =>
											setPostingData({
												...postingData,
												advertise: !postingData.advertise,
											})
										}
										style={{
											backgroundColor: postingData.advertise ? "#27746a" : "",
										}}
									>
										{postingData.advertise ? "Advertised" : "Do Not Advertise"}
									</button>

									{/* xxxxxxxxxxxxxxxxxxx */}
								</div>
							</div>

							{/* BUTTONS TO CANCEL OR POST THE POSITION */}
							<Row>
								<Col className="d-flex justify-content-center">
									<>
										<Button
											variant="outline-secondary"
											size="lg"
											block
											className="w-100"
											onClick={handleCancel}
										>
											Cancel
										</Button>
									</>
								</Col>
								<Col className="d-flex justify-content-center">
									<Button
										type="submit"
										variant="primary"
										size="lg"
										block
										className="w-100"
										style={{ backgroundColor: "#27746a" }}
									>
										Post
									</Button>
								</Col>
							</Row>
						</form>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}
//....
export default CreateNewPosting;
