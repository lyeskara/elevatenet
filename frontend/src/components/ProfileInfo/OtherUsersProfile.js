//Import all modules
import { React, useState, useEffect, Fragment } from "react";
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
import person from ".././../images/test.gif";
import { GrMailOption, GrPhone } from "react-icons/gr";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import "../../styles/profile.css";

/**
 * The OtherUsersProfile page displays the other user profiles when searched and clicked on the search bar.
 *
 * @return { Object } The page as a React component with the information of the user selected
 */
function OtherUsersProfile() {
  const [follow, setfollow] = useState(false);
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [userInfo, SetUserInfo] = useState({
    profile_picture: "",
    first_name: "",
    last_name: "",
  });
  const [education, setEducation] = useState([]);
  const [work, setWork] = useState([]);
  const [connect, Setconnect] = useState(false);
  const [numConnections, setNumConnections] = useState(0);
  const storage = getStorage();
  const currId = auth.currentUser.uid;
  const followedId = id;
  const connection_requestsReference = collection(db, "connection_requests");
  const connectionsRef = collection(db, "connection");
  //fetch the data of the current user
  useEffect(() => {
    getDoc(doc(collection(db, "users_information"), currId)).then(
      (informations) => {
        const { profilePicUrl, firstName, lastName } = informations.data();
        const obj = {
          profile_picture: profilePicUrl,
          first_name: firstName,
          last_name: lastName,
        };
        SetUserInfo(obj);
      }
    );
  }, []);
  //function that handles the following feature, checks if the user is following each other, if not, the connection is added to the database
  const handlefollow = async () => {
    const authdoc = doc(connection_requestsReference, currId);
    const array = [];
    getDocs(connection_requestsReference)
      .then((word) => {
        word.docs.forEach((doc) => {
          array.push(doc.id);
        });
        const condition = array.includes(authdoc.id); //check if user is foolowing already
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
          //send notification to the other user when an invitation was sent
          getDoc(doc(collection(db, "Notifications"), followedId)).then(
            (followed_doc) => {
              const note = {
                message: `${userInfo.first_name} ${userInfo.last_name} has sent a connection request!`,
                profilePicUrl: userInfo.profile_picture,
              };
              if (
                followed_doc.data() === undefined ||
                followed_doc.data().notifications.length === 0
              ) {
                setDoc(doc(collection(db, "Notifications"), followedId), {
                  //add notification into database
                  notifications: [note],
                });
              } else {
                const notifications_array = followed_doc.data().notifications;
                let condition = false;
                notifications_array.forEach((notif) => {
                  if (!(notif.message === note.message)) {
                    condition = true;
                  }
                });
                if (condition) {
                  notifications_array.push(note);
                }
                updateDoc(doc(collection(db, "Notifications"), followedId), {
                  notifications: notifications_array,
                });
              }
            }
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setfollow(true);
  };

  /**
   *
   * this function handles the unfollow feature, updates the database of the unfollow connection
   * @return { Object } The page as a React component with the information of the job posts saved by the current user.
   */
  const handleunfollow = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to unfollow this user?"
    );
    if (confirmed) {
      getDoc(doc(connection_requestsReference, currId))
        .then((word) => {
          if (word.exists) {
            const followedUsers = word.data().requests;
            if (followedUsers.includes(followedId)) {
              const updatedFollowedUsers = followedUsers.filter(
                (userId) => userId !== followedId
              );
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
    }
  };

  /**
   * This function retrieves the data of the other user to be displayed
   *
   * @return { Object } The page as a React component with the information of the job posts saved by the current user.
   */
  const getUserData = async () => {
    try {
      const userDoc = await getDoc(
        doc(collection(db, "users_information"), id)
      );

      if (userDoc.exists) {
        // Set the user state
        setUser({ ...userDoc.data(), id: userDoc.id });
        // Get the education data
        const educationData = userDoc.data().education;
        setEducation(educationData);

        const workData = userDoc.data().workExperience;
        setWork(workData);
      }
      const connections = (
        await getDoc(doc(collection(db, "connection"), id))
      ).data().connections;

      let counter = 0;
      connections.forEach(() => {
        counter++;
      });

      setNumConnections(counter);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, [id]);

  //function to download the resume
  const downloadResume = async () => {
    const storageRef = ref(storage, `resume/${user.id}/resume`);
    try {
      const url = await getDownloadURL(storageRef);
      if (url) {
        window.open(url);
      } else {
        alert("Resume file not found!");
      }
    } catch (error) {
      console.log(error);
      alert("Error downloading resume file!");
    }
  };

  //function to download the cover letter
  const downloadCL = async () => {
    const storageRef = ref(storage, `CL/${user.id}/CL`);
    try {
      const url = await getDownloadURL(storageRef);
      if (url) {
        window.open(url);
      } else {
        alert("Cover letter file not found!");
      }
    } catch (error) {
      console.log(error);
      alert("Cover letter file not found!");
    }
  };

  /**
   * This function fetches the connections that are made to display correctly
   *
   */
  useEffect(() => {
    getDoc(doc(connection_requestsReference, currId)).then((requests_ids) => {
      const request_array = requests_ids.data().requests;
      if (request_array.includes(followedId)) {
        setfollow(true);
      }
    });
    getDoc(doc(connectionsRef, currId)).then((connections_ids) => {
      const connections_array = connections_ids.data().connections;
      if (connections_array.includes(followedId)) {
        Setconnect(true);
      }
    });
  }, [id]);

  /**
   * This function handles the unconnect functionality. An unfollow will update the database.
   *
   */
  function handleUnconnect() {
    const confirmed = window.confirm(
      //confirm the unfollow with alert
      "Are you sure you want to unconnect this user?"
    );
    if (confirmed) {
      getDoc(doc(connectionsRef, currId))
        .then((word) => {
          if (word.exists) {
            const ConnectedUsers = word.data().connections;
            if (ConnectedUsers.includes(followedId)) {
              const updatedConnectedUsers = ConnectedUsers.filter(
                (userId) => userId !== followedId
              );
              return updateDoc(doc(connectionsRef, currId), {
                //update the database of the connection change
                ...word.data(),
                connections: updatedConnectedUsers,
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
      Setconnect(false);
    }
  }
  return (
    //{/*CONNECTION BUTTON*/}
    <div className="contain">
      {currId !== id ? (
        connect ? (
          <div style={{ textAlign: "right" }}>
            <Button className="unfollow_button" onClick={handleUnconnect}>
              Unconnect
            </Button>
          </div>
        ) : !follow ? (
          <div style={{ textAlign: "right" }}>
            <Button className="follow_button" onClick={handlefollow}>
              Connect
            </Button>
          </div>
        ) : (
          <div style={{ textAlign: "right" }}>
            <Button className="unfollow_button" onClick={handleunfollow}>
              Pending
            </Button>
          </div>
        )
      ) : null}
      {informations(
        user,
        downloadResume,
        downloadCL,
        work,
        education,
        numConnections
      )}
    </div>
  );
}
/**
 * Function that returns several object
 *
 * @return { user, downloadResume, downloadCL, work, education, numConnections }
 */
function informations(
  user,
  downloadResume,
  downloadCL,
  work,
  education,
  numConnections
) {
  return (
    <div className="contain">
      <Row className="gap-5">
        <Col className="col1" xs={12} md={{ span: 3, offset: 1 }}>
          <Card className="profilecard">
            <img
              src={user.profilePicUrl || person} 
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

          {/*Display contact info*/}
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
          <Card className="connectioncard">
            <div className="Connections">
              <h5
                style={{
                  color: "#626262",
                }}
              >
                {numConnections} <u>Connections</u>
              </h5>
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
		  {/*Display document*/}
          <Card className="docscard">
            <div className="resume">
              <h5
                style={{
                  color: "#626262",
                }}
              >
                Resume
              </h5>
              <button
                className="btn btn-primary"
                style={{ backgroundColor: "#27746A", borderColor: "#27746A" }}
                onClick={downloadResume}
              >
                Download
              </button>
            </div>
            <hr style={{ marginBottom: "6px" }}></hr>
            <div className="coverletter">
              <h5
                style={{
                  color: "#626262",
                }}
              >
                Cover Letter
              </h5>
              <button
                type="button"
                className="btn btn-primary"
                style={{ backgroundColor: "#27746A", borderColor: "#27746A" }}
                onClick={downloadCL}
              >
                Download
              </button>
            </div>
          </Card>
        </Col>
		{/*display the work experience info */}
        <Col xs={12} md={7}>
          <Card className="card">
            <h5>Work Experience</h5>
            <hr></hr>
            {work &&
              work.map((work, index) => (
                <Fragment key={index}>
                  <div className="profile-desc-row">
                    <img src={person} alt="person"></img>
                    <div>
                      <h3>{work.position}</h3>
                      <p>{work.company}</p>
                      <p>
                        {work.startDate} - {work.endDate}
                      </p>
                    </div>
                  </div>
                  {/* Add a horizontal rule between schools */}
                  {index !== work.length - 1 && <hr />}
                </Fragment>
              ))}
          </Card>

          <Card className="educationcard">
            <h5>Education</h5>
            <hr></hr>
            {education &&
              education.map((school, index) => (
                <Fragment key={index}>
                  <div className="profile-desc-row">
                    <img src={person} alt="person"></img>
                    <div>
                      <h3>{school.name}</h3>
                      <p>
                        {school.startDate} - {school.endDate}
                      </p>
                      <p>{school.major}</p>
                    </div>
                  </div>
                  {/* Add a horizontal rule between schools */}
                  {index !== education.length - 1 && <hr />}
                </Fragment>
              ))}
          </Card>

		{/*Display skills info */}
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
              user.courses.map((courses) => <div key={courses}>{courses}</div>)}
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
    </div>
  );
}

export default OtherUsersProfile;
