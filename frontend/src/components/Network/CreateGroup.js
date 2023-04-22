//React imports
import React, { useState } from "react";
import { useUserAuth } from "../../context/UserAuthContext";
import { useNavigate } from "react-router-dom";

//Firebase imports
import { auth, db } from "../../firebase";
import { collection, updateDoc, doc, addDoc, arrayUnion } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

//FrontEnd imports
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "../../styles/GroupCreation.css";
import "bootstrap/dist/css/bootstrap.min.css";
import grouplogo from ".././../images/group.png";

//Validation import

/* A function that initializes and creates a group instance in the Firestore
 *
 * @param {none}
 * @returns {collection item in database} A new group instance is stored in the Firestore database for further use.
 */

function CreateGroup() {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const storage = getStorage();
  const [imageUrl, setImageUrl] = useState(null);

  //This updates the avatar when a new image is chosen
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  //Here we set the Group Info data fields
  const [groupData, setNewGroupData] = useState({
    group_name: "",
    description: "",
    industry: "",
    location: "",
    memberUIDs: [],
    adminUIDs: [],
    group_img_url: "",
  });

  //Data field change
  const handleInputChange = (event) => {
    setNewGroupData({ ...groupData, [event.target.name]: event.target.value });
  };

  //Submission of data fields when the Submit button is clicked
  const handleContent = async (event) => {
    event.preventDefault();
    if (user) {
      const docRef = await addDoc(collection(db, "groups"), {
        group_name: groupData.group_name,
        description: groupData.description,
        industry: groupData.industry,
        location: groupData.location,
        memberUIDs: arrayUnion(auth.currentUser.uid),
        adminUIDs: arrayUnion(auth.currentUser.uid),
        group_img_url: "",
      });

      //Here we store the image in the Firebase storage, and add the Firebase URL link to the Group Collection's attribute storing the image URL.
      if (imageUrl) {
        let groupImgURL = "";

        fetch(imageUrl)
          .then((response) => response.blob())
          .then((blob) => {
            const storageRef = ref(storage, `grouppics/${docRef.id}/groupPic`);
            return uploadBytes(storageRef, blob);
          })
          .then((uploadTaskSnapshot) => {
            console.log("Image uploaded successfully!");
            return getDownloadURL(uploadTaskSnapshot.ref);
          })
          .then(async (downloadURL) => {
            groupImgURL = downloadURL;
            console.log("Extracted URL", groupImgURL);
            console.log("Download URL", downloadURL);

            //Update the group image attribute
            const docRef1 = doc(db, "groups", docRef.id);
            await updateDoc(docRef1, { group_img_url: groupImgURL });
          });
      }

      //Empty the fields
      setNewGroupData({
        group_name: "",
        description: "",
        industry: "",
        location: "",
        memberUIDs: [],
        adminUIDs: [],
        group_img_url: "",
      });

      //Redirect to GroupNetwork page
      navigate("/GroupNetwork");
    } else {
      console.log("An error has occurred");
    }
  };

  //Handles the cancel, redirects the user to the GroupNetwork page
  // @param ()
  const handleCancel = () => {
    window.location.href = "/GroupNetwork";
  };

  return (
    <Container className="groupContainer container mx-auto ">
      <h2 className="title-spacing">
        Create a <span style={{ color: "#27746a" }}> Group </span>
      </h2>
      <Row className="gap-6">
        <Col>
          <Card className="card">
            <form onSubmit={handleContent}>
              <div className="row1">
                <div className="col-3">
                  <img
                    src={imageUrl ? imageUrl : grouplogo}
                    width="80%"
                    height="80%"
                    className="img-constrained"
                    alt={"Default Group Logo"}
                  ></img>
                  <Form.Control
                    className="form-control form-control-sm"
                    type="file"
                    style={{ fontSize: "10px", width: "80%" }}
                    onChange={handleFileSelect}
                  />
                </div>
                {/* <div className = "side-by-side-div"><ReactImagePickerEditor config = {image_picker_settings}></ReactImagePickerEditor></div> */}
                <div className="col-9" style={{ margin: "9% 0% 2% 0%" }}>
                  <label htmlFor="formFile" className="form-label">
                    <h6>Group Name</h6>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="What should your group be called? (Required)"
                    aria-label="default input example"
                    id="group_name"
                    name="group_name"
                    value={groupData.group_name}
                    onChange={handleInputChange}
                    style={{ backgroundColor: "#F3F3F3" }}
                    required
                    minLength={3}
                  />
                </div>
              </div>
              <div className="form-group mb-3">
                <label htmlFor="formFile" className="form-label">
                  <h6>Description</h6>
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="What is the purpose of your group?"
                  id="description"
                  name="description"
                  value={groupData.description}
                  onChange={handleInputChange}
                  style={{ backgroundColor: "#F3F3F3" }}
                ></textarea>
              </div>
              <Row>
                <div className="col">
                  <label htmlFor="formFile" className="form-label">
                    <h6>Industry</h6>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Select your related sector."
                    aria-label="default input example"
                    id="industry"
                    name="industry"
                    value={groupData.industry}
                    onChange={handleInputChange}
                    style={{ backgroundColor: "#F3F3F3" }}
                  />
                </div>
                <div className="col">
                  <label htmlFor="formFile" className="form-label">
                    <h6>Location</h6>
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Mainly located in..."
                    aria-label="default input example"
                    id="location"
                    name="location"
                    value={groupData.location}
                    onChange={handleInputChange}
                    style={{ backgroundColor: "#F3F3F3" }}
                  />
                </div>
              </Row>
              <Row>
                <Col className="d-flex justify-content-center">
                  <Button
                    variant="outline-secondary"
                    size="lg"
                    block
                    className="w-100"
                    onClick={handleCancel}
                    style={{ margin: "5% 0%" }}
                  >
                    Cancel
                  </Button>
                </Col>
                <Col className="d-flex justify-content-center">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    block
                    className="w-100"
                    style={{ backgroundColor: "#27746a", margin: "5% 0%" }}
                  >
                    Create Group
                  </Button>
                </Col>
              </Row>
            </form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateGroup;
