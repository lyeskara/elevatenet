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
	const handleClickJobPostings = () => {
		window.location.href = '/JobPostings';
	  };
	return (
		//Profile card

		<Container className="container">
			<Row className="gap-6">
				{/* JOB MENU BLOCK ON THE LEFT TO NAVIGATE BETWEEN JOB POSTINGS AND ADVERTS */}
				<Col xs={12} md={3}>
					<Card className="jobs-menu">
						<h2> Jobs </h2>
						<h5 onClick={handleClickJobPostings}> Job Postings </h5>
						<h5> Advertisements </h5>
					</Card>
				</Col>

				<Col xs={12} md={8}>
				{/* button at the top */}
					<div>
						<Button variant="primary" size="lg" block className="w-100" style={{backgroundColor:'#27746a'}} onClick={handleClick} >
							Create a New Job Posting
						</Button>
					</div>
				{/* card for postings */}
					<Card className="card">
						{/* code here */}
					</Card>
				</Col>
			</Row>
		</Container>
	);
}

export default JobPostings;