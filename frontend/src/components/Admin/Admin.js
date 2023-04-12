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

function Admin(){

    return(
        <h1>Admin Page</h1>
    )
}

export default Admin;