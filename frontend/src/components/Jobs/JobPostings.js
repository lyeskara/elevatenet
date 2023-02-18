import React, { useEffect, useState } from "react";
import { collection, getDoc, doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Card from "react-bootstrap/Card";
import "../../styles/JobPostings.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';


function JobPostings() {
	
	const [user, setUser] = useState({});
	const handleClick = () => {
		window.location.href = '/CreateNewPosting';
	  };
	const handleClickJobPostings = () => {
		window.location.href = '/JobPostings';
	  };


	

	const Fetchdata = ()=>{
        db.collection("posting").get().then((querySnapshot) => {
            
            // Loop through the data and store
            // it in array to display
            querySnapshot.forEach(element => {
                var data = element.data();
                setInfo(arr => [...arr , data]);
                 
            });
        })
    }

	const [info , setInfo] = useState([]);
	window.addEventListener('load',() => {
		Fetchdata();
	});

	// useEffect(() => {
	// 	db.collection('posting').get().then((querySnapshot) => {
	// 	  const data = querySnapshot.docs.map((doc) => doc.data());
	// 	  setPostings(data);
	// 	});
	//   }, []);
//=================================================================================================================
	return (
		<Container className="container">
			<Row className="gap-6">
				{/* JOB MENU BLOCK ON THE LEFT TO NAVIGATE BETWEEN JOB POSTINGS AND ADVERTS */}
				<Col xs={12} md={3}>
					<Card className="jobs-menu">
						<h2> Jobs </h2>
						<h5 onClick={handleClickJobPostings}> Job Postings </h5>
						<h5> Advertisements </h5>
					</Card>
				</Col>

				<Col xs={12} md={8}>
				{/* button at the top */}
					<div>
						<Button variant="primary" size="lg" block className="w-100" style={{backgroundColor:'#27746a'}} onClick={handleClick} >
							Create a New Job Posting
						</Button>
					</div>
				{/* CARD FOR POSTINGS */}
					<Card className="card">

						{/* <div className="App">
      						{blogs && blogs.map(blog=>{
									return(
										<div className="blog-container">
											<h4>{blog.title}</h4>
											<p>{blog.body}</p>
										</div>
									)
								})
      						}
    					</div> */}
						{/* ================================ */}
						{/* <div>
							{postings.map((posting) => (
								<div key={posting.job_title}>
									<div className="posting">
										<h3>{posting.job_title}</h3>
										<p>Company: {posting.company}</p>
										<p>Deadline: {posting.deadline}</p>
										<p>Description: {posting.description}</p>
									</div>
								</div>
							))}
						</div> */}
						<div>
							<center>
							<h2>Job Posting</h2>
							</center>
						
						{
							info.map((data) => (
							<Frame 
								job_title={data.job_title}
								company={data.company}
								description={data.description}
								deadline={data.deadline}/>
							))
						}
						</div>


					</Card>
				</Col>
			</Row>
		</Container>
	);
}

const Frame = ({job_title , company , description, deadline}) => {
    console.log(job_title + " " + company + " " + description + " " + deadline);
    return (
        <center>
            <div className="div">
				<p>Job Title : {job_title}</p>
				<p>Company : {company}</p>						
				<p>Description : {description}</p>
				<p>Deadline : {deadline}</p>
            </div>
        </center>
    );
}

export default JobPostings;