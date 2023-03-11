import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext.js";
import { auth } from "../../firebase.js";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import node from ".././../images/node_gray.png";
import group from ".././../images/group.png";
import event from ".././../images/event_color.png";
import "../../styles/network.css";

function Event() {
  return (
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
                <h5 className="requests">Events</h5>
                <Button className="create_Group_Button">
                  Create New Event
                </Button>
              </div>
            </Card>

            {/* Template for events*/}
            <Card>
              <Row className="mt-3">
                <h5 className="time">Time</h5>
                <h4>Title of Event</h4>
                <p>Event descrition</p>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Event;
