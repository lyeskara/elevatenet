//In this class users will have the possibility to now view their jobs page
//Here they have a button that redirects them to a page to create a new job posting
//Here they can also view all the job postings they created thus far
//The JobPostings() function returns the side menu of the jobs page, the create a new posting button,
//And lastly is displays all the job postings created

import React, { useEffect, useState } from "react";
import { collection, getDoc, doc, onSnapshot, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Card from "react-bootstrap/Card";
import "../../styles/JobPostings.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';

function JobPostings() {
	const handleClick = () => {
		window.location.href = '/CreateNewPosting';
	  };
	//handle the sidebar button
	const handleClickJobPostings = () => {
		window.location.href = '/JobPostings';
	  };
//=================================================================================================================
	const [posts, setPosts] = useState([]);

	//this use effect() method is used to get the data from the database, native to react
	useEffect(() => {
		const getData = async () =>{
		const postingData = await getDocs(collection(db, "posting"));
		setPosts(postingData.docs.map((doc) => ({ ...doc.data(), id: doc.id})));
		console.log(postingData);
		};
		getData();
	}, []);	  
//=================================================================================================================
	return (
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
				{/* button at the top to create a job posting*/}
					<div>
						<Button variant="primary" size="lg" block className="w-100" style={{backgroundColor:'#27746a'}} onClick={handleClick} >
							Create a New Job Posting
						</Button>
					</div>
				{/* CARD FOR JOB POSTINGS */}
					<Card className="card">
						{/*this map method returns an array with results and the results from this
						are the data needed that creates a post being job title, company and description*/}
						{posts.map((data) => (
							<div className="post-content" key={data.id}>
								<p>{data.job_title}</p>
								<p>{data.company}</p>
								<p>{data.description}</p>
								{/* <p>{data.deadline}</p> */}
								<hr></hr>
							</div>
						))}

					</Card>
				</Col>
			</Row>
		</Container>
	);
}

// WILL BE USED IN NEXT SPRINT TO HAVE INDIVIDUAL CARDS
const Frame = ({job_title , company , description, deadline}) => {
    console.log(job_title + " " + company + " " + description + " " + deadline);
    return (
        <center>
            <div className="div">
				<p>Job Title : {job_title}</p>
				<p>Company : {company}</p>						
				<p>Description : {description}</p>
				<p>Deadline : {deadline}</p>
            </div>
        </center>
    );
}

export default JobPostings;