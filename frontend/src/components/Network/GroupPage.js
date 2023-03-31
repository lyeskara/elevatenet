//React Imports
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

//Firebase Imports
import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  where,
  query,
  collection,
} from "firebase/firestore";
import { db, auth } from "../../firebase";

//Styling Imports
import "../../styles/profile.css";
import "../../styles/network.css";
import "../../styles/JobPostings.css";
import {Row, Col, Card, Button, Modal} from "react-bootstrap";

//Feed Import
import Feed from "../UserFeedPage/Feed";

/**
 * The GroupPage displays a view of a group. It is used to select the target group, retrieve its information from the Firestore, and display it.
 *
 * @return { Object } The page as a React component with the information of the group.
 */
function GroupPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [memberNames, setMemberNames] = useState([]);
  const [showModal, setShowModal] = useState(false);


  // Here we set the group variable with the information matching the group ID.
  useEffect(() => {
    const fetchGroup = async () => {
      const groupRef = doc(db, "groups", id);
      const groupDoc = await getDoc(groupRef);

      // Set the group to the groupDoc.
      if (groupDoc.exists()) {
        setGroup(groupDoc.data());

        // Fetch member names from users_information collection.
        const membersRef = collection(db, "users_information");
        const membersQuery = query(
          membersRef,
          where("id", "in", groupDoc.data().memberUIDs)
        );
        const memberDocs = await getDocs(membersQuery);
        const memberNamesArray = memberDocs.docs.map((doc) => {
          const firstName = doc.data().firstName;
          const lastName = doc.data().lastName;
          const fullName = `${firstName || "Unnamed"} ${lastName || ""}`.trim();
          const profileLink = `/profile/${doc.id}`;
          return { fullName, profileLink };
        });

        setMemberNames(memberNamesArray);
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
      memberUIDs: groupDoc
        .data()
        .memberUIDs.filter((uid) => uid !== auth.currentUser.uid),
    };

    await updateDoc(groupRef, updatedGroup);

    navigate('/GroupNetwork');
  }

  function leaveConfirmation(){
    setShowModal(true);
  };

  //Here we display the information relevant to the group
  return (
    <div className="contain">
      <Row className="gap-5">
        {/* Left Sidebar of the group page, where all group information is found*/}
        <Col className="col1" xs={12} md={{ span: 3, offset: 1 }}>
          <Card className="profilecard">
            <img src={group.group_img_url} />
            <h1>
              <span style={{ color: "#27746A" }}> {group.group_name} </span>
            </h1>
            <h5>
              {group.memberUIDs.length}{" "}
              {group.memberUIDs.length === 1 ? "member" : "members"}
            </h5>
            <h4>
              {group.industry === "" ? "No industry given." : group.industry}
            </h4>
            <h5>
              {group.location === "" ? "No location given." : group.location}
            </h5>
            <p>
              {group.description === ""
                ? "No description given."
                : group.description}
            </p>
            <Button
              variant="primary"
              size="lg"
              block
              className="w-100"
              style={{ backgroundColor: "#27746a" }}
              onClick={leaveConfirmation}
            >
              Leave Group
            </Button>
          </Card>

          {/* Section where all the users who joined the group are displayed.*/}
          <Card
            className="profilecard"
            style={{ minHeight: `${Math.max(memberNames.length * 40, 100)}px` }}
          >
            <h2> Active Members </h2>
            <hr />
            {group.memberUIDs.length > 0 ? (
              <ul className="list-group">
                {memberNames.map(({ fullName, profileLink }, index) => (
                  <li key={index} className="list-group-item">
                    <Link to={profileLink}>{fullName}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No active members</p>
            )}
          </Card>
        </Col>

        {/* Main section where the group feed will be mapped*/}
        <Col style={{ margin: "0% -15% 0% -20%" }}>
          <Feed />
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Leave Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want leave this group?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" style={{ borderRadius: "20px" }} onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: "#27746a", borderRadius: "20px" }}
            onClick={leaveGroup}
          >
            Leave
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default GroupPage;
