// Importing necessary modules
import React, { useEffect, useState, useRef } from "react";
import { collection, query, where, getDoc, doc, onSnapshot, getDocs, deleteDoc, updateDoc, setDoc } from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import Card from "react-bootstrap/Card";
import "../../styles/JobPostings.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import { useNavigate, useParams } from "react-router-dom";
import { applyActionCode } from "firebase/auth";
import {
    ref,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";
import { v4 } from "uuid";

function ApplyNow() {

    //hooks 
    const [user, Setuser] = useState(null);
    const [Recruiter_id, Setid] = useState(null)
    const ResumefileInputRef = useRef();
    const CoverfileInputRef = useRef();
    const [Resume, SetResume] = useState(null)
    const [ResUrl, SetResUrl] = useState(null)
    const [cover, Setcover] = useState(null);
    const [coverUrl, SetcoverUrl] = useState(null);
    const [redirection, setRedirection] = useState(false)
    const navigate = useNavigate()
    //db references
    const usersRef = collection(db, "users_information")
    const RecruitersRef = collection(db, "recruiters_informations")
    const applicationsRef = collection(db, "job_applications")
    const postingsRef = collection(db, 'posting')
    const auth_id = auth.currentUser.uid
    const job_id = useParams();

    useEffect(() => {
        const ResumeRef = ref(storage, `ApplicationsResumes/${v4() + { Resume }}`);
        uploadBytes(ResumeRef, Resume).then((word) => {
            getDownloadURL(word.ref).then((url) => {
                SetResUrl(url)
            })
        }).catch((error) => {
            console.log(error)
        })
    }, [Resume]);
    useEffect(() => {
        const coverRef = ref(storage, `ApplicationsCovers/${v4() + { cover }}`);
        uploadBytes(coverRef, cover).then((word) => {
            getDownloadURL(word.ref).then((url) => {
                SetcoverUrl(url)
            })
        }).catch((error) => {
            console.log(error)
        })
    }, [cover]);

    useEffect(() => {
        getDoc(doc(postingsRef, job_id.id)).then((job) => {
            const email = job.data().created_by;
            console.log(email)
            const snap = query(RecruitersRef, where("email", "==", email))
            getDocs(snap).then(users => {
                users.docs.forEach((user) => {
                    Setid(user.id)
                })
            })
        })
    }, []);

    // user object
    let applicant = {
        email: '',
        languages: '',
        workExperience: '',
        bio: '',
        id: '',
        lastName: '',
        firstName: '',
        education: '',
        contact: '',
        skills: '',
        city: ''
    }

    useEffect(() => {
        getDoc((doc(usersRef, auth_id))).then((user_data) => {
            const data = user_data.data();
            Setuser(data);
        }).catch((error) => {
            console.log(error)
        })
    }, [])
    // Copy values from fetchedObject to applicant
    applicant = { ...applicant, ...user };


    const handleButtonClick = () => {
        ResumefileInputRef.current.click();
    };
    const coverhandleButtonClick = () => {
        CoverfileInputRef.current.click();
    };
    const application = {
        firstName: applicant.firstName,
        lastName: applicant.lastName,
        location: applicant.city,
        phone_number: applicant.contact,
        email: applicant.email,
        skills: applicant.skills,
        resume: ResUrl,
        cover: coverUrl,
        applicant_id: auth_id,
        job_offer_id: job_id.id
    }
        
    async function ApplicationSend(event) {
        event.preventDefault();
        const applications = await getDocs(applicationsRef)
        const recruiter_document = await getDoc(doc(applicationsRef, Recruiter_id));
        const array =[]
         applications.forEach((doc)=>{
          array.push(doc.id)
        })
        if (!array.includes(Recruiter_id)) {
            setDoc(doc(applicationsRef, Recruiter_id), { "applications": [application] })
        } else {
            const applications_data = recruiter_document.data().applications
            let condition = false
            for(let i=0;i<applications_data.length;i++){
                if((applications_data[i].applicant_id == application.applicant_id) && (applications_data[i].job_offer_id == application.job_offer_id)){
                     condition = true;
                }
            }
            if(condition){
                console.log("you have already made a job application.")
            }else{
                applications_data.push(application)
                updateDoc(doc(applicationsRef, Recruiter_id), { "applications": applications_data })
            }            
        }
    }
    return (
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
                                    <h5>First name</h5>
                                </label>
                                <input
                                    className="form-control" type="text" placeholder='{user.contact}' aria-label="default input example"
                                    id="firstname"
                                    name="firstname"
                                    value={applicant.firstName}
                                    // onChange={handleInputChange}
                                    style={{ backgroundColor: "#F3F3F3" }}
                                />
                                <label htmlFor="formFile" className="form-label">
                                    <h5>Last name</h5>
                                </label>
                                <input
                                    className="form-control" type="text" placeholder={applicant.contact} aria-label="default input example"
                                    id="lastname"
                                    name="lastname"
                                    value={applicant.lastName}
                                    // onChange={handleInputChange}
                                    style={{ backgroundColor: "#F3F3F3" }}
                                />
                                <label htmlFor="formFile" className="form-label">
                                    <h5>Location</h5>
                                </label>
                                <input
                                    className="form-control" type="text" placeholder='{user.contact}' aria-label="default input example"
                                    id="city"
                                    name="city"
                                    value={applicant.city}
                                    // onChange={handleInputChange}
                                    style={{ backgroundColor: "#F3F3F3" }}
                                />
                                <label htmlFor="formFile" className="form-label">
                                    <h5>Phone Number</h5>
                                </label>
                                <input
                                    className="form-control" type="text" placeholder='{user.contact}' aria-label="default input example"
                                    id="phone_number"
                                    name="phone_number"
                                    value={applicant.contact}
                                    // onChange={handleInputChange}
                                    style={{ backgroundColor: "#F3F3F3" }}
                                />
                                <label htmlFor="formFile" className="form-label">
                                    <h5>email</h5>
                                </label>
                                <input
                                    className="form-control" type="text" placeholder='{user.contact}' aria-label="default input example"
                                    id="email"
                                    name="email"
                                    value={applicant.email}
                                    // onChange={handleInputChange}
                                    style={{ backgroundColor: "#F3F3F3" }}
                                />
                                <label htmlFor="formFile" className="form-label">
                                    <h5>skills</h5>
                                </label>
                                <input
                                    className="form-control" type="text" placeholder='{user.contact}' aria-label="default input example"
                                    id="skills"
                                    name="skills"
                                    value={applicant.skills}
                                    // onChange={handleInputChange}
                                    style={{ backgroundColor: "#F3F3F3" }}
                                />
                            </div>
                            {/* UPLOAD REQUIRED DOCUMENTS */}
                            <div>
                                <Button
                                    variant="outline-secondary"
                                    size="md"
                                    block
                                    className="w-100"
                                    onClick={handleButtonClick}
                                >
                                    Select Resume
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        ref={ResumefileInputRef}
                                        style={{ display: "none" }}
                                        onChange={(e) => {
                                            const selectedResume = e.target.files[0];
                                            SetResume(selectedResume)
                                            console.log("hello")
                                        }}
                                    />
                                </Button>
                            </div>
                            <div>
                                <Button
                                    variant="outline-secondary"
                                    size="md"
                                    block
                                    className="w-100"
                                    onClick={coverhandleButtonClick}
                                >
                                    Select Cover letter
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        ref={CoverfileInputRef}
                                        style={{ display: "none" }}
                                        onChange={(e) => {
                                            const selectedcover = e.target.files[0];
                                            Setcover(selectedcover)
                                            console.log("hello")
                                        }}
                                    />
                                </Button>
                            </div>

                            <Row>
                                <Col className="d-flex justify-content-center">
                                    <>
                                        <Button
                                            variant="outline-secondary"
                                            size="lg"
                                            block
                                            className="w-100"
                                            onClick={() => {
                                                navigate('/JobPageForSeekers')
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                </Col>
                                <Col className="d-flex justify-content-center">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        block className="w-100"
                                        style={{ backgroundColor: '#27746a' }}
                                        onClick={ApplicationSend}
                                    >
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