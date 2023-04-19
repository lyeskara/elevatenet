import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { Link } from 'react-router-dom';

function AdminFeed() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    async function fetchPosts() {
      try {
        const postsRef = collection(db, "user_posts");
        const snapshot = await getDocs(postsRef);
        const postData = snapshot.docs.map((doc) => {
          const posts = doc.data().posts;
          const postTexts = posts ? posts.map((post) => ({ 
            id: post.id, 
            text: post.post_text,
            created_by: post.created_by
           })) : [];
          return { id: doc.id, postTexts };
        });
        setPosts(postData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchPosts();
  }, []);
  const handleDelete = async (postId, mapId) => {
    try {
      const postRef = doc(db, "user_posts", postId);
      const postSnap = await getDoc(postRef);
      const post = postSnap.data();
      const updatedPosts = post.posts.filter((p) => p.id !== mapId);
      await updateDoc(postRef, { posts: updatedPosts });
      setPosts((prevPosts) =>
        prevPosts.map((prevPost) => {
          if (prevPost.id === postId) {
            const updatedPostTexts = prevPost.postTexts.filter(
              (text) => text.id !== mapId
            );
            return { ...prevPost, postTexts: updatedPostTexts };
          } else {
            return prevPost;
          }
        })
      );
      // Check if posts array is empty and delete document if it is
      if (updatedPosts.length === 0) {
        await deleteDoc(postRef);
        setPosts((prevPosts) => prevPosts.filter((prevPost) => prevPost.id !== postId));
      }
    } catch (error) {
      console.error(error);
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
            <h4
              onClick={goToFeedPosts}
              style={{ color: "#27746a" }}
            >
              {" "}
              Feed Posts{" "}
            </h4>
                      <h4
              onClick={goToUser}
              style={{ color: "#888888" }}
            >
              {" "}
              Users{" "}
            </h4>
            <br></br>
          </Card>
        </Row>
        <Row>
          {posts.map((post) => (
            <Col key={post.id} sm={12} md={6} lg={4} className="mb-4">
              <Card>
                <h5>{post.id}</h5>
                <h6>Created by: {post.postTexts[0]?.created_by ?? 'N/A'}</h6>
                {console.log(post.postTexts[0])}
                <Card.Body>
                  {post.postTexts.map((text) => (
                    <div key={text.id} className="d-flex justify-content-between">
                      <Card.Text>{text.text}</Card.Text>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(post.id, text.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
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
export default AdminFeed;
