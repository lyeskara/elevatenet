// Importing necessary modules
import React, { useEffect, useState } from "react";
import { collection, query, where, getDoc, doc, onSnapshot, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Card from "react-bootstrap/Card";
import "../../styles/JobPostings.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function JobPostings() {
	// State and constants for handling data
	const [isLoaded, setIsLoaded] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [currentJob, setCurrentJob] = useState({});
	const [posts, setPosts] = useState([]);

	// Function to redirect to the "CreateNewPosting" page
	const handleClick = () => {
		window.location.href = '/CreateNewPosting';
	};

	// Function to redirect to the "JobPostings" page
	const handleClickJobPostings = () => {
		window.location.href = '/JobPostings';
	};

	// Function to delete a job posting from the database
	const handleDelete = async (id) => {
		try {
			await deleteDoc(doc(db, "posting", id));
		} catch (error) {
			console.error("Error deleting document: ", error);
		}
	};

	// Function to handle save when editing a job posting
	const handleSave = async (id) => {
		// Get job title, company and description from the input fields
		const jobTitle = document.getElementById('job_title').value;
		const company = document.getElementById('company').value;
		const description = document.getElementById('description').value;
		// Update the job posting with the new data
		await updateDoc(doc(db, "posting", id), {
			job_title: jobTitle,
			company: company,
			description: description
		});
		// Hide the modal
		setShowModal(false);
	}

	// UseEffect to get job postings data from the database
	useEffect(() => {
		const getData = async () => {
			// Get current user email
			const user = auth.currentUser;
			if (user) {
				const email = user.email;
				// Query the database to get job postings created by the user
				const q = query(collection(db, "posting"), where("created_by", "==", email));
				const postingData = await getDocs(q);
				// Set posts state with the job postings data and show it
				setPosts(postingData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
				setIsLoaded(true);
			}
		};
		getData();
	}, [posts]); // pass an posts dependency array

	// This component displays a page for job postings
// and advertisements with a menu block on the left to navigate between them.

return (
	<Container className="container d-flex justify-content-center mx-auto">
		{/* JOB MENU BLOCK ON THE LEFT TO NAVIGATE BETWEEN JOB POSTINGS AND ADVERTS */}
		<Row className="gap-6 d-flex justify-content-center" style={{minWidth: "80%"}}>
			<Col xs={12} sm={8}  lg={4} style={{minWidth: "30%"}}>
				{/* This card displays the job menu block with Job Postings and Advertisements */}
				<Card className="jobs-menu">
					<h2> Jobs </h2>
					<hr></hr>
					{/* When the user clicks the "Job Postings" text, it calls handleClickJobPostings */}
					<h5 onClick={handleClickJobPostings}> Job Postings </h5>
					{/* Advertisements */}
					<h5> Advertisements </h5>
					<br></br>
				</Card>
			</Col>

			<Col xs={12} sm={12}  lg={8} >
				{/* This button creates a new job posting */}
				<div>
					<Button variant="primary" size="lg" block className="w-100" style={{backgroundColor:'#27746a'}} onClick={handleClick} >
						Create a New Job Posting
					</Button>
				</div>
				{/* CARD FOR JOB POSTINGS */}
				{/* If job postings data is loaded, the map method creates a card for each job posting */}
				{isLoaded ? (
					posts.map((data) => (
						<div className="post-content" key={data.id}>
							<Card className="card">
								{/* The job title */}
								<div className="row">
									<div className="col-sm-8">
										<h5>{data.job_title}</h5>
									</div>
									{/* Edit and Delete buttons */}
									<div className="col-sm-4 d-flex justify-content-end align-items-center">
										{/* When the user clicks the "Edit" button, it sets the current job and shows the modal */}
										<Button variant="primary" className="btn-sm" style={{backgroundColor:'#27746a'}} onClick={() => {setCurrentJob(data); setShowModal(true)}}>
											Edit
										</Button>
										{/* When the user clicks the "Delete" button, it calls handleDelete */}
										<Button variant="outline-danger" className="btn-sm" style={{backgroundColor:'white', color:'#ff7a7a', border:'2px solid #ff7a7a'}} onClick={() => handleDelete(data.id)}>
											Delete
										</Button>
									</div>
								</div>
								<hr />
								{/* The company and description */}
								<h6>{data.company}</h6>
								<p>{data.description}</p>
								{/* <p>{data.deadline}</p> */}
							</Card>
						</div>
					))
				) : (
					<p>Loading job postings...</p>
				)}
			</Col>
		</Row>
			
		<Modal 
			show={showModal} // Controls whether the modal is displayed or hidden
			onHide={() => setShowModal(false)} // Function to be called when the modal is closed
		>
			<Modal.Header closeButton>
				<Modal.Title>Edit Job Posting</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form>
					<div className="form-group">
						<label htmlFor="job_title">Job Title:</label>
						<input 
							type="text" 
							className="form-control" 
							id="job_title" 
							defaultValue={currentJob.job_title} // Sets the default value of the input field to the current job title
						/>
					</div>
					<div className="form-group">
						<label htmlFor="company">Company:</label>
						<input 
							type="text" 
							className="form-control" 
							id="company" 
							defaultValue={currentJob.company} // Sets the default value of the input field to the current company name
						/>
					</div>
					<div className="form-group">
						<label htmlFor="description">Description:</label>
						<textarea 
							className="form-control" 
							id="description" 
							rows="3" 
							defaultValue={currentJob.description} // Sets the default value of the textarea field to the current job description
						></textarea>
					</div>
				</form>
			</Modal.Body>
			<Modal.Footer>
				<Button 
					variant="secondary" 
					onClick={() => setShowModal(false)} // Function to be called when the Close button is clicked
				>
					Close
				</Button>
				<Button 
					variant="primary" 
					onClick={() => handleSave(currentJob.id)} // Function to be called when the Save Changes button is clicked
					style={{ backgroundColor: "#27746a" }} // Sets the background color of the Save Changes button
				>
					Save Changes
				</Button>
			</Modal.Footer>
		</Modal>

	</Container>

	
	);
	
}

export default JobPostings;