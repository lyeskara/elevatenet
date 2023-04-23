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

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, "users_information");
      const usersSnapshot = await getDocs(usersCollection);
      const fetchedUsers = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        email: doc.data().email,
        firstName: doc.data().firstName,
        lastName: doc.data().lastName
      }));
      setUsers(fetchedUsers);
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      const userDocRef = doc(db, "users_information", userId);
      const userSnapshot = await getDoc(userDocRef);
      const deletedUser = {
        id: userSnapshot.id,
        email: userSnapshot.data().email,
        deletedAt: Timestamp.now(),
      };
      await setDoc(
        doc(db, "deleted_users", "deleted_users_doc"),
        deletedUser,
        { merge: true }
      );
      await deleteDoc(userDocRef);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userId)
      );
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  function goToReportedUsers(){
    window.location.href = "/AdminReportedUsers";
  }

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
            {/* Reported Users */}
            <h4 onClick={goToReportedUsers} style={{ color: "#888888" }}>
            {" "}
            Reported Users{" "}
          </h4>
            {/* Feed Posts */}
            <h4
              onClick={goToFeedPosts}
              style={{ color: "#888888" }}
            >
              {" "}
              Feed Posts{" "}
            </h4>
                      <h4
              onClick={goToUser}
              style={{ color: "#27746a" }}
            >
              {" "}
              Users{" "}
            </h4>
            <br></br>
          </Card>
        </Row>
        <Row>
          {users.map((user) => (
            <Col key={user.id} md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{user.email} </Card.Title>
                  <hr></hr>
                  <Card.Text><h5>{user.firstName} {user.lastName}</h5></Card.Text>
                  <Card.Subtitle className="mb-2 text-muted">
                    ID: {user.id}
                  </Card.Subtitle>
                  <Button
                    variant="outline-danger"
                    onClick={() => handleDeleteUser(user.id)}
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

export default AdminUsers;
