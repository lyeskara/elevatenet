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
import grouplogo from ".././../images/group.png";
import backward from ".././../images/backward.png";
import shield from ".././../images/shield_icon.png";
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
  const [adminNames, setAdminNames] = useState([]);
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
        const jobSeekerNamesArray = memberDocs.docs.map((doc) => {
          const firstName = doc.data().firstName;
          const lastName = doc.data().lastName;
          const user_id = doc.data().id;
          const profilePic = doc.data().profilePicUrl;
          const fullName = `${firstName || "Unnamed"} ${lastName || ""}`.trim();
          const profileLink = `/profile/${doc.id}`;
          return { fullName, profileLink, id: user_id, profilePic };
        });

        // Fetch member names from recruiters_information collection.
        const recruitersRef = collection(db, "recruiters_informations");
        const recruitersQuery = query(
          recruitersRef,
          where("id", "in", groupDoc.data().memberUIDs)
        );
        const recruiterDocs = await getDocs(recruitersQuery);
        const recruiterNamesArray = recruiterDocs.docs.map((doc) => {
          const firstName = doc.data().firstName;
          const lastName = doc.data().lastName;
          const user_id = doc.data().id;
          const profilePic = doc.data().profilePicUrl;
          const fullName = `${firstName || "Unnamed"} ${lastName || ""}`.trim();
          const profileLink = `/profile/${doc.id}`;
          return { fullName, profileLink, id: user_id, profilePic };
        });

        // Merge both arrays into a single array
        const allMemberNames = [...jobSeekerNamesArray, ...recruiterNamesArray];

        // Split the array into two, one for admins, and another for regular members
        const adminNamesArray = allMemberNames.filter(member => groupDoc.data().adminUIDs.includes(member.id));
        const regularMemberNamesArray = allMemberNames.filter(member => !groupDoc.data().adminUIDs.includes(member.id));


        // Set the array for the both category of users
        setMemberNames(regularMemberNamesArray);
        setAdminNames(adminNamesArray);

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
  // ************* Check if user is in adminUIDs first
  const leaveGroup = async () => {
    const groupRef = doc(db, "groups", id);
    const groupDoc = await getDoc(groupRef);
  
    // Checks whether or not the current user exists in the database as an admin
    const isAdmin = groupDoc.data().adminUIDs.includes(auth.currentUser.uid);

    // The adminUIDs and memberUIDs arrays are simultaneously modified accordingly
    const updatedGroupData = {
      ...groupDoc.data(),
      adminUIDs: isAdmin
        ? groupDoc.data().adminUIDs.filter(uid => uid !== auth.currentUser.uid)
        : groupDoc.data().adminUIDs,
      memberUIDs: groupDoc
        .data()
        .memberUIDs.filter(uid => uid !== auth.currentUser.uid),
    };
  
    // The changes are updated 
    await updateDoc(groupRef, updatedGroupData);
  
    navigate('/GroupNetwork');
  };
  

  //This opens the confirmation modal.
  function leaveConfirmation(){
    setShowModal(true);
  };

  //Here we display the information relevant to the group
  return (
    <div className="contain">
      <Row className="gap-5">
        {/* Left Sidebar of the group page, where all group information is found*/}
        <Col className="col1" xs={12} md={{ span: 3, offset: 1 }}>
          <Link to="/GroupNetwork">
            <img src={backward} alt="back" />
          </Link>
          <Card className="profilecard">
            <img src={group.group_img_url ? group.group_img_url : grouplogo} />
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

          {/* Section where all group admins are displayed.*/}
          <Card
            className="profilecard"
            style={{ minHeight: `${Math.max(adminNames.length * 40, 100)}px` }}
          >
            <h2> Group Admins </h2>
            {group.adminUIDs.length > 0 ? (
              <ul className="list-group">
                {adminNames.map(
                  ({ fullName, profileLink, profilePic }, index) => (
                    <li key={index} className="list-group-item">
                      <Link to={profileLink}>
                        <img
                          src={profilePic ? profilePic : grouplogo}
                          style={{
                            width: "90px",
                            height: "90px",
                            objectFit: "cover",
                            marginRight: "40px",
                            float: "left",
                          }}
                          className="img-fluid my-3"
                          alt="template_group_pic"
                        />
                      </Link>
                      <Link
                        to={profileLink}
                        style={{
                          lineHeight: "2em",
                          display: "flex",
                          alignItems: "center",
                          width: "50%",
                        }}
                      >
                        {fullName}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            ) : (
              <p>No active admins</p>
            )}
          </Card>

          {/* Section where all the regular members who joined the group are displayed.*/}
          <Card
            className="profilecard"
            style={{ minHeight: `${Math.max(memberNames.length * 40, 100)}px` }}
          >
            <h2> Active Members </h2>
            {group.memberUIDs.length > 0 ? (
              <ul className="list-group">
                {memberNames.map(
                  ({ fullName, profileLink, profilePic, id }, index) => (
                    <li key={index} className="list-group-item" style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
                      <Link to={profileLink}>
                        <img
                          src={profilePic ? profilePic : grouplogo}
                          style={{
                            width: "90px",
                            height: "90px",
                            objectFit: "cover",
                            marginRight: "0px",
                            float: "left",
                          }}
                          className="img-fluid my-3"
                          alt="template_group_pic"
                        />
                      </Link>
                      <Link
                        to={profileLink}
                        style={{
                          lineHeight: "1em",
                          display: "flex",
                          alignItems: "center",
                          width: "50%",
                        }}
                      >
                        {fullName}
                      </Link>
                      <div className="dropdown">
                        <button
                          className="btn btn-secondary dropdown-toggle"
                          type="button"
                          id={`dropdown-${id}`}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          style={{ backgroundColor: "#27746a" }}
                        >
                          <img
                            src={shield}
                            alt="shield icon"
                            style={{
                              height: "25px",
                              width: "25px",
                              marginRight: "8px",
                            }}
                          />
                        </button>
                        <ul
                          className="dropdown-menu"
                          aria-labelledby={`dropdown-${id}`}
                        >
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              style={{ backgroundColor: "#F3F3F3" }}
                              onClick={() => handleKickUser(id)}
                            >
                              Kick
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              type="button"
                              style={{ backgroundColor: "#F3F3F3" }}
                              onClick={() => handleBanUser(id)}
                            >
                              Ban
                            </button>
                          </li>
                        </ul>
                      </div>
                    </li>
                  )
                )}
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
          {group.adminUIDs.includes(auth.currentUser.uid) ? (
            <>
              <h4 style={{ color: "#800000" }}>
                You are an admin of this group.
              </h4>
              <p>Are you sure you want to leave?</p>
            </>
          ) : (
            <p>Are you sure you want to leave this group?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            style={{ borderRadius: "20px" }}
            onClick={() => setShowModal(false)}
          >
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
