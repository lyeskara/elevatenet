import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
	getDoc,
	query,
	where,
	getDocs,
	setDoc,
	collection,
	doc,
	updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import person from ".././../images/test.gif";
import { GrMailOption, GrPhone } from "react-icons/gr";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import "../../styles/profile.css";

function OtherUsersProfile() {
	const [follow, setfollow] = useState(false);
	const { id } = useParams();
	const [user, setUser] = useState({});
	const [userInfo, SetUserInfo] = useState({
		profile_picture: "",
		first_name: "",
		last_name: ""
	});
	const [connect, Setconnect] = useState(false);
	const storage = getStorage();
	const currId = auth.currentUser.uid;
	const followedId = id;
	const connection_requestsReference = collection(db, "connection_requests");
	const connectionsRef = collection(db, "connection")
	//function that handles the following feature, checks if the user is following each other, if not, the connection is added to the database

	useEffect(() => {
		getDoc((doc(collection(db, "users_information"), currId))
		).then((informations) => {
			const { profilePicUrl, firstName, lastName } = informations.data()
			const obj = {
				profile_picture: profilePicUrl,
				first_name: firstName,
				last_name: lastName
			}
			SetUserInfo(obj)
		})
	}, [])
	const handlefollow = async () => {
		const authdoc = doc(connection_requestsReference, currId);
		const array = [];
		getDocs(connection_requestsReference)
			.then((word) => {
				word.docs.forEach((doc) => {
					array.push(doc.id);
				});
				const condition = array.includes(authdoc.id);
				if (!condition) {
					setDoc(doc(connection_requestsReference, currId), {
						requests: [followedId],
					});
				} else {
					getDoc(authdoc).then((document) => {
						const followedUsers = document.data().requests;
						if (!followedUsers.includes(followedId)) {
							followedUsers.push(followedId);
							return updateDoc(doc(connection_requestsReference, currId), {
								...document.data(),
								requests: followedUsers,
							});
						} else {
							console.log("already followed!");
						}
					});
					getDoc(doc(collection(db, 'Notifications'), followedId)).then((followed_doc) => {
						const note = {
							message: `${userInfo.first_name} ${userInfo.last_name} has sent a connection request!`,
							profilePicUrl: userInfo.profile_picture
						}
						if ((followed_doc.data() === undefined) || (followed_doc.data().notifications.length === 0)) {
							setDoc(doc(collection(db, 'Notifications'), followedId), { notifications: [note] })
						} else {
							const notifications_array = followed_doc.data().notifications;
							let condition = false
							notifications_array.forEach((notif)=>{
                               if(!(notif.message === note.message)){
                                condition = true;
							   }
							})
							if(condition){
								notifications_array.push(note)
							}	
							console.log(notifications_array)						
							updateDoc(doc(collection(db, 'Notifications'), followedId),{
								 notifications: notifications_array 
							})

						}
					})
				}
			})
			.catch((error) => {
				console.log(error);
			});
		setfollow(true);
	};
	//this function handles the unfollow feature, updates the database of the unfollow connection
	const handleunfollow = async () => {
		const confirmed = window.confirm(
			"Are you sure you want to unfollow this user?"
		);
		if (confirmed) {
			getDoc(doc(connection_requestsReference, currId))
				.then((word) => {
					if (word.exists) {
						const followedUsers = word.data().requests;
						if (followedUsers.includes(followedId)) {
							const updatedFollowedUsers = followedUsers.filter(
								(userId) => userId !== followedId
							);
							return updateDoc(doc(connection_requestsReference, currId), {
								...word.data(),
								requests: updatedFollowedUsers,
							});
						}
					}
				})
				.catch((error) => {
					console.log(error);
				});
			setfollow(false);
		}
	};

	useEffect(() => {
		getDoc(doc(collection(db, "users_information"), id))
			.then((doc) => {
				if (doc.exists) {
					setUser({ ...doc.data(), id: doc.id });
				} else {
					console.log("error");
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}, [id]);

	const downloadResume = async () => {
		const storageRef = ref(storage, `resume/${user.id}/resume`);
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
		const storageRef = ref(storage, `CL/${user.id}/CL`);
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
	useEffect(() => {
		getDoc(doc(connection_requestsReference, currId)).then((requests_ids) => {
			const request_array = requests_ids.data().requests
			if (request_array.includes(followedId)) {
				setfollow(true)
			}
		})
		getDoc(doc(connectionsRef, currId)).then((connections_ids) => {
			const connections_array = connections_ids.data().connections
			if (connections_array.includes(followedId)) {
				Setconnect(true)
			}
		})
	}, [id])
	function handleUnconnect() {
		const confirmed = window.confirm(
			"Are you sure you want to unconnect this user?"
		);
		if (confirmed) {
			getDoc(doc(connectionsRef, currId))
				.then((word) => {
					if (word.exists) {
						const ConnectedUsers = word.data().connections;
						if (ConnectedUsers.includes(followedId)) {
							const updatedConnectedUsers = ConnectedUsers.filter(
								(userId) => userId !== followedId
							);
							return updateDoc(doc(connectionsRef, currId), {
								...word.data(),
								connections: updatedConnectedUsers
							});
						}
					}
				})
				.catch((error) => {
					console.log(error);
				});
			Setconnect(false);
		}
	}
	return (
		<div className="contain">
			{currId !== id ? (
				connect ? (
					<div style={{ textAlign: "right" }}>
						<Button className="unfollow_button" onClick={handleUnconnect}>
							Unconnect
						</Button>
					</div>
				) : (
					!follow ? (
						<div style={{ textAlign: "right" }}>
							<Button className="follow_button" onClick={handlefollow}>
								Connect
							</Button>
						</div>
					) : (
						<div style={{ textAlign: "right" }}>
							<Button className="unfollow_button" onClick={handleunfollow}>
								Pending
							</Button>
						</div>
					)
				)
			) : null}
			{informations(user, downloadResume, downloadCL)}
		</div>
	);
}

function informations(user, downloadResume, downloadCL) {
	return (
		<div className="contain">
			<Row className="gap-5">
				<Col className="col1" xs={12} md={{ span: 3, offset: 1 }}>
					<Card className="profilecard">
						<img
							src={user.profilePicUrl}
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

export default OtherUsersProfile;
