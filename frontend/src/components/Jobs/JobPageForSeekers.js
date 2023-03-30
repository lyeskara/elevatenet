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
import { useNavigate } from "react-router-dom";
import { Carousel } from 'react-bootstrap';
import Heart from "react-heart";

/**
 * The JobPageForSeekers page displays the jobs that users may interesting. If they desire, they can click on the apply button to be directed to the application page. They can also save a job post for quick access.
 *
 * @return { Object } The page as a React component with the information of the job posts.
 */
function JobPageForSeekers() {
  const navigate = useNavigate();
  const [postings, setPostings] = useState([]);
 
  const savedCollection = collection(db, "savedPostings");
  const { id } = useParams();
  const postingId = id;
  const [saved, setSaved] = useState({});
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
  
    function handleRedirection(id, applyHereLink) {
      if (applyHereLink) {
        window.location.href = applyHereLink; // Redirect to applyHereLink
      } else {
        navigate(`/ApplyToJobs/${id}`); // Redirect to /ApplyToJobs/${id}
      }
    }


  // Function to redirect to the "JobPostings" page
  const handleClickJobPostings = () => {
    window.location.href = "/JobPageForSeekers";
  };
  const handleClickSavedJobs = () => {
    window.location.href = "/SavedJobs";
  };

  //Function to handle the post being saved to store in savedPostings collection
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
    setSaved((prevSaved) => ({ ...prevSaved, [postingId]: true, savedProperty:true }));
  };

  //Function that will delete the post that was unsaved from the savedPostings collection
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
    setSaved((prevSaved) => ({ ...prevSaved, [postingId]: false, savedProperty:false }));
  };

  function handleRedirection(id) {
    navigate(`/ApplyToJobs/${id}`);
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
        <Col xs={12} sm={8} lg={4} style={{ minWidth: "30%" }}>
          {/* This card displays the job menu block with Job Postings and Advertisements */}
          <Card className="jobs-menu">
            <h2> Jobs </h2>
            <hr></hr>
            {/* When the user clicks the "Suggested jobs" text, it calls handleClickJobPostings */}
            <h4 onClick={handleClickJobPostings} style={{ color: "#27746a" }}>
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
                    <div style={{ width: "2rem" }}>
                    <Heart
                  inactiveColor = "#888888" activeColor = "#888888"
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
