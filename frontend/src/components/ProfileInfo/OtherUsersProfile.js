import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getDoc,
  query,
  where,
  getDocs,
  setDoc,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import defaultpic from ".././../images/test.gif";
import { GrMailOption, GrPhone } from "react-icons/gr";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

function OtherUsersProfile() {
  const [follow, setfollow] = useState(false);
  const { id } = useParams();
  const [user, setUser] = useState({});
  const currId = auth.currentUser.uid;
  const followedId = id;
  const connection_requestsReference = collection(db, "connection_requests");

  //function that handles the following feature, checks if the user is following each other, if not, the connection is added to the database
  const handlefollow = async () => {
    const authdoc = doc(connection_requestsReference, currId);
    const array = [];
    getDocs(connection_requestsReference)
      .then((word) => {
        word.docs.forEach((doc) => {
          array.push(doc.id);
        });
        const condition = array.includes(authdoc.id);
        if (!condition) {
          setDoc(doc(connection_requestsReference, currId), {
            requests: [followedId],
          });
        } else {
          getDoc(authdoc).then((document) => {
            const followedUsers = document.data().requests;
            if (!followedUsers.includes(followedId)) {
              followedUsers.push(followedId);
              return updateDoc(doc(connection_requestsReference, currId), {
                ...document.data(),
                requests: followedUsers,
              });
            } else {
              console.log("already followed!");
            }
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setfollow(true);
  };
//this function handles the unfollow feature, updates the database of the unfollow connection
  const handleunfollow = async () => {
    getDoc(doc(connection_requestsReference, currId))
      .then((word) => {
        if (word.exists) {
          const followedUsers = word.data().requests;
          console.log(followedUsers);
          if (followedUsers.includes(followedId)) {
            const updatedFollowedUsers = followedUsers.filter(
              (userId) => userId !== followedId
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

  useEffect(() => {
    getDoc(doc(collection(db, "users_information"), id))
      .then((doc) => {
        if (doc.exists) {
          setUser({ ...doc.data(), id: doc.id });
        } else {
          console.log("error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  return (
    <>
      <div className="contain">
        <center>
          {currId !== id ? (
            !follow ? (
              <>
                <Button className="follow_button" onClick={handlefollow}>
                  Connect
                </Button>
                {informations(user)}
              </>
            ) : (
              <>
                <Button className="unfollow_button" onClick={handleunfollow}>
                  Unfollow
                </Button>
                {informations(user)}
              </>
            )
          ) : (
            informations(user)
          )}
        </center>
      </div>
    </>
  );
}

function informations(user) {
  return (
    <>
      <div className="contain">
        <Row className="gap-5">
          <Col className="col1" xs={12} md={{ span: 3, offset: 1 }}>
            <Card className="profilecard">
              <img
                src={user.profilePicUrl || defaultpic}
                id="profilepic"
                alt="Avatar"
                className="avatar"
              ></img>
              <h1>
                {user.firstName}
                <span style={{ color: "#27746A" }}> {user.lastName}</span>
              </h1>
              <p style={{ color: "#A6A6A6" }}> {user.city}</p>
              <p> {user.bio} </p>
              <p> {user.languages} </p>
            </Card>
            <Card className="contactcard">
              <h5>Contact Information</h5>
              <hr></hr>
              <div className="email">
                <GrMailOption />

                <h5
                  style={{
                    color: "#626262",
                  }}
                >
                  {user.email}
                </h5>
              </div>
              <div className="contact">
                <GrPhone />
                <b> {user.contact} </b>
              </div>
            </Card>
            <Card className="awardscard">
              <h5>Awards</h5>
              <hr></hr>
              <div className="Awards">
                <h5
                  style={{
                    color: "black",
                  }}
                >
                  {user.awards &&
                    Array.isArray(user.awards) &&
                    user.awards.map((awards) => (
                      <div key={awards}>{user.awards}</div>
                    ))}
                </h5>
              </div>
            </Card>
          </Col>
          <Col xs={12} md={7}>
            <Card className="card">
              <h5>Work Experience</h5>
              <hr></hr>
              <div className="profile-desc-row">
                <img src={defaultpic}></img>
                <div>
                  <h3>Business Intelligence Analyst</h3>
                  <p>DODO Inc.</p>
                  <p> Feb 2022 - Present</p>
                </div>
              </div>
              <hr></hr>
              <div className="profile-desc-row">
                <img src={defaultpic}></img>
                <div>
                  <h3>Junior Analyst</h3>
                  <p>FOFO Inc.</p>
                  <p> Feb 2021 - Feb 2022</p>
                </div>
              </div>
            </Card>

            <Card className="educationcard">
              <h5>Education</h5>
              <hr></hr>
              <div className="profile-desc-row">
                <img src={defaultpic}></img>
                <div>
                  <h3>{user.education}</h3>
                  <p style={{ color: "#272727" }}>
                    Bachelor's degree, software engineering
                  </p>
                  <p> Aug 2020 - May 2024</p>
                </div>
              </div>
              <hr></hr>
            </Card>

            <Card className="skillscard">
              <h5>Skills</h5>
              <hr></hr>
              {user.skills && Array.isArray(user.skills) && (
                <div style={{ display: "flex", flexDirection: "row" }}>
                  {user.skills.map((skill) => (
                    <span key={skill} className="skills-btn">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </Card>

            <Card className="courses">
              <h5>Courses</h5>
              <hr></hr>
              {user.courses &&
                Array.isArray(user.courses) &&
                user.courses.map((courses) => (
                  <div key={courses}>{courses}</div>
                ))}
            </Card>
            <Card className="projects">
              <h5>Projects</h5>
              <hr></hr>
              {user.courses &&
                Array.isArray(user.projects) &&
                user.projects.map((projects) => (
                  <div key={projects}>{projects}</div>
                ))}
            </Card>
            <Card className="volunteering">
              <h5>Volunteering</h5>
              <hr></hr>
              {user.volunteering &&
                Array.isArray(user.volunteering) &&
                user.volunteering.map((volunteering) => (
                  <div key={volunteering}>{volunteering}</div>
                ))}
            </Card>
          </Col>
        </Row>
        {/**   Can be use a future reference for listing education and work experience
       * <div className="education">
                    <h2>Education</h2>
                    <ul className="off_point">
                      <li>{user.education}</li>
                      <hr></hr>
                    </ul>
                  </div>*/}
      </div>
    </>
  );
}

export default OtherUsersProfile;
