//React Imports
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

//Firebase Imports
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";

//Styling Imports
import "../../styles/profile.css";
import "../../styles/network.css";
import "../../styles/JobPostings.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

//Feed Import
import Feed from "../UserFeedPage/Feed"

/**
* The GroupPage displays a view of a group. It is used to select the target group, retrieve its information from the Firestore, and display it.
*
* @return { Object } The page as a React component with the information of the group.
*/
function GroupPage() {

  const navigate = useNavigate();
  const { id } = useParams();
  const [group, setGroup] = useState(null);

  // Here we set the group variable with the information matching the group ID.
  useEffect(() => {
    const fetchGroup = async () => {
      const groupRef = doc(db, "groups", id);
      const groupDoc = await getDoc(groupRef);

      // Set the group to the groupDoc.
      if (groupDoc.exists()) {
        setGroup(groupDoc.data());
      } else {
        console.log("No such group exists.");
      }
    };

    fetchGroup();
  }, [id]);

  // Returns the loading div.
  if (!group) {
    return <div>Loading...</div>;
  }

  //This removes the user from the memberUIDs array of the group, essentially leaving the group.
  const leaveGroup = async () => {
    const groupRef = doc(db, "groups", id);
    const groupDoc = await getDoc(groupRef);
  
    const updatedGroup = { 
      ...groupDoc.data(),
      memberUIDs: groupDoc.data().memberUIDs.filter(uid => uid !== auth.currentUser.uid)
    };
  
    await updateDoc(groupRef, updatedGroup);

    navigate('/GroupNetwork');
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
            <Button variant="primary" size="lg" block className="w-100" style={{backgroundColor:'#27746a'}} onClick={leaveGroup}>Leave Group</Button>
          </Card>

          <Card className="profilecard">
            <h2> Active Members </h2>
            <hr></hr>
            <h4> WIP </h4>
          </Card>

        </Col>

        {/* Main section where the group feed will be mapped*/}
        <Col style={{margin:'0% -15% 0% -20%'}}>
            <Feed/>
        </Col>

      </Row>
    </div>
  );
}

export default GroupPage;
