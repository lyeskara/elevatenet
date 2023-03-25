// Importing necessary modules
import React, { useEffect, useState, useRef } from "react";
import { collection, query, where, getDoc, doc, onSnapshot, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Card from "react-bootstrap/Card";
import "../../styles/JobPostings.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';



function ApplyNow() {
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
      fileInputRef.current.click();
    };
  
    const handleFileSelected = (event) => {
      const file = event.target.files[0];
      if (file && file.type === 'application/pdf') {
        // do something with the selected file, such as uploading to a server
        console.log('Selected file:', file.name);
      } else {
        console.error('Selected file is not a PDF.');
      }
    };
    return(
        <Container className="container mx-auto w-50">
            <Row className="gap-6">
                <Col >
                    <Card className="card">
                        <form>
                            <h4 className="text-center">Apply Now</h4>
                            <hr></hr>
                            {/* phone number */}
                            <div className="form-group mb-3" >
                                <label htmlFor="formFile" className="form-label">
                                    <h5>Phone Number</h5>
                                </label>
                                <input 
                                className="form-control" type="text" placeholder="Add your phone number" aria-label="default input example"
                                id="phone_number"
                                name="phone_number"
                                // value={postingData.job_title}
                                // onChange={handleInputChange}
                                style={{backgroundColor: "#F3F3F3"}} 
                                />
                            </div> 
                            {/* UPLOAD REQUIRED DOCUMENTS */}
                            <div>
                                <Button variant="outline-secondary"
                                        size="md"
                                        block
                                        className="w-100" onClick={handleButtonClick}>Select PDF Document</Button>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileSelected}
                                />
                            </div>
                            <Row>
                                <Col className="d-flex justify-content-center">
                                <>
                                    <Button
                                        variant="outline-secondary"
                                        size="lg"
                                        block
                                        className="w-100"
                                        // onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                    </>
                                </Col>
                                <Col className="d-flex justify-content-center">
                                    <Button type="submit" variant="primary" size="lg" block className="w-100" style={{backgroundColor:'#27746a'}} >
                                        Apply
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
export default ApplyNow;