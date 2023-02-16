import React, { useEffect, useState } from "react";
import { collection, getDoc, doc } from "firebase/firestore";
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

function CreateNewPosting() {
    const [startDate, setStartDate] = useState(new Date());
    const handleCancel = () => {
		window.location.href = '/JobPostings';
	  };
	return (
		//Container for new job posting
		<Container className="container mx-auto w-50">
			<Row className="gap-6">
				<Col >
					<Card className="card">

                    {/* INPUT FORM */}
                        <form>
                            <h5 className="text-center">Create a new Job Posting</h5>
                            <hr></hr>
                            {/* LOGO */}
                            <div className="mb-3">
                                <label htmlFor="formFile" className="form-label">
                                    <h6>Logo</h6>
                                </label>
                                <input className="form-control" type="file" id="formFile" />
                            </div>
                            {/* JOB TITLE */}
                            <div className="form-group mb-3">
                                <label htmlFor="formFile" className="form-label">
                                    <h6>Job Tile</h6>
                                </label>
                                <input className="form-control" type="text" placeholder="Add the title you are hiring for" aria-label="default input example" />
                            </div>
                            {/* COMPANY */}
                            <div className="form-group mb-3">
                                <label htmlFor="formFile" className="form-label">
                                    <h6>Company</h6>
                                </label>
                                <input className="form-control" type="text" placeholder="The company the job is for" aria-label="default input example" />
                            </div>
                            {/* DESCRIPTION */}
                            <div className="form-group mb-3">
                                <label htmlFor="formFile" className="form-label">
                                    <h6>Description</h6>
                                </label>
                                <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Tell us about the position and its requirements"></textarea>
                            </div>
                            {/* DATE PICKER FOR DEADLINE */}
                            <div className="form-group mb-3">
                                <label htmlFor="formFile" className="form-label">
                                    <h6>Deadline</h6>
                                </label>
                                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                            </div>  
                            {/* TOGGLE FOR FULL-TIME POSITION OR NOT */}
                            <div className="form-group mb-3">
                                <div className="form-check form-switch">
                                    <label className="form-check-label" htmlFor="toggleSwitch">Full-Time Position</label>
                                    <input className="form-check-input" type="checkbox" id="toggleSwitch" />
                                </div>
                            </div>
                             
                        </form>
                        {/* BUTTONS TO CANCEL OR POST THE POSITION */}
                        <Row>
                            <Col className="d-flex justify-content-center">
                                <Button variant="outline-secondary" size="lg" block className="w-100" onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </Col>
                            <Col className="d-flex justify-content-center">
                                <Button variant="primary" size="lg" block className="w-100" style={{backgroundColor:'#27746a'}}>
                                    Post
                                </Button>
                            </Col>
                        </Row>
                        
					</Card>
				</Col>
			</Row>
		</Container>
	);
}

export default CreateNewPosting;