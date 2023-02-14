import React, { useEffect, useState } from "react";
import { collection, getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { getStorage, ref } from "firebase/storage";
import Card from "react-bootstrap/Card";
import "../../styles/profile.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import person from "./logo512.png";

function Profile() {
	const [user, setUser] = useState({});
	const storageRef = ref(
		"https://console.firebase.google.com/project/soen390-b027d/storage/soen390-b027d.appspot.com/files"
	);
	useEffect(() => {
		async function getData() {
			await getDoc(
				doc(collection(db, "users_information"), auth.currentUser.uid)
			)
				.then((doc) => {
					console.log("doc");
					if (doc.exists) {
						console.log(doc.data + " ");
						setUser({ ...doc.data(), id: doc.id });
					} else {
						console.log("nikmok");
					}
				})
				.catch((error) => {
					console.log(error);
				});
		}
		console.log(getData());

		return () => {
			getData();
		};
	}, []);
	return (
		//Profile card

		<Container className="container">
			<Row className="gap-6">
				<Col xs={12} md={4}>
					<Card className="profilecard">
						<img src={person} alt="Avatar" class="avatar"></img>
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
						<h1> {user.email} </h1>
						<b> {user.contact} </b>
					</Card>
				</Col>

				<Col xs={12} md={8}>
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
								<h3>Business Intelligence Analyst</h3>
								<p>DODO Inc.</p>
								<p> Feb 2022 - Present</p>
							</div>
						</div>
					</Card>

					<Card className="educationcard">
						<h5>Education</h5>
						<hr></hr>
						<div className="profile-desc-row">
							<img src={person}></img>
							<div>
								<h3>Concordia Universtiy</h3>
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
						<div>
							<span className="skills-btn">{user.skills}</span>
							<span className="skills-btn">English</span>
						</div>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}

export default Profile;

/* <h1 className="name">{user.firstName} {user.lastName}</h1>
  <p className="bio">{user.bio}</p>
  <div className="education">
    <h2>Education</h2>
    <ul>
      <li>{user.education}</li>
    </ul>
  </div>
  <div className="work-experience">
    <h2>Work Experience</h2>
    <ul>
      <li> {user.workExperience}</li>
    </ul>
  </div>
  <div className="skills">
    <h2>Skills</h2>
    <ul>
      <li>{user.skills}</li>
    </ul>
  </div>
  <div className="languages">
    <h2>Languages</h2>
    <ul>
      <li>{user.languages}</li>
    </ul>
  </div>
  <div className="cotnactinfo">
    <h2>ContactInfo</h2>
    <ul>
      <li>{user.contactinfo}</li>
    </ul>
  </div> */
