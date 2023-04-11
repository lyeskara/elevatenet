// Importing necessary modules
import React, { useEffect, useState } from "react";
import {
	collection,
	query,
	where,
	getDoc,
	doc,
	onSnapshot,
	getDocs,
	deleteDoc,
	updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import Card from "react-bootstrap/Card";
import "../../styles/JobPostings.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

import arrow from ".././../images/mdi_arrow.png";

import { Link, useNavigate } from "react-router-dom";
function Security() {


	// Function to redirect to the "Account Preferences" page
	const handleClickAccount = () => {
		window.location.href = "/GeneralSettings";
	};

	// Function to redirect to the "JobPostings" page
	const handleClickSecurity = () => {
		window.location.href = "/Security";
	};
	const handleClickNotifications = () => {
		window.location.href = "/";
	};

	
	// This component displays a page for job postings
	// and advertisements with a menu block on the left to navigate between them.

	return (
		<Container className="container d-flex justify-content-center mx-auto">
			{/* JOB MENU BLOCK ON THE LEFT TO NAVIGATE BETWEEN JOB POSTINGS AND ADVERTS */}
			<Row
				className="gap-6 d-flex justify-content-center"
				style={{ minWidth: "80%" }}
			>
				<Col xs={12} sm={8} lg={4} style={{ minWidth: "30%" }}>
					{/* This card displays the setting menu */}
					<Card className="jobs-menu">
						<h2> Settings </h2>
						<hr></hr>
						
						<h4 onClick={handleClickAccount} style={{ color: "#888888" }}>
							{" "}
							Account Preferences{" "}
						</h4>
						{/* Security */}
						<h4
							onClick={handleClickSecurity}
							style={{ color: "#27746a" }}
						>
							{" "}
							Security{" "}
						</h4>
                        {/* Notifications */}
						<h4
							onClick={handleClickNotifications}
							style={{ color: "#888888" }}
						>
							{" "}
							Notifications{" "}
						</h4>
					</Card>
				</Col>

				<Col xs={12} sm={12} lg={8}>
                <Card className="card">
              <h2 style={{ color: "#555555" }}>
						Account Access
					</h2>
                    <hr></hr>
                    <div className="containRequest">
                <h5 className="requests">Change Password</h5>
                <div className="arrow">
                  <Link to="/">
                    <img src={arrow} alt="node" />
                  </Link>
                </div>
              </div>
             
            </Card>
           
           
					
					
					
				</Col>
			</Row>

			
		</Container>
	);
}

export default Security;
