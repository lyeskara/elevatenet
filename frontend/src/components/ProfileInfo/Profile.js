import React, { useEffect, useState, Fragment } from "react";
import { collection, getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Card from "react-bootstrap/Card";
import "../../styles/profile.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { GrMailOption, GrPhone } from "react-icons/gr";
import EditProfile from "./EditProfile";
import schoolpic from "../../images/school.png";
import workpic from "../../images/work.png";
import { getStorage, ref, getDownloadURL, getMetadata } from "firebase/storage";

/**
 * The Profile page displays the information of the user. It is used to access the user's information more easily.
 * @return { Object } The page as a React component with the information of the user.
 * @example
 * return (
 *  <Profile />
 * )
 */
function Profile() {
	const [user, setUser] = useState({});
	const [numConnections, setNumConnections] = useState(0);
	const [profilePicURL, setProfilePicURL] = useState("");
	const storage = getStorage();
	const [education, setEducation] = useState([]);
	const [work, setWork] = useState([]);

	/**
	 * Get the user data from Firestore
	 * @return { Object } The user data
	 * @example
	 * const user = getUserData();
	 */

	const getUserInformation = async () => {
		const userDoc = await getDoc(
			doc(collection(db, "users_information"), auth.currentUser.uid)
		);

		if (userDoc.exists) {
			// Set the user state
			setUser({ ...userDoc.data(), id: userDoc.id });
			// Get the profile picture URL from Firebase Storage
			if (
				userDoc.data().profilePicURL !==
				"https://firebasestorage.googleapis.com/v0/b/soen390-b027d.appspot.com/o/profilepics%2FBase%2Ftest.gif?alt=media&token=d295d8c2-493f-4c20-8fac-0ede65eaf0b6"
			) {
				storageRef = ref(
					storage,
					`profilepics/${auth.currentUser.uid}/profilePic`
				);
			} else {
				storageRef = ref(storage, `profilepics/Base/test.gif`);
			}
			/**
			 *  Check if the profile picture exists in Firebase Storage
			 */
			const metadata = await getMetadata(storageRef);
			const downloadURL = await getDownloadURL(storageRef);

			/**
			 *  Set the profile picture URL state
			 */

			setProfilePicURL(downloadURL);

			/**
			 *  Get the education data
			 */
			const educationData = userDoc.data().education;
			setEducation(educationData);

			/**
			 *  Get the work data
			 */

			const workData = userDoc.data().workExperience;
			setWork(workData);

			/**
			 *  Get the number of connections
			 */

			const connectionsDoc = await getDoc(
				doc(collection(db, "connection"), auth.currentUser.uid)
			);
			if (connectionsDoc.exists() && connectionsDoc.data()) {
				const connections = connectionsDoc.data().connections;
				if (connections == null) {
					setNumConnections(0);
				} else {
					let counter = 0;
					connections.forEach(() => {
						counter++;
					});

					setNumConnections(counter);
				}
			} else {
				console.log("The connections document does not exist or has no data");
			}
		}
	};

	const getUserProfilePicture = async () => {
		const profilePicRef = ref(
			storage,
			`profilepics/${auth.currentUser.uid}/profilePic`
		);

		try {
			// Check if the profile picture exists in Firebase Storage
			const downloadURL = await getDownloadURL(profilePicRef);
			console.log(downloadURL);
			// Set the profile picture URL state
			setProfilePicURL(downloadURL);
		} catch (error) {
			// Handle error
			console.log("Profile picture not found");
			const defaultPicRef = ref(storage, `profilepics/Base/test.gif`);
			const metadata = await getMetadata(defaultPicRef);
			const downloadURL = await getDownloadURL(defaultPicRef);
			console.log(downloadURL + "       errors one");
			setProfilePicURL(downloadURL);
		}
	};

	useEffect(() => {
		getUserInformation();
		getUserProfilePicture();
	}, [auth]);

	/**
	 *  Handles download of resume
	 */
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
	/**
	 *  Handles download of coverletter
	 */
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
			<div style={{ textAlign: "right", marginRight: "7%", marginTop: "1%" }}>
				<EditProfile user={user} setUser={setUser}></EditProfile>
			</div>
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
								<u>{numConnections} Connections</u>
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
						{work &&
							work.map((work, index) => (
								<Fragment key={index}>
									<div className="profile-desc-row">
										<img src={workpic} alt="person"></img>
										<div>
											<h3>{work.position}</h3>
											<p>{work.company}</p>
											<p>
												{work.startDate} - {work.endDate}
											</p>
										</div>
									</div>
									{/* Add a horizontal rule between schools */}
									{index !== work.length - 1 && <hr />}
								</Fragment>
							))}
					</Card>
					<Card className="educationcard">
						<h5>Education</h5>
						<hr></hr>
						{education &&
							education.map((school, index) => (
								<Fragment key={index}>
									<div className="profile-desc-row">
										<img src={schoolpic} alt="person"></img>
										<div>
											<h3>{school.name}</h3>
											<p>
												{school.startDate} - {school.endDate}
											</p>
											<p>{school.major}</p>
										</div>
									</div>
									{/* Add a horizontal rule between schools */}
									{index !== education.length - 1 && <hr />}
								</Fragment>
							))}
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
