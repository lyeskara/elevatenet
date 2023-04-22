//ConnectionPage is the main page of the network set of pages. It shows the connections of the user and allows them to manage their invitations through other pages: RequestsPage and RequestSent
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { Container, Row, Col, Card, Form, Button, Modal } from "react-bootstrap";
import node from ".././../images/clarity_node.png";
import group from ".././../images/group.png";
import event from ".././../images/event.png";
import trash from ".././../images/trash.png";
import arrow from ".././../images/mdi_arrow.png";
import "../../styles/network.css";
import { Link, useNavigate } from "react-router-dom";
import defaultpic from ".././../images/test.gif";

function ConnectionPage() {
  const [connections, Setconnections] = useState([]);
  const [ids, Setids] = useState([]);
  const authUserId = auth.currentUser.uid;
  const colRef = collection(db, "connection");
  const userRef = collection(db, "users_information");
  console.log(connections);

  /** 
   * Accepts a function that contains imperative, possibly effectful code.
   * @param effect — Imperative function that can return a cleanup function
   * @param deps — If present, effect will only activate if the values in the list change.
  */
  useEffect(() => {
    getDoc(doc(colRef, authUserId)).then((connection) => {
      Setids(connection.data().connections);
      console.log(ids);
    });
  }, []);

  /** 
   * Accepts a function that contains imperative, possibly effectful code.
   * @param effect — Imperative function that can return a cleanup function
   * @param deps — If present, effect will only activate if the values in the list change.
  */
  useEffect(() => {
    ids.forEach((id) => {
      getDoc(doc(userRef, id))
        .then((user) => {
          const { firstName, lastName } = user.data();
          const id = user.id;
          if (
            !connections.find(
              (user1) =>
                user1.firstName === firstName && user1.lastName === lastName
            )
          ) {
            Setconnections((prevData) => [
              ...prevData,
              { id, firstName, lastName },
            ]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }, [ids]);
  //This function will display the list of connections that a user have
  /**
   * 
   * @param {handle} userId 
   */
  function handle(userId) {
    getDoc(doc(colRef, userId)).then((user) => {
      if (user.exists()) {
        const userArray = user.data().connections;
        const filteredArray = userArray.filter((id) => id !== authUserId);
        console.log(filteredArray);
        updateDoc(doc(colRef, userId), {
          ...user.data(),
          connections: filteredArray,
        });
      }
    });

    /**
     * getDoc() attempts to provide up-to-date data when possible by waiting for data from the server
     * @param reference — The reference of the document to fetch.
     * @returns A Promise resolved with a DocumentSnapshot containing the current document contents.
     */
    getDoc(doc(colRef, authUserId)).then((user) => {
      if (user.exists()) {
        const userArray = user.data().connections;
        const filteredArray = userArray.filter((id) => id !== userId);
        console.log(filteredArray);
        updateDoc(doc(colRef, authUserId), {
          ...user.data(),
          connections: filteredArray,
        });
      }
    });
    Setconnections(connections.filter((element) => element.id !== userId));
  }


  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");


  //This function will proceeed with the deletion if confirmed, or do nothing + close the modal.
  /**
   * 
   * @param {handleDeleteConfirmation}
   */
  function confirmDeletion() {
    if (userToDelete) {
      handle(userToDelete);
      setUserToDelete(null);
      setShowModal(false);
    }
  }

  //This function will display the confirmation modal for deleting a connection.
  /**
   * 
   * @param {handleDelete} userId
   * We store the target user's ID for further use, if we confirm the deletion.
   */
  function handleDeleteEvent(user) {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setShowModal(true);
    setUserToDelete(user.id);

  }

  return (
    <div className="vh-100">
      <>
        <div className="contain">
          <Row className="gap-5">
            <Col className="col1" xs={12} md={{ span: 3, offset: 1 }}>
              <Card className="networkcard">
                <h5 className="NetworkTitle">My Network</h5>
                <Link to="/connections">
                  <img src={node} alt="node" /> Connections
                </Link>
                <Link to="/GroupNetwork">
                  <img src={group} alt="node" /> Groups
                </Link>
                <Link to="/Event">
                  <img src={event} alt="node" /> Events
                </Link>
              </Card>
            </Col>

            <Col xs={12} md={7}>
              <Card className="card">
                <div className="containRequest">
                  <h5 className="requests">Pending Requests</h5>
                  <div className="arrow">
                    <Link to="/requests">
                      <img src={arrow} alt="node" />
                    </Link>
                  </div>
                </div>
              </Card>
              <Card className="card">
                <div className="containRequest">
                  <h5>My Connections</h5>

                  {/* Show the connections */}
                </div>
                <br></br>
                <hr></hr>
                <Row className="mt-3">
                  {/*This is the displayal of the users onto the page, fetched from the database*/}
                  <div>
                    {connections.map((user) => (
                      <div className="containRequest mb-3" key={user.id}>
                        <img
                          className="connection-pic"
                          src={user.profilePicUrl || defaultpic}
                          alt={user.firstName}
                        />
                        <p className="connection_name">
                          {user.firstName} {user.lastName}
                        </p>
                        <Button
                          className="trash_button"
                          onClick={() => {
                            handleDeleteEvent(user);
                          }}
                        >
                          <img src={trash} alt="node" />
                          Delete Connection
                        </Button>
                        <hr></hr>
                      </div>
                    ))}
                  </div>
                </Row>

                {/*This is the confirmation modal that will appear when a connection deletion is initiated.*/}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Connection Removal</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    You are about to remove your connection with {firstName} {lastName}, are you sure you want to proceed?
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      style={{ borderRadius: "20px" }}
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button style={{ backgroundColor: "#27746a", borderRadius: "20px"}} onClick={confirmDeletion}>
                      Remove Connection
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Card>

              {/*If we add the Suggested Connection Feature */}

              {/*<Card>
                <h5>People you may know</h5>
                <Row className="mt-3">
                  <Col className="connectCard">
                    <center>
                      <h5>First</h5>

                      <Button className="connectButton">Connect</Button>
                    </center>
                  </Col>
                  <Col className="connectCard">
                    {" "}
                    <center>
                      <h5>Second</h5>
                      <Button className="connectButton">Connect</Button>
                    </center>
                  </Col>
                  <Col className="connectCard">
                    {" "}
                    <center>
                      <h5>Third</h5>
                      <Button className="connectButton">Connect</Button>
                    </center>
                  </Col>
                  <Col className="connectCard">
                    {" "}
                    <center>
                      <h5>Fourth</h5>
                      <Button className="connectButton">Connect</Button>
                    </center>
                  </Col>
                </Row>
              </Card>*/}
            </Col>
          </Row>
        </div>
      </>
    </div>
  );
}

export default ConnectionPage;
