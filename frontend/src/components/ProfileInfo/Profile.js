import React, { useEffect, useState } from "react";
import { collection, getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Card from "react-bootstrap/Card";
import "../../styles/profile.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { GrMailOption, GrPhone } from "react-icons/gr";
import EditProfile from "./EditProfile";
import person from "./test.gif";
import { getStorage, ref, getDownloadURL, getMetadata } from "firebase/storage";

/**
 * Profile loads values stored in the data base and allows us to view them in a styled page.
 */
function Profile() {
	const [user, setUser] = useState({});
	const [profilePicURL, setProfilePicURL] = useState("");
	const storage = getStorage();

	/**
	 * getUserData gets all values pertaining to the logged in user.
	 */

	const getUserData = async () => {
		try {
			const userDoc = await getDoc(
				doc(collection(db, "users_information"), auth.currentUser.uid)
			);

			if (userDoc.exists) {
				// Set the user state
				setUser({ ...userDoc.data(), id: userDoc.id });

				// Get the profile picture URL from Firebase Storage
				const storageRef = ref(
					storage,
					`profilepics/${auth.currentUser.uid}/profilePic`
				);

				// Check if the profile picture exists in Firebase Storage
				const metadata = await getMetadata(storageRef);
				const downloadURL = await getDownloadURL(storageRef);

				// Set the profile picture URL state
				setProfilePicURL(downloadURL);
			} else {
				console.log("User not found");
			}
		} catch (error) {
			console.log(error);

			// Set the profile picture URL state to a default value
			setProfilePicURL(
				"https://firebasestorage.googleapis.com/v0/b/soen390-b027d.appspot.com/o/profilepics%2FBase%2Ftest.gif?alt=media&token=d295d8c2-493f-4c20-8fac-0ede65eaf0b6"
			);
		}
	};

	useEffect(() => {
		getUserData();
	}, [auth]);

	const downloadResume = async () => {
		const storageRef = ref(storage, `resume/${auth.currentUser.uid}/resume`);
		try {
			const url = await getDownloadURL(storageRef);
			if (url) {
				window.open(url);
			} else {
				alert("Resume file not found!");
			}
		} catch (error) {
			console.log(error);
			alert("Error downloading resume file!");
		}
	};

	const downloadCL = async () => {
		const storageRef = ref(storage, `CL/${auth.currentUser.uid}/CL`);
		try {
			const url = await getDownloadURL(storageRef);
			if (url) {
				window.open(url);
			} else {
				alert("Cover letter file not found!");
			}
		} catch (error) {
			console.log(error);
			alert("Cover letter file not found!");
		}
	};

	return (
		//Profile card

		<div className="contain">
			<EditProfile user={user} setUser={setUser}></EditProfile>
			<Row className="gap-5">
				<Col className="col1" xs={12} md={{ span: 3, offset: 1 }}>
					<Card className="profilecard">
						<img
							src={profilePicURL}
							id="profilepic"
							alt="Avatar"
							className="avatar"
						></img>
						<h1>
							{user.firstName}
							<span style={{ color: "#27746A" }}> {user.lastName}</span>
						</h1>
						<p style={{ color: "#A6A6A6" }}> {user.city}</p>
						<p> {user.bio} </p>
						<p> {user.languages} </p>
					</Card>

					<Card className="contactcard">
						<h5>Contact Information</h5>
						<hr></hr>
						<div className="email">
							<GrMailOption />

							<h5
								style={{
									color: "#626262",
								}}
							>
								{user.email}
							</h5>
						</div>
						<div className="contact">
							<GrPhone />
							<b> {user.contact} </b>
						</div>
					</Card>
					<Card className="connectioncard">
						<div className="Connections">
							<h5
								style={{
									color: "#626262",
								}}
							>
								{user.connections} <u>Connections</u>
							</h5>
						</div>
					</Card>

					<Card className="recommendationcard">
						<h5>Recommendation</h5>
						<hr></hr>
						<div className="Recommendation">
							<h5
								style={{
									color: "black",
								}}
							>
								<u>Jasmit Kalsi</u>
							</h5>
						</div>
					</Card>

					<Card className="awardscard">
						<h5>Awards</h5>
						<hr></hr>
						<div className="Awards">
							<h5
								style={{
									color: "black",
								}}
							>
								{user.awards &&
									Array.isArray(user.awards) &&
									user.awards.map((awards) => (
										<div key={awards}>{user.awards}</div>
									))}
							</h5>
						</div>
					</Card>
					<Card className="docscard">
						<div className="resume">
							<h5
								style={{
									color: "#626262",
								}}
							>
								Resume
							</h5>
							<button
								className="btn btn-primary"
								style={{ backgroundColor: "#27746A", borderColor: "#27746A" }}
								onClick={downloadResume}
							>
								Download
							</button>
						</div>
						<hr style={{ marginBottom: "6px" }}></hr>
						<div className="coverletter">
							<h5
								style={{
									color: "#626262",
								}}
							>
								Cover Letter
							</h5>
							<button
								type="button"
								className="btn btn-primary"
								style={{ backgroundColor: "#27746A", borderColor: "#27746A" }}
								onClick={downloadCL}
							>
								Download
							</button>
						</div>
					</Card>
				</Col>

				<Col xs={12} md={7}>
					<Card className="card">
						<h5>Work Experience</h5>
						<hr></hr>
						<div className="profile-desc-row">
							<img src={person}></img>
							<div>
								<h3>Business Intelligence Analyst</h3>
								<p>DODO Inc.</p>
								<p> Feb 2022 - Present</p>
							</div>
						</div>
						<hr></hr>
						<div className="profile-desc-row">
							<img src={person}></img>
							<div>
								<h3>Junior Analyst</h3>
								<p>FOFO Inc.</p>
								<p> Feb 2021 - Feb 2022</p>
							</div>
						</div>
					</Card>

					<Card className="educationcard">
						<h5>Education</h5>
						<hr></hr>
						<div className="profile-desc-row">
							<img src={person}></img>
							<div>
								<h3>{user.education}</h3>
								<p style={{ color: "#272727" }}>
									Bachelor's degree, software engineering
								</p>
								<p> Aug 2020 - May 2024</p>
							</div>
						</div>
						<hr></hr>
					</Card>

					<Card className="skillscard">
						<h5>Skills</h5>
						<hr></hr>
						{user.skills && Array.isArray(user.skills) && (
							<div style={{ display: "flex", flexDirection: "row" }}>
								{user.skills.map((skill) => (
									<span key={skill} className="skills-btn">
										{skill}
									</span>
								))}
							</div>
						)}
					</Card>

					<Card className="courses">
						<h5>Courses</h5>
						<hr></hr>
						{user.courses &&
							Array.isArray(user.courses) &&
							user.courses.map((courses) => <div key={courses}>{courses}</div>)}
					</Card>
					<Card className="projects">
						<h5>Projects</h5>
						<hr></hr>
						{user.courses &&
							Array.isArray(user.projects) &&
							user.projects.map((projects) => (
								<div key={projects}>{projects}</div>
							))}
					</Card>
					<Card className="volunteering">
						<h5>Volunteering</h5>
						<hr></hr>
						{user.volunteering &&
							Array.isArray(user.volunteering) &&
							user.volunteering.map((volunteering) => (
								<div key={volunteering}>{volunteering}</div>
							))}
					</Card>
				</Col>
			</Row>
		</div>
	);
}
export default Profile;
