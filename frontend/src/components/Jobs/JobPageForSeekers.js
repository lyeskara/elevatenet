// Importing necessary modules
import React, { useEffect, useState, useRef } from "react";
import { collection, query, where, getDoc, doc, onSnapshot, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Card from "react-bootstrap/Card";
import "../../styles/JobPostings.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';

function JobPageForSeekers() {
    const [postings, setPostings] = useState([]);
  
    useEffect(() => {
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
  
      return () => {
        unsubscribe();
      };
    }, []);
  // Function to redirect to the "JobPostings" page
	const handleClickJobPostings = () => {
		window.location.href = '/JobPageForSeekers';
	};
	const handleClickSavedJobs = () => {
		window.location.href = '/SavedJobs';
	};
    return (
      <>
        <h1>Apply to Jobs</h1>
        <Container>
        <Col xs={12} sm={8}  lg={4} style={{minWidth: "30%"}}>
				{/* This card displays the job menu block with Job Postings and Advertisements */}
				<Card className="jobs-menu">
					<h2> Jobs </h2>
					<hr></hr>
					{/* When the user clicks the "Job Postings" text, it calls handleClickJobPostings */}
					<h4 style={{ color: '#27746a' }}> Suggested Jobs </h4>
					{/* Advertisements */}
					<h4 onClick={handleClickSavedJobs}  style={{ color: '#888888' }}> Saved Jobs </h4>
					<br></br>
				</Card>
			</Col>
          <Row>
            {postings.map((posting) => (
              <Col md={6} key={posting.id}>
                <Card className="mb-3">
                  <Card.Body>
                    <Card.Title>{posting.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {posting.company}
                    </Card.Subtitle>
                    <Card.Text>{posting.description}</Card.Text>
                    <Card.Text>
                        {posting.skills}
                    </Card.Text>
                    <Button variant="primary" style={{backgroundColor: "#27746A"}}>
                        Apply Now
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </>
    );
  }
  
  export default JobPageForSeekers;