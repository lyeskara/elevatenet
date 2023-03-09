import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext.js";
import { auth } from "../../firebase.js";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import backward from ".././../images/backward.png";
import "../../styles/network.css";

function PendingRequests() {
  return (
    <>
      <div className="contain">
        <Row className="gap-5">
          <center>
            {" "}
            <Col xs={6} md={8}>
              <Card className="card">
                <div className="containRequest">
                <Link to="/connections">
                    <img src={backward} alt="back" />
                  </Link>
                  <h5 className=" NetworkTitle">Manage Invitations</h5>
                
                </div>
              </Card>
            </Col>
          </center>
        </Row>
      </div>
    </>
  );
}

export default PendingRequests;
