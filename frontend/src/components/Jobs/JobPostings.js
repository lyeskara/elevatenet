import React, { useEffect, useState } from "react";
import { collection, getDoc, doc, onSnapshot, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase";
import Card from "react-bootstrap/Card";
import "../../styles/JobPostings.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
// import { db } from "./Firebase/config";


function JobPostings() {
	const handleClick = () => {
		window.location.href = '/CreateNewPosting';
	  };
	const handleClickJobPostings = () => {
		window.location.href = '/JobPostings';
	  };
//=================================================================================================================
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const getData = async () =>{
			// await getDoc(
			// 	doc(collection(db, "posting"))
			// )
			// 	.then((doc) => {
			// 		console.log("doc");
			// 		if (doc.exists) {
			// 			console.log(doc.data + " ");
			// 			// setUser({ ...doc.data(), id: doc.id });
			// 		} else {
			// 			console.log("nikmok");
			// 		}
			// 	})
			// 	.catch((error) => {
			// 		console.log(error);
			// 	});
			//==================================================================
			const postingData = await getDocs(collection(db, "posting"));
			setPosts(postingData.docs.map((doc) => ({ ...doc.data(), id: doc.id})));
			console.log(postingData);
		};
		getData();

	}, []);	  
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
						{posts.map((data) => (
							<div className="post-content" key={data.id}>
								<p>{data.job_title}</p>
								<p>{data.company}</p>
								<p>{data.description}</p>
								{/* <p>{data.deadline}</p> */}
							</div>
						))}

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