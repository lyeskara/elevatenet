import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext.js";
import { auth } from "../../firebase.js";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import node from ".././../images/clarity_node.png";
import group from ".././../images/group.png";
import event from ".././../images/event.png";
import arrow from ".././../images/mdi_arrow.png";
import "../../styles/network.css";

function ConnectionNetwork() {
  

  return (
    <>
      <div className="contain">
        <Row className="gap-5">
          <Col className="col1" xs={12} md={{ span: 3, offset: 1 }}>
            <Card className="networkcard">
              <h5 className="NetworkTitle">My Network</h5>
              <Link to="/ConnectionNetwork">
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
                  <Link to="/PendingRequests">
                    <img src={arrow} alt="node" />
                  </Link>
                </div>
              </div>
            </Card>
            <Card>
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
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ConnectionNetwork;
