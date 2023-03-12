import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext.js";
import {collection, getDocs, where, query} from "firebase/firestore";
import {db, auth} from "../../firebase";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import node from ".././../images/node_gray.png";
import group from ".././../images/group_color.png";
import event from ".././../images/event.png";
import grouplogo from ".././../images/group.png";

import "../../styles/network.css";
import "../../styles/JobPostings.css";

function GroupNetwork() {
  
  //Redirect to the Create Group page
  const handleClick = () => {
    window.location.href = '/CreateGroup';
  };

  //Returning Card of group

  const [myGroupCards, setMyGroupCards] = useState([]);
  const [otherGroupCards, setOtherGroupCards] = useState([]);
  
  //We then populate the arrays with the relevant group data
  useEffect(() => {
    const fetchData = async () => {

      //Data about groups is retrieved
      const groupsRef = collection(db, "groups");
      const queryDocs = await getDocs(groupsRef);
      const allGroups = queryDocs.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      
      //Return the groups in which the current user belongs to
      const myGroups = allGroups.filter(group => group.memberUIDs.includes(auth.currentUser.uid));

      //Return the groups in which the users don't belong to
      const otherGroups = allGroups.filter(group => !group.memberUIDs.includes(auth.currentUser.uid));
      
      setMyGroupCards(myGroups);
      setOtherGroupCards(otherGroups);
    };
  
    fetchData();
  }, []);


  //Send Request Button Behavior
  const [buttonTexts, setButtonTexts] = useState(
    myGroupCards.map(() => "Send Join Request")
  );

  
  const handleRequest = (index) => {
    setButtonTexts((prevButtonTexts) => {

      //Update Text on Button
      const newButtonTexts = [...prevButtonTexts];
      newButtonTexts[index] = "Request Sent!";

      //Could probably add another effect here

      return newButtonTexts;
    });
  };


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
                <h5 className="requests">Groups</h5>
                <Button className="create_Group_Button" onClick={handleClick}>Create New Group</Button>
              </div>
            </Card>
            <Card>
              <h5>My Groups</h5>
              <Row className="mt-3">

              {/* Here, we post the Cards of the groups that the current user belongs in*/}

                {myGroupCards.map((groupInfos) => (
                    <div className="post-content" key={groupInfos.id}> 
                      <Card className="card">
                        <Row>
                          <Col md={1}>
                            <img src={grouplogo} alt="template_group_pic" className="group_pic_center" />
                          </Col>
                          <Col md={9}>
                            <h5> {groupInfos.group_name}</h5>
                            <h5> {groupInfos.memberUIDs.length} members</h5>
                        <hr></hr>
                        <h5> {groupInfos.description}</h5>
                        <h5> {groupInfos.industry}</h5>
                        <h5> {groupInfos.location}</h5>
                          </Col>
                          <Col className="center-col" md={2}>
                            <Button className="create_Group_Button" >View Group</Button>
                          </Col>
                        </Row>
                      </Card>
                    </div>
                    ))}

              </Row>
            </Card>
            <Card>
              <h5>Groups You May Like</h5>
              <Row className="mt-3">

              {/* Here, we post the Cards of the groups that the current user doesn't belongs in*/}  

              {otherGroupCards.map((groupInfos, index) => (
                <div className="post-content" key={groupInfos.id}> 
                  <Card className="card">
                    <Row>
                      <Col md={1}>
                      <img src={grouplogo} alt="template_group_pic" className="group_pic_center" />
                      </Col>
                      <Col md={9}>
                        <h5> {groupInfos.group_name}</h5>
                        <h5> {groupInfos.memberUIDs.length} members</h5>
                        <hr />
                        <h5> {groupInfos.description}</h5>
                        <h5> {groupInfos.industry}</h5>
                        <h5> {groupInfos.location}</h5>
                      </Col>
                      <Col className="center-col" md={2}>
                        <Button className="create_Group_Button" onClick={() => handleRequest(index)}>
                        {buttonTexts[index] || "Send Join Request" }
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                </div>
              ))}

              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default GroupNetwork;