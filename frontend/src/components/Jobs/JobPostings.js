//In this class users will have the possibility to now view their jobs page
//Here they have a button that redirects them to a page to create a new job posting
//Here they can also view all the job postings they created thus far
//The JobPostings() function returns the side menu of the jobs page, the create a new posting button,
//And lastly is displays all the job postings created

import React, { useEffect, useState } from "react";
import { collection, query,where , getDoc, doc, onSnapshot, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Card from "react-bootstrap/Card";
import "../../styles/JobPostings.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useHistory } from 'react-router-dom';


function JobPostings() {
	//========================================================================================/========================================================================================
	// window.onload = function() {
	// 	location.reload();
	// }
	const [isLoaded, setIsLoaded] = useState(false);


	//========================================================================================/========================================================================================
	//handle the button to redirect to the posting creation page
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
		  } catch (error) {
			console.error("Error deleting document: ", error);
		  }
	};
	//handle the save when editing the job posting
	const handleSave = async (id) => {
		const jobTitle = document.getElementById('job_title').value;
		const company = document.getElementById('company').value;
		const description = document.getElementById('description').value;
		await updateDoc(doc(db, "posting", id), {
			job_title: jobTitle,
			company: company,
			description: description
		});
		setShowModal(false);

	}
	//const & states for editing the job posting
	const [showModal, setShowModal] = useState(false);
	const [currentJob, setCurrentJob] = useState({});
	const [posts, setPosts] = useState([]);

	//this use effect() method is used to get the data from the database, native to react
	useEffect(() => {
		const getData = async () => {
		  const user = auth.currentUser;
		  if (user) {
			const email = user.email;
			const q = query(collection(db, "posting"), where("created_by", "==", email));
			const postingData = await getDocs(q);
			setPosts(postingData.docs.map((doc) => ({ ...doc.data(), id: doc.id})));
			setIsLoaded(true);
			console.log(postingData);
		  }
		};
		getData();
		// // Set up a timer to trigger the getData function every 2 seconds
		// const intervalId = setInterval(getData, 2000);

		// // Clean up the interval timer when the component unmounts
		// return () => clearInterval(intervalId);
	  }, [posts]); // pass an empty dependency array
	  

	return (
		<Container className="container d-flex justify-content-center mx-auto">
			<Row className="gap-6 d-flex justify-content-center" style={{minWidth: "80%"}}>
				{/* JOB MENU BLOCK ON THE LEFT TO NAVIGATE BETWEEN JOB POSTINGS AND ADVERTS */}
				<Col xs={12} sm={8}  lg={4} style={{minWidth: "30%"}}>
					<Card className="jobs-menu">
						<h2> Jobs </h2>
						<hr></hr>
						<h5 onClick={handleClickJobPostings}> Job Postings </h5>
						<h5> Advertisements </h5>
						<br></br>
					</Card>
				</Col>

				<Col xs={12} sm={12}  lg={8} >
				
				{/* button at the top to create a job posting*/}
					<div>
						<Button variant="primary" size="lg" block className="w-100" style={{backgroundColor:'#27746a'}} onClick={handleClick} >
							Create a New Job Posting
						</Button>
					</div>
				{/* CARD FOR JOB POSTINGS */}
						{/*this map method returns an array with results and the results from this
						are the data needed that creates a post being job title, company and description*/}
						{isLoaded ? (
							posts.map((data) => (
								<div className="post-content" key={data.id}>
									<Card className="card">
										<div className="row">
											<div className="col-sm-8">
												<h5>{data.job_title}</h5>
											</div>
											<div className="col-sm-4 d-flex justify-content-end align-items-center">
												<Button variant="primary" className="btn-sm" style={{backgroundColor:'#27746a'}} onClick={() => {setCurrentJob(data); setShowModal(true)}}>
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
							))
						) : (<p>Loading job postings...</p>)}
				</Col>
			</Row>
			
			{/* the pop up that comes out when clicking on edit button */}
			<Modal show={showModal} onHide={() => setShowModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Edit Job Posting</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form>
						<div className="form-group">
							<label htmlFor="job_title">Job Title:</label>
							<input type="text" className="form-control" id="job_title" defaultValue={currentJob.job_title} />
						</div>
						<div className="form-group">
							<label htmlFor="company">Company:</label>
							<input type="text" className="form-control" id="company" defaultValue={currentJob.company} />
						</div>
						<div className="form-group">
							<label htmlFor="description">Description:</label>
							<textarea className="form-control" id="description" rows="3" defaultValue={currentJob.description}></textarea>
						</div>
					</form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowModal(false)}>
						Close
					</Button>
					<Button variant="primary" onClick={() => handleSave(currentJob.id)} style={{ backgroundColor: "#27746a" }}>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>

		</Container>
	
	);//.
	
}

export default JobPostings;