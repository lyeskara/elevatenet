import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";


function AdminFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const postsRef = collection(db, "user_posts");
        const snapshot = await getDocs(postsRef);
        const postData = snapshot.docs.map((doc) => {
          const posts = doc.data().posts;
          const postTexts = posts ? posts.map((post) => ({ id: post.id, text: post.post_text })) : [];
          return { id: doc.id, postTexts };
        });
        setPosts(postData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchPosts();
  }, []);

  useEffect(() => {
    async function fetchUserNames() {
      const userIds = new Set();
      posts.forEach((post) => {
        post.postTexts.forEach((text) => {
          userIds.add(text.id);
        });
      });
      const userDocs = await Promise.all(Array.from(userIds).map((id) => getDoc(doc(db, "users", id))));
      const userNames = userDocs.reduce((acc, doc) => {
        if (doc.exists()) {
          acc[doc.id] = doc.data().name;
        }
        return acc;
      }, {});
      setPosts((prevPosts) =>
        prevPosts.map((prevPost) => {
          const updatedPostTexts = prevPost.postTexts.map((text) => ({
            id: text.id,
            text: text.text,
            userName: userNames[text.id],
          }));
          return { ...prevPost, postTexts: updatedPostTexts };
        })
      );
    }

    fetchUserNames();
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
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <Container>
      <Row>
        {posts.map((post) => (
          <Col key={post.id} sm={12} md={6} lg={4} className="mb-4">
            <Card>
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

export default AdminFeed;
