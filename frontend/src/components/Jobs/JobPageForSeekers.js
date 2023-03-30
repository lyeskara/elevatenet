//importing modules
import React, { useEffect, useState, useRef } from "react";
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
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-bootstrap";

function JobPageForSeekers() {
	const [postings, setPostings] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [userSkills, setUserSkills] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		fetchJobPostings();
	}, []);

	function fetchJobPostings() {
		const postingsCollection = collection(db, "posting");
		const q = query(postingsCollection);
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const docs = [];
			querySnapshot.forEach((doc) => {
				docs.push({
					id: doc.id,
					...doc.data(),
				});
			});
			setPostings(docs);
		});

		return unsubscribe;
	}

	// Load user's skills data
	useEffect(() => {
		const userDocRef = doc(db, "users_information", auth.currentUser.uid);
		getDoc(userDocRef).then((doc) => {
			if (doc.exists()) {
				setUserSkills(doc.data().skills || []);
			}
		});
	}, []);

	function handleSearchQueryChange(event) {
		setSearchQuery(event.target.value);
	}

	function handleFilterBySkills() {
		const filteredPostings = postings.filter((posting) => {
			if (!userSkills.length) {
				// if user has no skills, show all postings
				return true;
			}
			// check if posting's required skills intersect with user's skills
			const postingSkills = posting.skills.map((skill) => skill.toLowerCase());
			const userSkillsLower = userSkills.map((skill) => skill.toLowerCase());
			return postingSkills.some((skill) => userSkillsLower.includes(skill));
		});
		setPostings(filteredPostings);
	}

	function handleResetFilters() {
		setSearchQuery("");
		// Fetch job postings again
		fetchJobPostings();
	}

	const filteredPostings = postings.filter(
		(posting) =>
			posting.job_title &&
			posting.job_title.toLowerCase().includes(searchQuery.toLowerCase())
	);

	function handleRedirection(id, applyHereLink) {
		if (applyHereLink) {
			window.location.href = applyHereLink; // Redirect to applyHereLink
		} else {
			navigate(`/ApplyToJobs/${id}`); // Redirect to /ApplyToJobs/${id}
		}
	}
	const [postingsAD, setPostingsAD] = useState([]);

	useEffect(() => {
		const postingsCollectionAD = collection(db, "posting");
		const q = query(
			postingsCollectionAD,
			where("advertise", "in", [true, "on"])
		);

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const docs = [];
			querySnapshot.forEach((doc) => {
				docs.push({
					id: doc.id,
					...doc.data(),
				});
			});
			const shuffledDocs = docs.sort(() => 0.5 - Math.random());
			const selectedDocs = shuffledDocs.slice(0, 5);
			setPostingsAD(selectedDocs);
		});

		return () => {
			unsubscribe();
		};
	}, []);

	return (
		<>
			<h1>Apply to Jobs</h1>
			<div className="d-flex mb-3">
				<input
					type="text"
					className="form-control me-2"
					placeholder="Search job postings"
					value={searchQuery}
					onChange={handleSearchQueryChange}
				/>
				<button className="btn btn-primary me-2" onClick={handleFilterBySkills}>
					Filter by Skills
				</button>
				<button className="btn btn-secondary" onClick={handleResetFilters}>
					Reset Filters
				</button>
			</div>
			<Container>
				<Row>
					{filteredPostings.map((posting) => (
						<Col md={6} key={posting.id}>
							<Card className="mb-3">
								<Card.Body>
									<Card.Title>{posting.job_title}</Card.Title>
									<Card.Subtitle className="mb-2 text-muted">
										{posting.company}
									</Card.Subtitle>
									<Card.Text>{posting.description}</Card.Text>
									<Card.Text>{posting.skills.join(", ")}</Card.Text>
									<Button
										variant="primary"
										style={{ backgroundColor: "#27746A" }}
										onClick={() => handleRedirection(posting.id)}
									>
										Apply Now
									</Button>
								</Card.Body>
							</Card>
						</Col>
					))}
				</Row>
				{/* SPONSORED CAROUSEL */}
				<Row>
					<h1>Sponsored</h1>
					<Carousel>
						{postingsAD.map((posting) => (
							<Carousel.Item key={posting.id}>
								<Card className="mb-3">
									<Card.Body>
										<Card.Title>{posting.title}</Card.Title>
										<Card.Subtitle className="mb-2 text-muted">
											{posting.company}
										</Card.Subtitle>
										<Card.Text>{posting.description}</Card.Text>
										<Card.Text>{posting.skills}</Card.Text>
										<Button
											variant="primary"
											style={{ backgroundColor: "#27746A" }}
											onClick={() =>
												handleRedirection(posting.id, posting.apply_here)
											}
										>
											Apply Now
										</Button>
									</Card.Body>
								</Card>
							</Carousel.Item>
						))}
					</Carousel>
				</Row>
			</Container>
		</>
	);
}

export default JobPageForSeekers;
