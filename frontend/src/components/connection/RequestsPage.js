/*This page is used for the connections invitation that were received. A user can view the list of network invitation and decide to ignore or accept the request
 */
import { auth, db } from "../../firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  limitToLast,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import backward from ".././../images/backward.png";
import "../../styles/network.css";
import { Link, useNavigate } from "react-router-dom";
import defaultpic from ".././../images/test.gif";
function RequestsPage() {
  const [Users, SetUsers] = useState([]);
  const [UserData, SetUserData] = useState([]);
  const [requests, Setrequests] = useState([]);
  const currentId = auth.currentUser.uid;
  const dbRef = collection(db, "connection_requests");
  const profileRef = collection(db, "users_information");
  //This fetches the information from the connection database
  useEffect(() => {
    const q = query(dbRef, where("requests", "array-contains", currentId));
    getDocs(q)
      .then((users) => {
        const userArray = [];
        users.docs.forEach((user) => {
          userArray.push(user.id);
        });
        SetUsers(userArray);
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
  }, []);

  //This fetches the information from the user database
  useEffect(() => {
    Users.forEach((user) => {
      getDoc(doc(profileRef, user))
        .then((e) => {
          const { firstName, lastName, profilePicUrl } = e.data();
          const id = e.id;
          if (
            !UserData.find(
              (user) =>
                user.firstName === firstName && user.lastName === lastName
            )
          ) {
            SetUserData((prevData) => [
              ...prevData,
              { id, firstName, lastName, profilePicUrl },
            ]);
          }
        })
        .catch((error) => {
          console.log("this is an error " + error);
        });
    });
  }, [Users]);
  //This function will add the connection to the database whenver a user accepts the connection invitation.
  function handleConnect(userId) {
    const connectionRef = collection(db, "connection");
    const authdoc = doc(connectionRef, currentId);
    const acceptedoc = doc(connectionRef, userId);
    const array = [];
    getDocs(connectionRef).then((docs) => { //push the connections into the array
      docs.docs.forEach((document) => {
        array.push(document.id);
      });
      console.log(array);
      const condition = array.includes(authdoc.id);
      const condition2 = array.includes(userId);
      console.log(condition2);

      if (condition) {
        const getConnection = getDoc(authdoc).then((document) => { //add the connection of users that are not connected
          const connections = document.data().connections;
          if (!connections.includes(userId)) {
            connections.push(userId);
            return updateDoc(doc(connectionRef, currentId), {
              ...document.data(),
              connections: connections,
            });
          }
        });
      } else {
        setDoc(doc(connectionRef, currentId), { connections: [userId] });
      }
      if (condition2) {
        const getConnection = getDoc(acceptedoc).then((document) => {
          const connections = document.data().connections;
          if (!connections.includes(currentId)) {
            connections.push(currentId);
            return updateDoc(doc(connectionRef, userId), {
              ...document.data(),
              connections: connections,
            });
          }
        });
      } else {
        setDoc(doc(connectionRef, userId), { connections: [currentId] });
      }
    });
    getDoc(doc(dbRef, userId)).then((document) => { 
      if (document.exists()) {
        const array = document.data().requests;
        const updatedArray = array.filter((id) => id !== currentId);
        updateDoc(doc(dbRef, userId), {
          ...document.data(),
          requests: updatedArray,
        });
      }
    });
    SetUserData(UserData.filter((element) => element.id !== userId));
  }
  //Function allows the cancellation of an invitation through the button ignore
  function handleCancel(userId) {
    getDoc(doc(dbRef, userId)).then((document) => {
      if (document.exists()) {
        const array = document.data().requests;
        const updatedArray = array.filter((id) => id !== currentId);
        updateDoc(doc(dbRef, userId), {
          ...document.data(),
          requests: updatedArray,
        });
      }
    });
    SetUserData(UserData.filter((element) => element.id !== userId));
  }
  useEffect(() => {
    getDoc(doc(dbRef, currentId)).then((user) => {
      const ReqArray = user.data().requests;
      ReqArray.forEach((id) => {
        getDoc(doc(profileRef, id)).then((other) => {
          const { firstName, lastName, profilePicUrl } = other.data();
          const otherId = other.id;
          const set = new Set();
          set.add({ id, firstName, lastName, profilePicUrl });
          const array = [];
          set.forEach((element) => {
            array.push(element);
          });
          Setrequests(array);
        });
      });
    });
  }, []);

  return (
    <>
      <div className="contain">
        <Row className="gap-5">
          <center>
            <Col xs={11} md={6}>
              <Card className="card">
                <div className="containRequest">
                  <Link to="/connections">
                    <img src={backward} alt="back" />
                  </Link>
                  <h5 className=" NetworkTitle">Manage Invitations </h5>
                </div>
                <br></br>
                <div className="containRequest">
                  <Link to="/requests" className="link_selected">
                    Received
                  </Link>
                  <Link to="/RequestSent">Sent</Link>
                </div>
                <hr></hr>

                {/*This is the displayal of the users onto the page, fetched from the database*/}
                <div>
                  {UserData.map((user) => (
                    <div className="containRequest mb-4" key={user.id}>
                      <img
                        className="connection-pic"
                        src={user.profilePicUrl || defaultpic}
                        alt={user.firstName}
                      />
                      <p className="connection_name">
                        {user.firstName} {user.lastName}
                      </p>
                      <div className="right_button">
                        <div>
                          <Button
                            className="ignore_button"
                            onClick={() => {
                              handleCancel(user.id);
                            }}
                          >
                            Ignore
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Button
                          data-bs-toggle="modal"
                          data-bs-target="#acceptModal"
                          className="connectButton"
                          onClick={() => handleConnect(user.id)}
                        >
                          Accept
                        </Button>

                        {/*-- Modal --*/}
                        <div
                          class="modal fade"
                          id="acceptModal"
                          tabindex="-1"
                          aria-labelledby="acceptModalLabel"
                          aria-hidden="true"
                        >
                          <div class="modal-dialog">
                            <div class="modal-content">
                              <div class="modal-header">
                                <h5 class="modal-title" id="acceptModalLabel">
                                  Connection Added
                                </h5>
                                <button
                                  type="button"
                                  class="btn-close"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                ></button>
                              </div>
                              <div class="modal-body"> You have accepted the invitation. The connection has been added to your network.</div>
                              <div class="modal-footer">
                                <button
                                  type="button"
                                  class="btn btn-secondary"
                                  data-bs-dismiss="modal"
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <hr></hr>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </center>
        </Row>
      </div>
    </>
  );
}

export default RequestsPage;
