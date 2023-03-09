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
function RequestSent() {
  const [Users, SetUsers] = useState([]);
  const [UserData, SetUserData] = useState([]);
  const [requests, Setrequests] = useState([]);
  const currentId = auth.currentUser.uid;
  const dbRef = collection(db, "connection_requests");
  const profileRef = collection(db, "users_information");
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

  useEffect(() => {
    Users.forEach((user) => {
      getDoc(doc(profileRef, user))
        .then((e) => {
          const { firstName, lastName } = e.data();
          const id = e.id;
          if (
            !UserData.find(
              (user) =>
                user.firstName === firstName && user.lastName === lastName
            )
          ) {
            SetUserData((prevData) => [
              ...prevData,
              { id, firstName, lastName },
            ]);
          }
        })
        .catch((error) => {
          console.log("this is an error " + error);
        });
    });
  }, [Users]);

  function handleConnect(userId) {
    const connectionRef = collection(db, "connection");
    const authdoc = doc(connectionRef, currentId);
    const acceptedoc = doc(connectionRef, userId);
    getDocs(connectionRef).then((docs) => {
      const condition = docs.docs.includes(authdoc);
      const condition2 = docs.docs.includes(userId);
      if (condition) {
        const getConnection = getDoc(authdoc).then((document) => {
          const connections = document.data().connections;
          if (!connections.includes(userId)) {
            connections.push(userId);
            return updateDoc(doc(followRef, currId), {
              ...document.data(),
              connections: connections,
            });
          }
        });
      } else {
        setDoc(doc(connectionRef, currentId), { connections: [userId] });
      }
      if (condition2) {
        const getConnection = getDoc(userId).then((document) => {
          const connections = document.data().connections;
          if (!connections.includes(currentId)) {
            connections.push(currentId);
            return updateDoc(doc(followRef, userId), {
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
          const { firstName, lastName } = other.data();
          const otherId = other.id;
          const set = new Set();
          set.add({ id, firstName, lastName });
          const array = [];
          set.forEach((element) => {
            array.push(element);
          });
          Setrequests(array);
        });
      });
    });
  }, []);

  function handleWithdraw(userId) {
    getDoc(doc(dbRef, currentId)).then((user) => {
      if (user.exists()) {
        const RequestArray = user.data().requests;
        const FilteredArray = RequestArray.filter((id) => id !== userId);
        console.log(FilteredArray);
        updateDoc(doc(dbRef, currentId), {
          ...user.data(),
          requests: FilteredArray,
        });
      }
    });
    Setrequests(requests.filter((element) => element.id !== userId));
  }
  return (
    <>
      <div className="contain">
        <Row className="gap-5">
          <center>
            {" "}
            <Col xs={6} md={6}>
              <Card className="card">
                <div className="containRequest">
                  <Link to="/connections">
                    <img src={backward} alt="back" />
                  </Link>
                  <h5 className=" NetworkTitle">Manage Invitations</h5>
                </div>
                <br></br>
                <div className="containRequest">
                  <Link to="/requests">Received</Link>
                  <Link className="link_selected" to="/RequestSent">
                    Sent
                  </Link>
                </div>
                <hr></hr>
                <div>
                  {requests.map((user) => (
                    <div className="containRequest" key={user.id}>
                      <p className="connection_name">
                        {user.firstName} {user.lastName}
                      </p>
                      <Button
                        className="right_button ignore_button"
                        onClick={() => {
                          handleWithdraw(user.id);
                        }}
                      >
                        Withdraw
                      </Button>
                    </div>
                  ))}
                  <hr></hr>
                </div>
              </Card>
            </Col>
          </center>
        </Row>
      </div>
    </>
  );
}

export default RequestSent;
