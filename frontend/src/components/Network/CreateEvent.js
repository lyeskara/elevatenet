//In this CreateEvent class with the CreateEvent() function
//users and enter in the fields event title, event type, description, start date and start time
// and with after doing so and clicking create they can create an event posting

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext.js";
import { auth, db } from "../../firebase.js";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import backward from ".././../images/backward.png";
import "../../styles/network.css";

import firebase from "firebase/app";
import "firebase/firestore";
import { collection, setDoc, doc, addDoc } from "firebase/firestore";

function CreateEvent() {
  const { user } = useUserAuth();
  const navigate = useNavigate();

  //fields of posting
  const [eventData, setEventData] = useState({
    event_title: "",
    event_type: "",
    description: "",
    start_date: "",
    start_time: "",
    duration: "",
  });

  //update with the handleChange() method
  // @param (event)
  //handles changes to the input and updates field
  const handleChange = (event) => {
    setEventData({ ...eventData, [event.target.name]: event.target.value });
  };
  //creates the job posting with handleSubmit() method
  // @param event
  // adds the posting parameters event title, event type, description, start time, and start date to the database
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (user) {
      // setDoc( doc(collection(db,'posting'),auth.currentUser.uid),{
      const docRef = await addDoc(collection(db, "events"), {
        event_title: eventData.event_title,
        event_type: eventData.event_type,
        description: eventData.description,
        start_date: eventData.start_date,
        duration: eventData.duration,
        start_time: eventData.start_time,
      });

      // Clear the form fields
      setEventData({
        event_title: "",
        event_type: "",
        description: "",
        start_date: "",
        duration: "",
        start_time: "",
      });

      navigate("/Event");
    } else {
      console.log("error happened. Try again!");
    }
  };
  console.log(eventData);

  // return of the CreateEvent() function
  // lets users change inputs on the form
  // lets users submit the form
  // return users to Event page with updates from database created with form submission
  return (
    <>
      <Container className="container mx-auto w-60">
        <Row className="gap-6">
          <Col>
            <center>
              {" "}
              <h5 className=" NetworkTitle mt-5">Create An <span className="event_title">Event</span></h5>
            </center>
            <Card className="card">
              <div className="containRequest">
                <Link to="/Event">
                  <img src={backward} alt="back" />
                </Link>
              </div>
              {/* INPUT FORM */}
              <Form onSubmit={handleSubmit}>
                <hr></hr>
                {/* INPUT FORM */}
                <div className="form-group mb-3">
                  <label htmlFor="formFile" className="form-label">
                    {/* Title*/}
                    <h6>Event Title</h6>
                  </label>
                  <input
                    onChange={handleChange}
                    className="form-control"
                    type="text"
                    placeholder="Add the title of the event"
                    aria-label="default input example"
                    id="event_title"
                    name="event_title"
                    value={eventData.event_title}
                    required
                  />
                </div>
                {/*Type */}
                <div className="form-group mb-3 ">
                  <label htmlFor="formFile" className="form-label">
                    <h6>Event Type </h6>
                  </label>
                  <div onChange={handleChange} required>
                    <input
                      className="input_radio mt-4"
                      type="radio"
                      id="online"
                      name="event_type"
                      value="Online"
                    ></input>
                    <label for="online" className="label_radio">
                      Online
                    </label>
                    <input
                      className="input_radio"
                      type="radio"
                      id="inperson"
                      name="event_type"
                      value="In Person"
                    ></input>
                    <label for="inperson" className="label_radio">
                      In Person
                    </label>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="form-group mb-3">
                  <label htmlFor="formFile" className="form-label">
                    <h6>Description</h6>
                  </label>
                  <textarea
                    onChange={handleChange}
                    className="form-control"
                    rows="3"
                    placeholder="Tell us about the event content"
                    id="description"
                    name="description"
                    value={eventData.description}
                    required
                  ></textarea>
                </div>
                {/*Start Date */}
                <div className="form-group mb-3">
                  <label htmlFor="formFile" className="form-label">
                    <h6>Start Date</h6>
                  </label>
                  <div>
                    <input
                      type="date"
                      onChange={handleChange}
                      id="start_date"
                      name="start_date"
                      required
                    ></input>
                  </div>
                </div>
                {/* Start Time */}
                <div className="form-group mb-3">
                  <label htmlFor="formFile" className="form-label">
                    <h6>Start Time</h6>
                  </label>
                  <div>
                    <input
                      type="time"
                      onChange={handleChange}
                      id="start_time"
                      name="start_time"
                      required
                    ></input>
                  </div>
                </div>
                {/* Duration */}
                <div className="form-group mb-3">
                  <label htmlFor="formFile" className="form-label"></label>
                  <label for="cars">
                    <h6>Duration</h6>
                  </label>
                  <div>
                    <select
                      id="duration"
                      name="duration"
                      onChange={handleChange}
                    >
                      <option value="null">Select an option</option>
                      <option value="15 minutes">15 minutes</option>
                      <option value="30 minutes">30 minutes</option>
                      <option value="45 minutes">45 minutes</option>
                      <option value="1 hour">1 hour</option>
                      <option value="1 hour 30 minutes">
                        {" "}
                        1 hour 30 minutes
                      </option>
                      <option value="2 hours"> 2 hours</option>
                      <option value="3 hours">3 hours</option>
                    </select>
                  </div>
                </div>
                <Row>
                  <Col className="d-flex justify-content-center">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      block
                      className="w-100"
                      style={{ backgroundColor: "#27746a" }}
                    >
                      Create Event
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default CreateEvent;
