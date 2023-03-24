//React imports
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

//Firebase imports
import {collection, getDocs, where, query} from "firebase/firestore";
import {db, auth} from "../../firebase";


//Image imports
import node from ".././../images/node_gray.png";
import group from ".././../images/group_color.png";
import event from ".././../images/event.png";
import grouplogo from ".././../images/group.png";

//Styling imports
import "../../styles/network.css";
import "../../styles/JobPostings.css";
import "../../styles/profile.css";




/* Renders the Group Networking page where all existing groups can be seen.
*
* @param {none}
* @returns {page} The existing groups within the database are displayed and interactable.
*/

function GroupNetwork() {
  
  //Redirect to the Create Group page
  const handleClick = () => {
    window.location.href = '/CreateGroup';
  };

  //Returning Card of group
  const [myGroupCards, setMyGroupCards] = useState([]);
  const [otherGroupCards, setOtherGroupCards] = useState([]);
  

/* myGroups and otherGroups arrays are populated with releveant group data found in database.
*  Filtered queries are made and the results are put into their respective arrays.
*
* @param {none}
* @returns {filled arrays} 
*/

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
                          <Col md={1} className="text-center">
                            <img src={groupInfos.group_img_url ? groupInfos.group_img_url : grouplogo} style={{ maxHeight: '150px' }} alt="template_group_pic" className="group_pic_center" />
                          </Col>
                          <Col md={9} >
                            <h3> {groupInfos.group_name}</h3>
                            <h5> {groupInfos.memberUIDs.length} {groupInfos.memberUIDs.length === 1 ? "member" : "members"}</h5>
                        <hr></hr>
                        <p> {groupInfos.description}</p>
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
                      <img src={groupInfos.group_img_url ? groupInfos.group_img_url : grouplogo} style={{ maxHeight: '150px' }} alt="template_group_pic" className="group_pic_center" />
                      </Col>
                      <Col md={9}>
                        <h3> {groupInfos.group_name}</h3>
                        <h5> {groupInfos.memberUIDs.length} {groupInfos.memberUIDs.length === 1 ? "member" : "members"}</h5>
                        <hr />
                        <p> {groupInfos.description}</p>
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