import React, { useEffect, useState } from "react";
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
import 'firebase/firestore';
import { useUserAuth } from '../../context/UserAuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, setDoc ,doc, addDoc} from 'firebase/firestore';

function CreateAdvertisements() {
    return(
        <h1>Create Advertisements</h1>
    );
}
export default CreateAdvertisements;