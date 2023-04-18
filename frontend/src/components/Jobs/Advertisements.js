import React, { useEffect, useState } from "react";
import { collection, query, where, getDoc, doc, onSnapshot, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Card from "react-bootstrap/Card";
import "../../styles/JobPostings.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';

function Advertisements() {
    // State and constants for handling data
    const [isLoaded, setIsLoaded] = useState(false);
    const [posts, setPosts] = useState([]);

    // Function to redirect to the "JobPostings" page
    const handleClickJobPostings = () => {
        window.location.href = '/JobPostings';
    };

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const email = user.email;
            const q = query(
                collection(db, "posting"),
                where("created_by", "==", email),
                where("advertise", "==", true),
            );

            // Listen for real-time updates
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const postsData = [];
                snapshot.forEach((doc) => {
                    postsData.push({ ...doc.data(), id: doc.id });
                });
                setPosts(postsData);
                setIsLoaded(true);
            });
            return () => unsubscribe();
        }
    }, []); // pass an empty dependency array to only run once

    return (
    <Container className="container d-flex justify-content-center mx-auto">
        <h1></h1>
        <Row className="gap-6 d-flex justify-content-center" style={{minWidth: "80%"}}>
        <Col xs={12} sm={8}  lg={4} style={{minWidth: "30%"}}>
            <Card className="jobs-menu">
            <h2> Jobs </h2>
            <hr></hr>
            <h4 style={{ color: '#888888' }} onClick={handleClickJobPostings}> Job Postings </h4>
            <h4 style={{ color: '#27746a' }}>Advertisements</h4>
            <br></br>
            </Card>
        </Col>
        <Col xs={12} sm={12}  lg={8} >
            <h2 style={{ color: '#555555', marginTop: '32px' }}>Your Advertisements</h2>
            {isLoaded ? (
            posts.map((data) => (
                <div className="post-content" key={data.id}>
                <Card className="card">
                    <div className="row">
                    <div className="col-sm-8">
                        <h4>{data.job_title}</h4>
                    </div>
                    {data.advertise && (
                    <div>
                        <p>Currently being Advertised</p>
                        <Button onClick={() => {
                        const postRef = doc(db, "posting", data.id);
                        updateDoc(postRef, {
                            advertise: false
                        });
                        }}>
                        Stop Advertising
                        </Button>
                    </div>
                    )}
                    </div>
                    <hr/>
                    <h6>{data.company}</h6>
                    <p>{data.description}</p>
                    {data.skills &&
                    Array.isArray(data.skills) &&
                    data.skills.map((skill) => (
                        <div key={skill}>
                        <span className="skills-btn">{skill}</span>
                        </div>
                    ))
                    }
                    <hr/>
                    {data.cover_letter_required && <p>Cover Letter Required</p>}
                    {data.resume_required && <p>Resume Required</p>}
                    {data.advertise && <p>Currently being Advertised</p>}
                </Card>
                </div>
            ))
            ) : (
            <p>Loading job postings...</p>
            )}
        </Col>
        </Row>
    </Container>
    );

    
}
export default Advertisements;