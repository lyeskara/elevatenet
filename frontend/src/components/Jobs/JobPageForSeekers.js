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
import { useNavigate } from "react-router-dom";
import { Carousel } from 'react-bootstrap';

function JobPageForSeekers() {
    const [postings, setPostings] = useState([]);
    const navigate = useNavigate();

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
    function handleRedirection(id, applyHereLink) {
      if (applyHereLink) {
        window.location.href = applyHereLink; // Redirect to applyHereLink
      } else {
        navigate(`/ApplyToJobs/${id}`); // Redirect to /ApplyToJobs/${id}
      }
    }

    //having the job postings advertised, 5 random advertised job postings are picked to be displayed every load of page
    const [postingsAD, setPostingsAD] = useState([]);
  
    useEffect(() => {
      const postingsCollectionAD = collection(db, "posting");
      const q = query(postingsCollectionAD, where("advertise", "in", [true, "on"]));
  
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
        <Container>

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
                    {/* Render the button with the modified onClick handler */}
                    <Button variant="primary" style={{ backgroundColor: "#27746A" }} onClick={() => handleRedirection(posting.id, posting.apply_here)}>
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
                      <Button variant="primary" style={{ backgroundColor: "#27746A" }} onClick={() => handleRedirection(posting.id, posting.apply_here)}>
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