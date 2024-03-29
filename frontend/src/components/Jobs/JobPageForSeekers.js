/*
This is a React component that displays job postings for seekers. It fetches job postings from the Firebase 
Firestore database and displays them. Users can search for postings by job title and filter by their skills.
They can also save a job post for quick access. If they click on the apply button, they will be directed 
to the application page for that job post.
*/
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
	setDoc,
	deleteDoc,
	updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import "../../styles/JobPostings.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

import { Carousel } from "react-bootstrap";
import Heart from "react-heart";

/**
 * The JobPageForSeekers page displays the jobs that users may interesting. If they desire, they can click on the apply button to be directed to the application page. They can also save a job post for quick access.
 *
 * @return { Object } The page as a React component with the information of the job posts.
 */
function JobPageForSeekers() {
	const [postings, setPostings] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [userSkills, setUserSkills] = useState([]);
	const navigate = useNavigate();

	const savedCollection = collection(db, "savedPostings");
	const { id } = useParams();
	const postingId = id;
	const [saved, setSaved] = useState({});
	const currId = auth.currentUser.uid;

	const [postingsAD, setPostingsAD] = useState([]);

	// Function to redirect to the "JobPostings" page
	const handleClickJobPostings = () => {
		window.location.href = "/JobPageForSeekers";
	};
	const handleClickSavedJobs = () => {
		window.location.href = "/SavedJobs";
	};

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

	/* A function that handles search query change
	 *
	 * @param event
	 *
	 */

	function handleSearchQueryChange(event) {
		setSearchQuery(event.target.value);
	}

	/* A function that filters the skills
	 *
	 * @param {none}
	 * @returns {collection item in database} A new group instance is stored in the Firestore database for further use.
	 */

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

	let filteredPostings = postings;

	if (searchQuery.trim() !== "") {
		filteredPostings = postings.filter(
			(posting) =>
				(posting.job_title &&
					posting.job_title
						.toLowerCase()
						.includes(searchQuery.toLowerCase())) ||
				(posting.company &&
					posting.company.toLowerCase().includes(searchQuery.toLowerCase()))
		);
	}

	/**
	 * The handleRedirection method redirects the user based on if the job posting contains a link or not.
	 * If a third party link is provided, a pop up will show up when the user clicks on apply before being redirected to the third party link
	 * @param id (str): The ID of the job to apply for
	 * @param applyHereLink (str): The URL of the third-party website where the user can apply for the job, if available. If not available, this should be None.
	 * @return none
	 */
	function handleRedirection(id, applyHereLink) {
		if (!applyHereLink) {
			// If there is no applyHereLink, redirect to the ApplyToJobs page
			navigate(`/ApplyToJobs/${id}`);
		} else {
			// If there is an applyHereLink, prompt the user with a confirmation dialog
			const confirm = window.confirm(
				"Are you sure you want to be navigated to a third-party site to apply for this job?"
			);
			if (confirm) {
				// If the user clicks "OK", redirect to the applyHereLink
				window.open(applyHereLink, "_blank");
			} else {
				// If the user clicks "Cancel", do nothing
				return;
			}
		}
	}

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

	/**
	 * Function to handle the post being saved to store in savedPostings collection
	 * Save a post with the given postingId for the current user, or update an existing saved post.
	 * The function updates the savedCollection Firestore collection.
	 * @param  postingId (str): The ID of the post to save.
	 * @return none
	 */
	const handleSave = async (postingId) => {
		const authdoc = doc(savedCollection, currId);
		const arraySave = [];
		getDocs(savedCollection) //retrieve all the user ID that had a post saved
			.then((word) => {
				word.docs.forEach((doc) => {
					console.log(doc.id);
					arraySave.push(doc.id);
				});
				const condition = arraySave.includes(authdoc.id); //bool true if user is in the array
				console.log(condition);
				if (!condition) {
					setDoc(doc(savedCollection, currId), {
						saved: [postingId],
					});
				} else {
					getDoc(authdoc).then((document) => {
						const savedPosts = document.data().saved;
						if (!savedPosts.includes(postingId)) {
							savedPosts.push(postingId);
							return updateDoc(doc(savedCollection, currId), {
								...document.data(),
								saved: savedPosts,
							});
						} else {
							console.log("already saved!");
						}
					});
				}
			})
			.catch((error) => {
				console.log(error);
			});
		setSaved((prevSaved) => ({
			...prevSaved,
			[postingId]: true,
			savedProperty: true,
		}));
	};

	/**
	 * Function that will delete the post that was unsaved from the savedPostings collection
	 * Handles un-saving a posting by updating the saved collection in Firestore and setting the saved state to false.
	 * @param postingId (str): The ID of the posting to un-save.
	 * @return none
	 */
	const handleUnsave = async (postingId) => {
		getDoc(doc(savedCollection, currId))
			.then((word) => {
				if (word.exists) {
					const savedPosts = word.data().saved;
					console.log("save post in unsave", savedPosts);
					if (savedPosts.includes(postingId)) {
						const updatedSavedPosts = savedPosts.filter(
							(userId) => userId !== postingId
						);
						console.log("updated post in unsave", updatedSavedPosts);
						return updateDoc(doc(savedCollection, currId), {
							...word.data(),
							saved: updatedSavedPosts,
						});
					}
				}
			})
			.catch((error) => {
				console.log(error);
			});
		setSaved((prevSaved) => ({
			...prevSaved,
			[postingId]: false,
			savedProperty: false,
		}));
	};

	//retrieve the posting information and set the state of the saved posts
	useEffect(() => {
		const postingsCollection = collection(db, "posting");
		const q = query(postingsCollection);
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const docs = [];
			querySnapshot.forEach((doc) => {
				docs.push({
					id: doc.id,
					...doc.data(),
					isLiked: false, // Initialize isLiked state for each posting to false
					savedProperty: false, // Add saved property to each post object
				});
			});
			setPostings(docs);
		});

		// Fetch the saved posts from the database and update the `saved` state
		getDoc(doc(savedCollection, currId))
			.then((docSnapshot) => {
				if (docSnapshot.exists()) {
					const savedPosts = docSnapshot.data().saved;
					const newSavedState = {};
					savedPosts.forEach((postId) => {
						newSavedState[postId] = true;
					});
					setSaved(newSavedState);
					// Update the `savedProperty` property for each post object
					setPostings((prevPostings) => {
						return prevPostings.map((post) => {
							return {
								...post,
								savedProperty: newSavedState[post.id] ?? false,
							};
						});
					});
				}
			})
			.catch((error) => {
				console.log(error);
			});

		return () => {
			unsubscribe();
		};
	}, []);

	return (
		<>
			<Container>
				<div className="d-flex justify-content-center mx-auto">
					<Row
						className="gap-6 d-flex justify-content-center"
						style={{ minWidth: "80%" }}
					>
						<Col xs={12} sm={8} lg={2} style={{ minWidth: "30%" }}>
							{/* This card displays the job menu block with Job Postings and Advertisements */}
							<Card className="jobs-menu">
								<h2> Jobs </h2>
								<hr></hr>
								{/* When the user clicks the "Suggested jobs" text, it calls handleClickJobPostings */}
								<h4
									onClick={handleClickJobPostings}
									style={{ color: "#27746a" }}
								>
									{" "}
									Suggested Jobs{" "}
								</h4>
								{/* Saved posts */}
								<h4 onClick={handleClickSavedJobs} style={{ color: "#888888" }}>
									{" "}
									Saved Jobs{" "}
								</h4>
								<br></br>
							</Card>
						</Col>

						<Col xs={12} sm={12} lg={8}>
							<div className="d-flex mb-3 mt-4">
								<input
									type="text"
									className="form-control me-2 search-job"
									placeholder="Search job postings"
									value={searchQuery}
									onChange={handleSearchQueryChange}
								/>
								<button
									className="btn btn-primary me-2 skill-button"
									onClick={handleFilterBySkills}
								>
									Filter by Skills
								</button>
								<button
									className="btn btn-secondary"
									onClick={handleResetFilters}
								>
									Reset Filters
								</button>
							</div>
							{/* SPONSORED CAROUSEL */}
							<Col xs={12} sm={12} lg={10}>
								<h5 className="sponsor-title">Sponsored</h5>
								<Carousel>
									{postingsAD.map((posting) => (
										<Carousel.Item key={posting.id}>
											<Card className="mb-3 sponsor">
												<Card.Body>
													<Card.Title>
														<h3 style={{ color: "#27764A" }}>
															{posting.job_title}
														</h3>
													</Card.Title>
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
							</Col>
							{filteredPostings.map((posting) => (
								<Col xs={12} sm={12} lg={10} key={posting.id}>
									<Card className="mb-3">
										<Card.Body>
											<div>
												<div
													className="containRequest"
													style={{
														display: "flex",
														justifyContent: "space-between",
														alignItems: "center",
													}}
												>
													<h3 style={{ color: "#27764A" }}>
														{posting.job_title}
													</h3>
													{/* Render the button with the modified onClick handler */}
													<div className="containRequest">
														<Button
															className="apply-button"
															variant="primary"
															style={{
																backgroundColor: "#27746A",
																opacity:
																	new Date(posting.deadline) < new Date()
																		? 0.5
																		: 1, // Set opacity based on deadline
															}}
															disabled={new Date(posting.deadline) < new Date()} // Disable button based on deadline
															onClick={() =>
																handleRedirection(
																	posting.id,
																	posting.apply_here
																)
															}
														>
															{console.log(
																"Posting deadline:",
																posting.deadline,
																"Current date:",
																new Date()
															)}
															Apply Now
														</Button>

														<div
															style={{ marginLeft: "5%" }}
															className="heart-button"
														>
															<Heart
																inactiveColor="#888888"
																activeColor="#888888"
																variant="secondary"
																isActive={saved[posting.id]}
																onClick={() =>
																	saved[posting.id]
																		? handleUnsave(posting.id)
																		: handleSave(posting.id)
																}
															>
																{saved[posting.id] ? "unsave" : "save"}
															</Heart>
														</div>
													</div>
												</div>
												<h5>{posting.company}</h5>
												<hr />
												<Card.Text>{posting.description}</Card.Text>
												{posting.skills && Array.isArray(posting.skills) && (
													<div
														className="skill-card"
														style={{ flexDirection: "row" }}
													>
														{posting.skills.map((skill) => (
															<span key={skill} className="skills-btn-seeker">
																{skill}
															</span>
														))}
													</div>
												)}
												<hr />
												<Card.Text>
													Apply Before:{" "}
													<b>
														{new Date(posting.deadline).toLocaleDateString(
															"en-US",
															{
																weekday: "long",
																year: "numeric",
																month: "long",
																day: "numeric",
															}
														)}
													</b>
												</Card.Text>

												{(posting.cover_letter_required ||
													posting.resume_required ||
													posting.advertise) && <hr />}
												{/* RESUME AND COVER LETTER REQUIRED */}
												{posting.cover_letter_required && (
													<div>
														<b>Cover Letter Required</b>
														<br />
													</div>
												)}
												{posting.resume_required && (
													<div>
														<b>Resume Required</b>
														<br />
													</div>
												)}
												{/* IF THE POSTING IS ADVERTISED */}
												{posting.advertise && (
													<div>
														<b>Currently being Advertised</b>
														<br />
													</div>
												)}
											</div>
										</Card.Body>
									</Card>
								</Col>
							))}
						</Col>
					</Row>
				</div>
			</Container>
		</>
	);
}

export default JobPageForSeekers;
