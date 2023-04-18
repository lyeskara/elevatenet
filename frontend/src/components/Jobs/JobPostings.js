// Importing necessary modules
import React, { useEffect, useState } from "react";
import {
	collection,
	query,
	where,
	getDoc,
	doc,
	onSnapshot,
	getDocs,
	deleteDoc,
	updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import Card from "react-bootstrap/Card";
import "../../styles/JobPostings.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function JobPostings() {
	// State and constants for handling data
	const [isLoaded, setIsLoaded] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [currentJob, setCurrentJob] = useState({});
	const [posts, setPosts] = useState([]);

	// Function to redirect to the "CreateNewPosting" page
	const handleClick = () => {
		window.location.href = "/CreateNewPosting";
	};

	// Function to redirect to the "JobPostings" page
	const handleClickJobPostings = () => {
		window.location.href = "/JobPostings";
	};
	const handleClickAdvertisements = () => {
		window.location.href = "/Advertisements";
	};

	// Function to delete a job posting from the database
	const handleDelete = async (id) => {
		const confirmed = window.confirm("Are you sure you want to delete this post?");
	
		if (confirmed) {
			try {
				await deleteDoc(doc(db, "posting", id));
				window.location.reload();
			} catch (error) {
				console.error("Error deleting document: ", error);
			}
		}
	};

	// Function to handle save when editing a job posting
	const handleSave = async (id) => {
		// Get job title, company and description from the input fields
		const resume_required = document.getElementById("resume_required");
		const cover_letter_required = document.getElementById("cover_letter_required");
		const advertise = document.getElementById("advertise");
		
		const jobTitle = document.getElementById("job_title").value;
		const company = document.getElementById("company").value;
		const description = document.getElementById("description").value;
		const skillsElement = document.getElementById("skills");
		const skills = skillsElement.value.split(",");
		const deadline = document.getElementById("deadline").value;
		
		if (resume_required && resume_required.checked) {
		  currentJob.resume_required = true;
		} else {
		  currentJob.resume_required = false;
		}
		
		if (cover_letter_required && cover_letter_required.checked) {
		  currentJob.cover_letter_required = true;
		} else {
		  currentJob.cover_letter_required = false;
		}
		
		if (advertise && advertise.checked) {
		  currentJob.advertise = true;
		} else {
		  currentJob.advertise = false;
		}
		
		// Update the job posting with the new data
		await updateDoc(doc(db, "posting", id), {
			job_title: jobTitle,
			company: company,
			description: description,
			resume_required: currentJob.resume_required,
			cover_letter_required: currentJob.cover_letter_required,
			skills: skills,
			deadline: deadline,
			advertise: currentJob.advertise,
		  });
		// Hide the modal
		setShowModal(false);
		window.location.reload();
	};

	// UseEffect to get job postings data from the database
	useEffect(() => {
		const getData = async () => {
			// Get current user email
			const user = auth.currentUser;
			if (user) {
				const email = user.email;
				// Query the database to get job postings created by the user
				const q = query(
					collection(db, "posting"),
					where("created_by", "==", email)
				);
				const postingData = await getDocs(q);
				// Set posts state with the job postings data and show it
				setPosts(
					postingData.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
				);
				setIsLoaded(true);
			}
		};
		getData();
	}, []); // pass an posts dependency array

	// This component displays a page for job postings
	// and advertisements with a menu block on the left to navigate between them.

	return (
		<Container className="container d-flex justify-content-center mx-auto">
			{/* JOB MENU BLOCK ON THE LEFT TO NAVIGATE BETWEEN JOB POSTINGS AND ADVERTS */}
			<Row
				className="gap-6 d-flex justify-content-center"
				style={{ minWidth: "80%" }}
			>
				<Col xs={12} sm={8} lg={4} style={{ minWidth: "30%" }}>
					{/* This card displays the job menu block with Job Postings and Advertisements */}
					<Card className="jobs-menu">
						<h2> Jobs </h2>
						<hr></hr>
						{/* When the user clicks the "Job Postings" text, it calls handleClickJobPostings */}
						<h4 onClick={handleClickJobPostings} style={{ color: "#27746a" }}>
							{" "}
							My Job Postings{" "}
						</h4>
						{/* Advertisements */}
						<h4
							onClick={handleClickAdvertisements}
							style={{ color: "#888888" }}
						>
							{" "}
							My Advertisements{" "}
						</h4>
						<br></br>
					</Card>
				</Col>

				<Col xs={12} sm={12} lg={8}>
					<h2 style={{ color: "#555555", marginTop: "32px" }}>
						
					</h2>
					{/* This button creates a new job posting */}
					<div>
						<Button
							variant="primary"
							size="lg"
							block
							className="w-100"
							style={{ backgroundColor: "#27746a" }}
							onClick={handleClick}
						>
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
											<h3 style={{ color: "#27764A" }}>{data.job_title}</h3>
										</div>
										{/* Edit and Delete buttons */}
										<div className="col-sm-4 d-flex justify-content-end align-items-center">
											{/* When the user clicks the "Edit" button, it sets the current job and shows the modal */}
											<Button
												variant="primary"
												onClick={() => {
													setCurrentJob(data);
													setShowModal(true);
												}}
												style={{ backgroundColor: "#27746A" }}
											>
												Edit
											</Button>
											{/* When the user clicks the "Delete" button, it calls handleDelete */}
											<Button
												variant="outline-danger"
												onClick={() => handleDelete(data.id)}
												style={{ marginLeft: "10px" }}
											>
												Delete
											</Button>
										</div>

									</div>
									<h5>{data.company}</h5>
									<hr />
									{/* The company and description */}

									<p>{data.description}</p>
									{/* SKILLS */}
									{data.skills && Array.isArray(data.skills) && (
										<div style={{ display: "flex", flexDirection: "row" }}>
											{data.skills.map((skill) => (
												<span key={skill} className="skills-btn">
													{skill}
												</span>
											))}
										</div>
									)}
									
									<hr />
									<h6>Apply before: <b>{data.deadline}</b></h6>
									{(data.cover_letter_required||data.resume_required||data.advertise)&& <hr />}
									{/* RESUME AND COVER LETTER REQUIRED */}
									{data.cover_letter_required && <b>Cover Letter Required</b>}
									{data.resume_required && <b>Resume Required</b>}
									{/* IF THE POSTING IS ADVERTISED */}
									{data.advertise && <b>Currently being Advertised</b>}
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
								required
								type="text"
								className="form-control"
								id="job_title"
								defaultValue={currentJob.job_title} // Sets the default value of the input field to the current job title
							/>
						</div>
						<div className="form-group">
							<label htmlFor="company">Company:</label>
							<input
								required
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
								required
							></textarea>
						</div>
						<div className="form-group">
							<label htmlFor="skills">Skills:</label>
							<textarea
								required
								className="form-control"
								id="skills"
								rows="3"
								defaultValue={currentJob.skills} // Sets the default value of the textarea field to the current job description
							></textarea>
						</div>
						<div className="form-group">
							<label htmlFor="cover_letter_required">
								Cover Letter Required:
							</label>
							<input
								type="checkbox"
								className="form-check-input"
								id="cover_letter_required"
								defaultChecked={currentJob.cover_letter_required} // Sets the default value of the checkbox to the current value of the cover_letter_required field
							/>
						</div>

						<div className="form-group">
							<label htmlFor="resume_required">Resume Required:</label>
							<input
								type="checkbox"
								className="form-check-input"
								id="resume_required"
								defaultChecked={currentJob.resume_required} // Sets the default value of the checkbox to the current value of the resume_required field
							/>
						</div>

						<div className="form-group">
							<label htmlFor="advertise">Advertised:</label>
							<input
								type="checkbox"
								className="form-check-input"
								// id="advertise"
								defaultChecked={currentJob.advertise} // Sets the default value of the checkbox to the current value of the advertise field
							/>
							{console.log(currentJob.advertise)}
						</div>

						<div className="form-group">
							<label htmlFor="deadline">Deadline:</label>
							<input
								required
								type="date"
								id="deadline"
								defaultChecked={currentJob.deadline} // Sets the default value of the checkbox to the current value of the resume_required field
							/>
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
