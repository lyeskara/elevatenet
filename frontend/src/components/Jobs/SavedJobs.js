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

function SavedJobs() {
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

        <Container  className="container d-flex justify-content-center mx-auto">
        <Col xs={12} sm={8}  lg={4} style={{minWidth: "30%"}}>
				{/* This card displays the job menu block with Job Postings and Advertisements */}
				<Card className="jobs-menu">
					<h2> Jobs </h2>
					<hr></hr>
					{/* When the user clicks the "Job Postings" text, it calls handleClickJobPostings */}
					<h4 onClick={handleClickJobPostings}style={{ color: '#888888' }}> Suggested Jobs </h4>
					{/* Advertisements */}
					<h4 onClick={handleClickSavedJobs}  style={{ color: '#27746a' }}> Saved Jobs </h4>
					<br></br>
				</Card>
			</Col>
            <Col xs={12} sm={12}  lg={8} >
				<h2 style={{ color: '#555555', marginTop: '32px' }}>Your Saved Jobs</h2>
				
			</Col>
          <Row>
            
          </Row>
        </Container>
      </>
    );
  }
  
  export default SavedJobs;