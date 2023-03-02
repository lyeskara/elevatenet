//In this class users will have the possibility to now view their jobs page
//Here they have a button that redirects them to a page to create a new job posting
//Here they can also view all the job postings they created thus far
//The JobPostings() function returns the side menu of the jobs page, the create a new posting button,
//And lastly is displays all the job postings created

import React, { useEffect, useState } from "react";
import { collection, getDoc, doc, onSnapshot, getDocs, deleteDoc } from "firebase/firestore";
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
	//handles the delete button to delete that job posting document from the posting collection on firebase
	const handleDelete = async(id) =>{
		try {
			await deleteDoc(doc(db, "posting", id));
			window.location.reload(); // Reload the page after deleting the post
		  } catch (error) {
			console.error("Error deleting document: ", error);
		  }
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
		<Container className="container d-flex justify-content-center mx-auto">
			<Row className="gap-6 d-flex justify-content-center">
				{/* JOB MENU BLOCK ON THE LEFT TO NAVIGATE BETWEEN JOB POSTINGS AND ADVERTS */}
				<Col xs={12} md={3}>
					<Card className="jobs-menu">
						<h2> Jobs </h2>
						<hr></hr>
						<h5 onClick={handleClickJobPostings}> Job Postings </h5>
						<h5> Advertisements </h5>
						<br></br>
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
						{/*this map method returns an array with results and the results from this
						are the data needed that creates a post being job title, company and description*/}
						{posts.map((data) => (
							<div className="post-content" key={data.id}>
								<Card className="card">
									<div className="row">
										<div className="col-sm-8">
											<h5>{data.job_title}</h5>
										</div>
										<div className="col-sm-4 d-flex justify-content-end align-items-center">
											<Button variant="primary" className="btn-sm" style={{backgroundColor:'#27746a'}}>
												Edit
											</Button>
											<Button variant="outline-danger" className="btn-sm" style={{backgroundColor:'white', color:'#ff7a7a', border:'2px solid #ff7a7a'}} onClick={() => handleDelete(data.id)}>
												Delete
											</Button>
										</div>
									</div>
									<hr />
									<h6>{data.company}</h6>
									<p>{data.description}</p>
									{/* <p>{data.deadline}</p> */}
								</Card>
							</div>
						))}
				</Col>
			</Row>
		</Container>
	);
}

export default JobPostings;