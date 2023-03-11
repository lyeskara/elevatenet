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
import { getStorage, ref, getDownloadURL } from "firebase/storage";

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
				setUser({ ...userDoc.data(), id: userDoc.id });

				// Get the profile picture URL from the Firebase Storage URL
				const storageRef = ref(
					storage,
					`profilepics/${auth.currentUser.uid}/profilePic`
				);

				const downloadURL = await getDownloadURL(storageRef);
				console.log(downloadURL);
				setProfilePicURL(downloadURL); // Set the profile picture URL state
			} else {
				console.log("User not found");
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getUserData();
	}, [auth]);

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
							<span style={{ color: "green" }}> {user.lastName}</span>
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
									user.skills.map((awards) => (
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
						</div>
						<hr></hr>
						<div className="coverletter">
							<h5
								style={{
									color: "#626262",
								}}
							>
								Cover Letter
							</h5>
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
						{user.skills &&
							Array.isArray(user.skills) &&
							user.skills.map((skill) => (
								<div key={skill}>
									<span className="skills-btn">{skill}</span>
								</div>
							))}
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
							user.projects.map((volunteering) => (
								<div key={volunteering}>{volunteering}</div>
							))}
					</Card>
				</Col>
			</Row>
		</div>
	);
}
export default Profile;
