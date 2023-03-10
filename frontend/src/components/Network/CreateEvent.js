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
import DatePicker from "react-datepicker";
import firebase from "firebase/app";
import "firebase/firestore";
import { collection, setDoc, doc, addDoc } from "firebase/firestore";

function CreateEvent() {
  const [startDate, setStartDate] = useState(new Date());
  
  return (
    <>
      <Container className="container mx-auto w-50">
        <Row className="gap-6">
          <Col>
          <center>  <h5 className=" NetworkTitle mt-5">Create An Event</h5></center>
          
            <Card className="card">
              <div className="containRequest">
                <Link to="/Event">
                  <img src={backward} alt="back" />
                </Link>
              </div>
              {/* INPUT FORM */}
              <Form>
                <hr></hr>

                <div className="form-group mb-3">
                  <label htmlFor="formFile" className="form-label">
                    <h6>Event Title</h6>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Add the title of the event"
                    aria-label="default input example"
                    id="job_title"
                    name="job_title"
                  />
                </div>

                <div className="form-group mb-3 ">
                  <label htmlFor="formFile" className="form-label">
                    <h6>Event Type </h6>
                  </label>
                  <div><input
                    className="input_radio mt-4"
                    type="radio"
                    id="online"
                    name="type"
                    value="online"
                  ></input>
                  <label for="online" className="label_radio">
                    Online
                  </label>
                  <input
                    className="input_radio"
                    type="radio"
                    id="inperson"
                    name="type"
                    value="inperson"
                  ></input>
                  <label for="inperson" className="label_radio">
                    In Person
                  </label></div>
                  
                </div>

                {/* DESCRIPTION */}
                <div className="form-group mb-3">
                  <label htmlFor="formFile" className="form-label">
                    <h6>Description</h6>
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Tell us about the event content"
                    id="description_event"
                    name="description_event"
                  ></textarea>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="formFile" className="form-label">
                    <h6>Start Date</h6>
                  </label>
                  <DatePicker
                    //selected={startDate} onChange={(startDate) => handleDateInputChange(startDate)}
                    id="deadline"
                    name="deadline"
                    //value={postingData.deadline}
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="formFile" className="form-label">
                    <h6>Start Time</h6>
                  </label>
                  <div> <input type="time" id="appt" name="appt"></input></div>
                  
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="formFile" className="form-label">
                    
                  </label>
                  <label for="cars"><h6>Duration</h6></label>
                  <div> <select id="cars" name="cars">
                  <option value="null" selected>Select an option</option>
                    <option value="15 minutes">15 minutes</option>
                    <option value="30 minutes">30 minutes</option>
                    <option value="45 minutes">
                      45 minutes
                    </option>
                    <option value="1 hour">1 hour</option>
                    <option value="1 hour 30 minutes"> 1 hour 30 minutes</option>
                    <option value="2 hours"> 2 hours</option>
                    <option value="3 hours">3 hours</option>
                  </select></div>
                 
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
