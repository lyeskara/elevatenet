//React Imports
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

//Firebase Imports
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

//Styling Imports
import "../../styles/profile.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

//Feed Import
import Feed from "../UserFeedPage/Feed"

function GroupPage() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);

  /* The information of the selected group is retrieved from the Firestore
   *
   * @param {none}
   * @returns {group is set with the attributes of the group in question}
   */
  useEffect(() => {
    const fetchGroup = async () => {
      const groupRef = doc(db, "groups", id);
      const groupDoc = await getDoc(groupRef);

      if (groupDoc.exists()) {
        setGroup(groupDoc.data());
      } else {
        console.log("No such group exists.");
      }
    };

    fetchGroup();
  }, [id]);

  if (!group) {
    return <div>Loading...</div>;
  }

  //Here we display the information relevant to the group
  return (
    <div className="contain">
      <Row className="gap-5">

        {/* Left Sidebar of the group page, where all group information is found*/}
        <Col className="col1" xs={12} md={{ span: 3, offset: 1 }}>

          <Card className="profilecard">
            <img src={group.group_img_url}/>
            <h1><span style={{ color: "#27746A" }}> {group.group_name} </span></h1>
            <h5>
              {group.memberUIDs.length}{" "}
              {group.memberUIDs.length === 1 ? "member" : "members"}
            </h5>
            <h4>{group.industry}</h4>
            <h5>{group.location}</h5>
            <p>{group.description}</p>
          </Card>

          <Card className="profilecard">
            <h2> Events </h2>
            <hr></hr>
          </Card>

        </Col>

        {/* Main section where the group feed will be mapped*/}
        <Col xs={12} md={7}>

          <Card className="card">
            <Feed/>
          </Card>

          <Card>
            <h2> The user posts will be here.</h2>
          </Card>
        </Col>

      </Row>
    </div>
  );
}

export default GroupPage;
