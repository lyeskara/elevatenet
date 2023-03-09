//In this CreateNewPosting class with the CreateNewPosting() function
//users and enter in the fields job title,company, description and deadline
// and with after doing so and clicking post they can create a job posting job

import React, { useEffect, useState } from "react";
// import { collection, getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Card from "react-bootstrap/Card";
import "../../styles/JobPostings.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useUserAuth } from '../../context/UserAuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, setDoc ,doc, addDoc} from 'firebase/firestore';

function CreateNewPosting() {

    const { user } = useUserAuth();
    const navigate =useNavigate();
    const [startDate, setStartDate] = useState(new Date());
    const handleCancel = () => {
		window.location.href = '/JobPostings';
	};
    //fields of posting
    const [postingData, setPostingData] = useState({
        job_title: '',
        company: '',
        description: '',
        apply_here:'',
        deadline: '',
    })

    //update with the handleInputChange() method 
    // @param (event) 
    //handles changes to the input and updates field 
    const handleInputChange = (event) => {
        setPostingData(
            { ...postingData,
              [event.target.name]: event.target.value}  ) 
    };

    //creates the job posting with handleSubmit() method
    // @param event 
    // adds the posting parameters job title, company, description, and deadline to the database
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (user) {
            // setDoc( doc(collection(db,'posting'),auth.currentUser.uid),{
            const docRef = await addDoc(collection(db, "posting"),{
                job_title: postingData.job_title,
                company: postingData.company,
                description: postingData.description,
                apply_here: postingData.description,
                deadline: postingData.deadline,
                created_by: user.email
                // full_time: postingData.full_time,
            })
            // Clear the form fields
            setPostingData({
                job_title: '',
                company: '',
                description: '',
                apply_here: '',
                deadline: '',
                // full_time: false
            });
            navigate('/JobPostings');
          } else {
                console.log("error happened. Try again!");
        }
     };

    //function handleDateInputChange() to handle both functions for date picker field
    // @param {Date} 
    // handles changes to date chosen and updates the field to current choice
    const handleDateInputChange = (date) => {
        setStartDate(date);
        setPostingData((prevState) => ({
           ...prevState,
           deadline: date,
        }));
     }; 
    
     useEffect(() => {
        async function getCurrentUserEmail() {
          if (user) {
            const docRef = doc(db, "users_information", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const email = docSnap.get("email");
              setPostingData((prevState) => ({
                ...prevState,
                created_by: email,
              }));
            }
          }
        }
        getCurrentUserEmail();
      }, [user]);
    // return of the CreateNewPosting() function
    // lets users cancel the form 
    // lets users change inputs on the form
    // lets users submit the form 
    // return users to JobPosting page with updates from database created with form submission
	return (
		//Container for new job posting
		<Container className="container mx-auto w-50">
			<Row className="gap-6">
				<Col >
					<Card className="card">

                    {/* INPUT FORM */}
                        <form onSubmit={handleSubmit}>
                            <h5 className="text-center">Create a new Job Posting</h5>
                            <hr></hr>
                            {/* LOGO */}
                            {/* <div className="mb-3">
                                <label htmlFor="formFile" className="form-label">
                                    <h6>Logo</h6>
                                </label>
                                <input className="form-control" type="file" id="formFile" />
                            </div> */}
                            {/* JOB TITLE */}
                            <div className="form-group mb-3">
                                <label htmlFor="formFile" className="form-label">
                                    <h6>Job Title</h6>
                                </label>
                                <input 
                                className="form-control" type="text" placeholder="Add the title you are hiring for" aria-label="default input example"
                                id="job_title"
                                name="job_title"
                                value={postingData.job_title}
                                onChange={handleInputChange} 
                                />
                            </div>
                            {/* COMPANY */}
                            <div className="form-group mb-3">
                                <label htmlFor="formFile" className="form-label">
                                    <h6>Company</h6>
                                </label>
                                <input 
                                className="form-control" type="text" placeholder="The company the job is for" aria-label="default input example" 
                                id="company"
                                name="company"
                                value={postingData.company}
                                onChange={handleInputChange}
                                />
                            </div>
                            {/* DESCRIPTION */}
                            <div className="form-group mb-3">
                                <label htmlFor="formFile" className="form-label">
                                    <h6>Description</h6>
                                </label>
                                <textarea 
                                className="form-control" rows="3" placeholder="Tell us about the position and its requirements"
                                // id="exampleFormControlTextarea1"
                                id="description"
                                name="description"
                                value={postingData.description}
                                onChange={handleInputChange}
                                ></textarea>
                            </div>
                            {/* APPLY HERE */}
                            <div className="form-group mb-3">
                                <label htmlFor="formFile" className="form-label">
                                    <h6>Apply Here (optional)</h6>
                                </label>
                                <input 
                                className="form-control" rows="3" placeholder="To redirect to a third-party website"
                                // id="exampleFormControlTextarea1"
                                id="apply_here"
                                name="apply_here"
                                value={postingData.apply_here}
                                onChange={handleInputChange}
                                />
                            </div>
                            {/* DATE PICKER FOR DEADLINE */}
                            <div className="form-group mb-3">
                                <label htmlFor="formFile" className="form-label">
                                    <h6>Deadline</h6>
                                </label>
                                <DatePicker 
                                selected={startDate} onChange={(startDate) => handleDateInputChange(startDate)} 
                                id="deadline"
                                name="deadline"
                                value={postingData.deadline}
                                />
                            </div>  
                            {/* TOGGLE FOR FULL-TIME POSITION OR NOT */}
                            {/* <div className="form-group mb-3">
                                <div className="form-check form-switch">
                                    <label className="form-check-label" htmlFor="toggleSwitch">Full-Time Position</label>
                                    <input 
                                    className="form-check-input" type="checkbox" id="toggleSwitch" 
                                    // id="deadline"
                                    name="full_time"
                                    value={postingData.full_time}
                                    onChange={handleInputChange}
                                    />
                                </div>
                            </div> */}

                            {/* BUTTONS TO CANCEL OR POST THE POSITION */}
                            <Row>
                                <Col className="d-flex justify-content-center">
                                    <Button variant="outline-secondary" size="lg" block className="w-100" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                </Col>
                                <Col className="d-flex justify-content-center">
                                    <Button type="submit" variant="primary" size="lg" block className="w-100" style={{backgroundColor:'#27746a'}}>
                                        Post
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

export default CreateNewPosting;