import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
	getDoc,
	getDocs,
	setDoc,
	collection,
	doc,
	updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { GrMailOption, GrPhone } from "react-icons/gr";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import "../../styles/profile.css";
import person from ".././../images/test.gif";

function OtherRecruitersProfile() {
	const [follow, setfollow] = useState(false);
	const { id } = useParams();
	const [user, setUser] = useState({});
	const [userInfo, SetUserInfo] = useState({
		profile_picture: "",
		first_name: "",
		last_name: "",
	});
	const [connect, Setconnect] = useState(false);
	const [numConnections, setNumConnections] = useState(0);
	const storage = getStorage();
	const currId = auth.currentUser.uid;
	const followedId = id;
	const connection_requestsReference = collection(db, "connection_requests");
	const connectionsRef = collection(db, "connection");
	//function that handles the following feature, checks if the user is following each other, if not, the connection is added to the database

	useEffect(() => {
		getDoc(doc(collection(db, "users_information"), currId)).then(
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
					getDoc(doc(collection(db, "Notifications"), followedId)).then(
						(followed_doc) => {
							const note = {
								message: `${userInfo.first_name} ${userInfo.last_name} has sent a connection request!`,
								profilePicUrl: userInfo.profile_picture,
							};
							if (
								followed_doc.data() === undefined ||
								followed_doc.data().notifications.length === 0
							) {
								setDoc(doc(collection(db, "Notifications"), followedId), {
									notifications: [note],
								});
							} else {
								const notifications_array = followed_doc.data().notifications;
								let condition = false;
								notifications_array.forEach((notif) => {
									if (!(notif.message === note.message)) {
										condition = true;
									}
								});
								if (condition) {
									notifications_array.push(note);
								}
								updateDoc(doc(collection(db, "Notifications"), followedId), {
									notifications: notifications_array,
								});
							}
						}
					);
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

	const getUserData = async () => {
		try {
			const userDoc = await getDoc(
				doc(collection(db, "recruiters_informations"), id)
			);

			if (userDoc.exists) {
				// Set the user state
				setUser({ ...userDoc.data(), id: userDoc.id });
			}
			const connections = (
				await getDoc(doc(collection(db, "connection"), id))
			).data().connections;

			let counter = 0;
			connections.forEach(() => {
				counter++;
			});

			setNumConnections(counter);
		} catch (error) {
			console.log(error);
		}
		console.log(user);
	};

	useEffect(() => {
		getUserData();
	}, [id]);

	useEffect(() => {
		getDoc(doc(connection_requestsReference, currId)).then((requests_ids) => {
			const request_array = requests_ids.data().requests;
			if (request_array.includes(followedId)) {
				setfollow(true);
			}
		});
		getDoc(doc(connectionsRef, currId)).then((connections_ids) => {
			const connections_array = connections_ids.data().connections;
			if (connections_array.includes(followedId)) {
				Setconnect(true);
			}
		});
	}, [id]);
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
								connections: updatedConnectedUsers,
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
				) : !follow ? (
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
			) : null}
			{informations(user, numConnections)}
		</div>
	);
}
function informations(user, numConnections) {
	return (
		//Profile card

		<div className="contain">
			<Row className="gap-5">
				<Col className="col1" xs={12} md={{ span: 3, offset: 4 }}>
					<Card className="profilecard">
						<img
							src={user.profilePicUrl || person}
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

export default OtherRecruitersProfile;
