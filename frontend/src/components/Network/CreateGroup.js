//React imports
import React, {useState } from "react";
import { useUserAuth } from "../../context/UserAuthContext";
import { useNavigate } from "react-router-dom";
import ReactImagePickerEditor from "react-image-picker-editor";

//Firebase imports
import { auth, db } from "../../firebase";
import { collection, setDoc ,doc, addDoc, arrayUnion} from "firebase/firestore";

//FrontEnd imports
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "../../styles/GroupCreation.css";
import "react-image-picker-editor/dist/index.css"
import "bootstrap/dist/css/bootstrap.min.css";

function CreateGroup(){

    const {user} = useUserAuth();
    const navigate = useNavigate();

    
    //Here we set the Group Info data fields
    const[groupData, setNewGroupData] = useState(
        {
            group_name: '',
            description: '',
            industry: '',
            location: '',
            memberUIDs: [],
            adminUIDs: [],
        }
    );

    //Data field change
    const handleInputChange = (event) => {
        setNewGroupData({...groupData, [event.target.name]: event.target.value})
    };

    //Submission of data fields when the Submit button is clicked
    const handleContent = async (event) =>
    {event.preventDefault();
    if (user) {
        const docRef = await addDoc(collection(db, "groups"),
        {
            group_name: groupData.group_name,
            description: groupData.description,
            industry: groupData.industry,
            location: groupData.location,
            memberUIDs: arrayUnion(auth.currentUser.uid),
            adminUIDs: arrayUnion(auth.currentUser.uid),
        }
        )
        setNewGroupData(
            {
                group_name: '',
                description: '',
                industry: '',
                location: '',
                memberUIDs: [],
                adminUIDs: [],
            }
        );
        //Redirect to GroupNetwork page
        navigate('/GroupNetwork');
    }
    else{
        console.log("An error has occured, please try again!");
    }
    };

    //Extra Settings for Image selector, still WIP
    const image_picker_settings = {
        borderRadius: '1px',
        width: '180px',
        height: '180px',
        objectFit: 'cover',
        compressInitial: null,
        hideDeleteBtn: false,
        hideDownloadBtn: true,
        hideEditBtn: true,
        hideAddBtn: true
      };

return(

    <Container className = "container mx-auto w-50">
        <h2 className="title-spacing">Create a <span style={{color:'#27746a'}}> Group </span></h2>
        <Row className = "gap-6"> 
            <Col>
                <Card className = "card">
                    <form onSubmit = {handleContent}>
                        <div className = "row1">
                            <div className = "side-by-side-div"><ReactImagePickerEditor config = {image_picker_settings}></ReactImagePickerEditor></div>
                            <div className = "side-by-side-div2">
                                <label htmlFor="formFile" className="form-label">
                                    <h6>Group Name</h6>
                                </label>
                                <input 
                                    className="form-control" type="text" placeholder="What should your group be called?" aria-label="default input example"
                                    id="group_name"
                                    name="group_name"
                                    value={groupData.group_name}
                                    onChange={handleInputChange}/>
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="formFile" className="form-label">
                                <h6>Description</h6>
                            </label>
                                <textarea 
                                    className="form-control" rows="3" placeholder="What is the purpose of your group?"
                                    id="description"
                                    name="description"
                                    value={groupData.description}
                                    onChange={handleInputChange}
                                ></textarea>
                        </div>
                        <Row>
                            <div className = "form-group mb-3">
                                <label htmlFor="formFile" className="form-label">
                                    <h6>Industry</h6>
                                </label>
                                <input 
                                    className="form-control" type="text" placeholder="Select your related sector." aria-label="default input example"
                                    id="industry"
                                    name="industry"
                                    value={groupData.industry}
                                    onChange={handleInputChange}/>
                            </div>
                            <div className = "form-group mb-3">
                                <label htmlFor="formFile" className="form-label">
                                    <h6>Location</h6>
                                </label>
                                <input 
                                    className="form-control" type="text" placeholder="Mainly located in..." aria-label="default input example"
                                    id="location"
                                    name="location"
                                    value={groupData.location}
                                    onChange={handleInputChange}/>
                            </div>
                        </Row>
                        <Row>
                            <Col className="d-flex justify-content-center">
                                <Button type="submit" variant="primary" size="lg" block className="w-100" style={{backgroundColor:'#27746a', margin:'5% 25% 5% 25%'}}>
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
