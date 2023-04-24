import React, { useEffect, useState } from "react";
import { collection, getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Card from "react-bootstrap/Card";
import "../../styles/profile.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { GrMailOption, GrPhone } from "react-icons/gr";
import EditRecruiterProfile from "./EditRecruiterProfile";
import { getStorage, ref, getDownloadURL, getMetadata } from "firebase/storage";

/**
 * Profile component displays the user's profile information.
 * @returns Profile component
 *
 */
function RecruiterProfile() {
	const [user, setUser] = useState({});
	const [numConnections, setNumConnections] = useState(0);
	const [profilePicURL, setProfilePicURL] = useState("");
	const storage = getStorage();

	/**
	 * getUserInformation() gets the user's information from the database.
	 * @returns user information
	 *
	 */

	const getUserInformation = async () => {
		const userDoc = await getDoc(
			doc(collection(db, "recruiters_informations"), auth.currentUser.uid)
		);

		if (userDoc.exists) {
			// Set the user state
			setUser({ ...userDoc.data(), id: userDoc.id });
			console.log(userDoc.data() + " this is user data");
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
	/**
	 * getUserProfilePicture() gets the user's profile picture from Firebase Storage.
	 * @returns user's profile picture
	 *
	 */
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
	/**
	 * useEffect() is a React hook that runs once the component is mounted.
	 * @returns user information and profile picture
	 *
	 */
	useEffect(() => {
		getUserInformation();
		getUserProfilePicture();
	}, [auth]);

	return (
		//Profile card

		<div className="contain">
			<div style={{ textAlign: "right", marginRight: "7%", marginTop: "1%" }}>
				<EditRecruiterProfile
					user={user}
					setUser={setUser}
				></EditRecruiterProfile>
			</div>
			<Row className="gap-5">
				<Col className="col1" xs={12} s={12} md={{ span: 3, offset: 4 }}>
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
						<p style={{ color: "#A6A6A6" }}> {user.company}</p>
						<p> {user.bio} </p>
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
				</Col>
			</Row>
		</div>
	);
}
export default RecruiterProfile;
