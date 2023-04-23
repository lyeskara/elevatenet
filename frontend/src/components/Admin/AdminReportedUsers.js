import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Link } from 'react-router-dom';

function AdminReportedUsers() {
  const [reportedUsers, setReportedUsers] = useState([]);
  
  useEffect(() => {
    async function fetchReportedUsers() {
      try {
        const reportedUsersRef = collection(db, "reported_user");
        const snapshot = await getDocs(reportedUsersRef);
        const reportedUserData = snapshot.docs.map((doc) => {
          const user = doc.data().user;
          const reason = doc.data().reason;
          return { id: doc.id, user, reason };
        });
        setReportedUsers(reportedUserData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchReportedUsers();
  }, []);
  
  const handleDelete = async (reportedUserId) => {
    try {
      const reportedUserRef = doc(db, "reported_user", reportedUserId);
      await deleteDoc(reportedUserRef);
      setReportedUsers((prevReportedUsers) => prevReportedUsers.filter((reportedUser) => reportedUser.id !== reportedUserId));
    } catch (error) {
      console.error(error);
    }
  };
  
  function goToAdmin(){
    window.location.href = "/Admin";
  }
  
  function goToReportedUsers(){
    window.location.href = "/AdminReportedUsers";
  }
  
  function goToFeedPosts(){
    window.location.href = "/AdminFeed";
  }

  function goToUser(){
    window.location.href = "/AdminUsers";
  }
  
  
  // CHECK IF THE USER CONNECTED IS AN ADMIN
  const currentUser = auth.currentUser;
  if (currentUser?.uid === '361FbyTxmmZqCT03kGd25kSyDff1') {
    return (
        <Container>
          <Row>
            {/* This card displays the job menu block with Job Postings and Advertisements */}
            <Card className="jobs-menu">
              <h2> Manage </h2>
              <hr></hr>
              {/* When the user clicks the "Job Postings" text, it calls handleClickJobPostings */}
              <h4 onClick={goToAdmin} style={{ color: "#888888" }}>
                {" "}
                Job Postings{" "}
              </h4>
              {/* Feed Posts */}
              <h4 onClick={goToFeedPosts} style={{ color: "#888888" }}>
                {" "}
                Feed Posts{" "}
              </h4>
              {/* Reported Users */}
              <h4 onClick={goToReportedUsers} style={{ color: "#888888" }}>
                {" "}
                Reported Users{" "}
              </h4>
              <h4 onClick={goToUser} style={{ color: "#888888" }}>
                {" "}
                Users{" "}
              </h4>
              <br></br>
            </Card>
          </Row>
          <Row>
            {reportedUsers.map((reportedUser) => (
              <Col key={reportedUser.id} sm={12} md={6} lg={4} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{reportedUser.user.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{reportedUser.user.email}</Card.Subtitle>
                    <Card.Text>{reportedUser.reason}</Card.Text>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(reportedUser.id)}
                    >
                      Delete
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      );
            }      
     
            
            return (
                <div>
                  <h1>You do not have permission to view this page.</h1>
                  <Link to="/" className="btn btn-primary" style={{ backgroundColor: '#27746A' }}>
                  Go to back to main page
                  </Link>
                </div>
                );
                
              }
              export default AdminReportedUsers;