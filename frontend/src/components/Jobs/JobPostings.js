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
	const handleClick = () => {
		window.location.href = '/CreateNewPosting';
	  };
	const handleClickJobPostings = () => {
		window.location.href = '/JobPostings';
	  };
//=================================================================================================================
	const [user, setUser] = useState({});

	useEffect(() => {
		async function getData() {
			await getDoc(
				doc(collection(db, "posting"))
			)
				.then((doc) => {
					console.log("doc");
					if (doc.exists) {
						console.log(doc.data + " ");
						// setUser({ ...doc.data(), id: doc.id });
					} else {
						console.log("nikmok");
					}
				})
				.catch((error) => {
					console.log(error);
				});
		}
		console.log(getData());

		return () => {
			getData();
		};
	}, []);	  
//=================================================================================================================
	// const docRef = doc(db, "posting");
	// //const docSnap = await getDoc(docRef);

	// async function fetchDoc() {
	// 	const docRef = doc(db, "my-collection", "my-doc");
	// 	const docSnap = await getDoc(docRef);
	// 	console.log(docSnap.data());
	//   }
	  
	// //   fetchDoc();

	// if (fetchDoc.exists()) {
	// console.log("Document data:", fetchDoc.data());
	// } else {
	// // doc.data() will be undefined in this case
	// console.log("No such document!");
	// } 
//=================================================================================================================
	// const [books, setBooks] = useState([]);
	// const fetchBooks = async () => {
	// 	const req = await getDoc("posting").get();
	// 	console.log(req)
	// }

	// useEffect(() =>{
	// 	fetchBooks();
	// }, [])
//=================================================================================================================
	// const [info , setInfo] = useState([]);
	// window.addEventListener('load',() => {
	// 	Fetchdata();
	// });

	// const Fetchdata = ()=>{
    //     db.collection("posting").get().then((querySnapshot) => {
            
    //         // Loop through the data and store
    //         // it in array to display
    //         querySnapshot.forEach(element => {
    //             var data = element.data();
    //             setInfo(arr => [...arr , data]);
                 
    //         });
    //     })
    // }
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
							<center>
							<h2>Job Posting</h2>
							</center>
						
						{
							user.map((data) => (
							<Frame 
								job_title={data.job_title}
								company={data.company}
								description={data.description}
								deadline={data.deadline}/>
							))
						}
						</div>
						<p>{user.job_title}</p> */}

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