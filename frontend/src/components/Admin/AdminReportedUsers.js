import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  Timestamp,
  getDoc
} from "firebase/firestore";
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
    const fetchReportedUsers = async () => {
      const reportedUsersCollection = collection(db, "reported_user");
      const reportedUsersSnapshot = await getDocs(reportedUsersCollection);
      const fetchedReportedUsers = reportedUsersSnapshot.docs.map((doc) => ({
        id: doc.id,
        email: doc.data().email,
        name: doc.data().name,
        uid: doc.data().uid,
        reason: doc.data().reason
      }));
      setReportedUsers(fetchedReportedUsers);
    };

    fetchReportedUsers();
  }, []);

  const handleDeleteReportedUser = async (reportedUserId) => {
    try {
      const reportedUserDocRef = doc(db, "reported_user", reportedUserId);
      const reportedUserSnapshot = await getDoc(reportedUserDocRef);
      const deletedReportedUser = {
        id: reportedUserSnapshot.id,
        email: reportedUserSnapshot.data().email,
        name: reportedUserSnapshot.data().name,
        uid: reportedUserSnapshot.data().uid,
        reason: reportedUserSnapshot.data().reason,
        deletedAt: Timestamp.now(),
      };
      await setDoc(
        doc(db, "deleted_reported_user", "deleted_reported_user_doc"),
        deletedReportedUser,
        { merge: true }
      );
      await deleteDoc(reportedUserDocRef);
      setReportedUsers((prevReportedUsers) =>
        prevReportedUsers.filter((reportedUser) => reportedUser.id !== reportedUserId)
      );
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  function goToAdmin(){
    window.location.href = "/Admin";
  }
  function goToFeedPosts(){
    window.location.href = "/AdminFeed";
  }
  function goToUser(){
    window.location.href = "/AdminUsers";
  }
  
  //CHECK IF THE USER CONNECTED IS AN ADMIN
const currentUser = auth.currentUser;
if (currentUser?.uid === '361FbyTxmmZqCT03kGd25kSyDff1') {
  return (
    
    <Container>
      {console.log("here")}
      <h1>Admin Users</h1>
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
          <h4 onClick={goToUser} style={{ color: "#888888" }}>
            {" "}
            Users{" "}
          </h4>
          <br></br>
        </Card>
      </Row>
      <Row>
        {reportedUsers.map((reportedUser) => (
          <Col key={reportedUser.id} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{reportedUser.email} </Card.Title>
                <hr></hr>
                <Card.Text><h5>{reportedUser.firstName} {reportedUser.lastName}</h5></Card.Text>
                <Card.Subtitle className="mb-2 text-muted">
                  Reason: {reportedUser.reason}
                </Card.Subtitle>
                <Button
                  variant="outline-danger"
                  onClick={() => handleDeleteReportedUser(reportedUser.id)}
                >
                  Delete Report
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