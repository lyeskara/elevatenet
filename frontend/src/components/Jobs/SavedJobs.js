//This page is use to display the jobs that were saved in the JobPageForSeekers.js

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
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import Card from "react-bootstrap/Card";
import "../../styles/JobPostings.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { useNavigate, useParams } from "react-router-dom";

/**
 * The SavedJobs page displays the jobs that were saved in the JobPageForSeekers.js. It is used access the saved jobs more easily.
 *
 * @return { Object } The page as a React component with the information of the job posts saved by the current user.
 */
function SavedJobs() {
  const navigate = useNavigate();
  const [saved, Setsaved] = useState([]);
  const [ids, Setids] = useState([]);
  const [PostData, SetPostData] = useState([]);
  const authUserId = auth.currentUser.uid;
  const saveRef = collection(db, "savedPostings");
  const postRef = collection(db, "posting");

  //captures the id of the job posts that the current user saved
  useEffect(() => {
    getDoc(doc(saveRef, authUserId)).then((connection) => {
      Setids(connection.data().saved);
      console.log(ids);
    });
  }, []);

  //retrieve the data of each post
  useEffect(() => {
    ids.forEach((id) => {
      getDoc(doc(postRef, id))
        .then((post) => {
          const { job_title, company, description, skills } = post.data();
          const id = post.id;
          if (!PostData.find((post1) => post1.id === id)) {
            SetPostData((prevData) => [
              ...prevData,
              { id, job_title, company, description, skills },
            ]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }, [ids]);

  //retrieve the data associated to each saved post of the current user
  useEffect(() => {
    getDoc(doc(saveRef, authUserId)).then((user) => {
      const PostSavedArray = user.data().saved;
      const arrayPost = [];
      PostSavedArray.forEach((id) => {
        getDoc(doc(postRef, id)).then((other) => {
          const { job_title, company, description, skills } = other.data();
          const otherId = other.id;
          const set = new Set();
          set.add({ id, job_title, company, description, skills });

          set.forEach((element) => {
            arrayPost.push(element);
          });
          Setsaved(arrayPost);
        });
      });
    });
  }, []);

  // Function to redirect to the "JobPostings" page
  const handleClickJobPostings = () => {
    window.location.href = "/JobPageForSeekers";
  };
  const handleClickSavedJobs = () => {
    window.location.href = "/SavedJobs";
  };

  function handleRedirection(id, applyHereLink) {
    if (applyHereLink) {
      window.location.href = applyHereLink; // Redirect to applyHereLink
    } else {
      navigate(`/ApplyToJobs/${id}`); // Redirect to /ApplyToJobs/${id}
    }
  }
  function handleRedirection(id) {
    navigate(`/ApplyToJobs/${id}`);
  }
  return (
    <>
      <div style={{ minHeight: "70vh" }}>
        <Container className="container d-flex justify-content-center mx-auto">
          <Row
            className="gap-6 d-flex justify-content-center"
            style={{ minWidth: "80%" }}
          >
            {" "}
            <Col xs={12} sm={8} lg={2} style={{ minWidth: "30%" }}>
              {/* This card displays the job menu block with Job Postings and Advertisements */}
              <Card className="jobs-menu">
                <h2> Jobs </h2>
                <hr></hr>
                {/* When the user clicks the "Suggested jobs" text, it calls handleClickJobPostings */}
                <h4 onClick={handleClickJobPostings} style={{ color: "#888888" }}>
                  {" "}
                  Suggested Jobs{" "}
                </h4>
                {/* Saved posts */}
                <h4 onClick={handleClickSavedJobs} style={{ color: "#27746a" }}>
                  {" "}
                  Saved Jobs{" "}
                </h4>
                <br></br>
              </Card>
            </Col>
            <Col xs={12} sm={12} lg={8}>
              <h2
                style={{ color: "#555555", marginTop: "32px" }}
              >
                Your Saved Jobs
              </h2>
              {saved.map((posting) => (
                <Col md={10} key={posting.id}>
                  <Card className="mb-3 card-save">
                    <Card.Body>
                      <div
                        className="containRequest"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          
                        }}
                      >
                        <Card.Title>{posting.job_title}</Card.Title>
                        <Button
                          variant="primary"
                          style={{ backgroundColor: "#27746A" }}
                          onClick={() =>
                            handleRedirection(posting.id, posting.apply_here)
                          }
                        >
                          Apply Now
                        </Button>
                      </div>

                      <Card.Subtitle className="mb-2 text-muted">
                        {posting.company}
                      </Card.Subtitle>
                      <Card.Text>{posting.description}</Card.Text>
                      <Card.Text>{posting.skills}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default SavedJobs;
