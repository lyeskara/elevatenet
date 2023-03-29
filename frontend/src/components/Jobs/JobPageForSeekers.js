// Importing necessary modules
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
import Heart from "react-heart";

function JobPageForSeekers() {
  const [postings, setPostings] = useState([]);
  const [savedPostings, setSavedPostings] = useState([]);

  const connection_requestsReference = collection(db, "savedPostings");
  const { id } = useParams();
  const followedId = id;
  const [follow, setfollow] = useState(false);
  const currId = auth.currentUser.uid;

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
    window.location.href = "/JobPageForSeekers";
  };
  const handleClickSavedJobs = () => {
    window.location.href = "/SavedJobs";
  };

  const handleLike = async (postingId) => {
    

    // Find the posting with the given id and update its isLiked state
    setPostings((prevPostings) =>
      prevPostings.map((posting) =>
        posting.id === postingId
          ? { ...posting, isLiked: !posting.isLiked }
          : posting
      )
    );

    const authdoc = doc(connection_requestsReference, currId);
    const array = [];
    getDocs(connection_requestsReference)
      .then((word) => {
        word.docs.forEach((doc) => {
          console.log(doc.id);
          array.push(doc.id);
        });
        const condition = array.includes(authdoc.id);
        console.log(condition);
        if (!condition) {
          setDoc(doc(connection_requestsReference, currId), {
            saved: [postingId],
          });
        } else {
          getDoc(authdoc).then((document) => {
            const followedUsers = document.data().saved;
            if (!followedUsers.includes(postingId)) {
              followedUsers.push(postingId);
              return updateDoc(doc(connection_requestsReference, currId), {
                ...document.data(),
                saved: followedUsers,
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

    setfollow(true);
  };

  const handleUnsave = async ([postingId]) => {
      // Find the posting with the given id and update its isLiked state
      setPostings((prevPostings) =>
      prevPostings.map((posting) =>
        posting.id === postingId
          ? { ...posting, isLiked: !posting.isLiked }
          : posting
      )
    );

    getDoc(doc(connection_requestsReference, currId))
      .then((word) => {
        if (word.exists) {
          const followedUsers = word.data().saved;
          console.log(followedUsers);
          if (followedUsers.includes(postingId)) {
            const updatedFollowedUsers = followedUsers.filter(
              (userId) => userId  !== postingId
            );
            console.log(updatedFollowedUsers);
            return updateDoc(doc(connection_requestsReference, currId), {
              ...word.data(),
              requests: updatedFollowedUsers,
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setfollow(false);
  };

  return (
    <>
      <h1>Apply to Jobs</h1>
      <Container>
        <Col xs={12} sm={8} lg={4} style={{ minWidth: "30%" }}>
          {/* This card displays the job menu block with Job Postings and Advertisements */}
          <Card className="jobs-menu">
            <h2> Jobs </h2>
            <hr></hr>
            {/* When the user clicks the "Job Postings" text, it calls handleClickJobPostings */}
            <h4 style={{ color: "#27746a" }}> Suggested Jobs </h4>
            {/* Advertisements */}
            <h4 onClick={handleClickSavedJobs} style={{ color: "#888888" }}>
              {" "}
              Saved Jobs{" "}
            </h4>
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
                  <Card.Text>{posting.skills}</Card.Text>
                  <div className="containRequest">
                    <Button
                      variant="primary"
                      style={{ backgroundColor: "#27746A" }}
                    >
                      Apply Now
                    </Button>
                    <div style={{ width: "2rem" }}>
                      <Heart
                        className="heart"
                        isActive={
                          posting.isLiked ||
                          savedPostings.some(
                            (savedPosting) => savedPosting.id === posting.id
                          )
                        }
                        onClick={() => handleLike(posting.id)}
                      />
                    </div>
                  </div>
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
