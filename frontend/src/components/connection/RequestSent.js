//RequestSent.js will display the invitation that were sent. The user can see the list of people they sent an invitation to
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
function RequestSent() {
  // Set up state variables
  const [Users, SetUsers] = useState([]);
  const [UserData, SetUserData] = useState([]);
  const [requests, Setrequests] = useState([]);
  // Get current user ID
  const currentId = auth.currentUser.uid;
   // Set up database references
  const dbRef = collection(db, "connection_requests");
  const profileRef = collection(db, "users_information");
  /**
   * @param effect — Imperative function that can return a cleanup function
   * @param deps — If present, effect will only activate if the values in the list change.
   */
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
  /**
   * @param getdocs to get name and id
   * @param setuserdata to set it
   * @param catch to catch errors
   */
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


  useEffect(() => {
    getDoc(doc(dbRef, currentId)).then((user) => {
      const ReqArray = user.data().requests;
      const array = [];
      ReqArray.forEach((id) => {
        getDoc(doc(profileRef, id)).then((other) => {
          const { firstName, lastName, profilePicUrl } = other.data();
          const otherId = other.id;
          const set = new Set();
          set.add({ id, firstName, lastName, profilePicUrl });

          set.forEach((element) => {
            array.push(element);
          });
          Setrequests(array);
        });
      });
    });
  }, []);

  //This function will remove the invitation from the database
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
            <Col xs={10} md={6}>
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
                {/*This is the displayal of the users onto the page, fetched from the database*/}
                <div>
                  {requests.map((user) => (
                    <div className="containRequest  mb-4" key={user.id}>
                      <img
                        className="connection-pic"
                        src={user.profilePicUrl || defaultpic}
                        alt={user.firstName}
                      />
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
