import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext.js";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import node from ".././../images/node_gray.png";
import group from ".././../images/group.png";
import event from ".././../images/event_color.png";
import "../../styles/network.css";
import { auth, db } from "../../firebase";
import {
  collection,
  getDoc,
  doc,
  onSnapshot,
  getDocs,
} from "firebase/firestore";


function Event() {
  const [events, setEvents] = useState([]);

  //this use effect() method is used to get the data from the database, native to react
  useEffect(() => {
    const getData = async () => {
      const eventData = await getDocs(collection(db, "events"));
      setEvents(eventData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      console.log(eventData);
    };
    getData();
  }, []);

  return (
    <>
      <div className="contain">
        <Row className="gap-5">
          <Col className="col1" xs={12} md={{ span: 3, offset: 1 }}>
            
            {/* NAVIGATION BAR FOR EVERYTHING NETWORK RELATED */}
						
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
                <h5 className="requests">Events</h5>
                <Link to="/CreateEvent">
                  <Button className="create_Group_Button">
                    Create New Event
                  </Button>
                </Link>
              </div>
            </Card>

           {/* CARD FOR EVENT POSTINGS */}
						{/*this map method returns an array with results and the results from this
						are the data needed that creates a post being event title, event type, start date, start time, duration, and description*/}
            {events.map((data) => (
              <div className="post-content" key={data.id}>
                <Card className="card">
                  <h5 className="time">{data.start_date}, {data.start_time.toString()} <span className="type_event"> {data.event_type}</span></h5>
                  <h5 className="time"></h5>
                  <h3>{data.event_title}</h3>
                  <h6>Duration: {data.duration}</h6>
                  <p>{data.description}</p>
                </Card>
              </div>
            ))}
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Event;
