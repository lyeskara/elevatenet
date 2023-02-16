import React, { useEffect, useState } from "react";
import { collection, getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Card from "react-bootstrap/Card";
import "../../styles/JobPostings.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';


function JobPostings() {
	const [user, setUser] = useState({});
	// const [seen, setSeen] = useState(true);
	// const togglePop = () => {
	// 	setSeen(!seen);
	// }
	const handleClick = () => {
		window.location.href = '/CreateNewPosting';
	  };
	return (
		//Profile card

		<Container className="container">
			<Row className="gap-6">
				<Col xs={12} md={4}>
					<Card className="jobs-menu">
						<h1> Jobs </h1>
						<b> Jobs Postings </b>
						<b> Advertisements </b>
					</Card>
				</Col>

				<Col xs={12} md={8}>

				{/* button at the top */}
						<Button variant="primary" size="lg" onClick={handleClick}>
							Create a New Job Posting
						</Button>
				{/* pop-up window */}
					{/* {seen && <PopUp toggle={togglePop}/>} */}
				{/* card for posting */}
					<Card className="card">
						{/* code here */}
					</Card>
				</Col>
			</Row>
		</Container>
	);
}

export default JobPostings;