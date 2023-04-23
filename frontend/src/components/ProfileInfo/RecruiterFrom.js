import { useState } from "react";
import { useUserAuth } from "../../context/UserAuthContext";
import { auth, db } from "../../firebase";
import { collection, setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
function RecruiterForm() {
	const { user } = useUserAuth();
	const navigate = useNavigate();
	const [profileData, setProfileData] = useState({
		firstName: "",
		lastName: "",
		city: "",
		company: "",
	});

	function update(e) {
		setProfileData({ ...profileData, [e.target.name]: e.target.value });
	}

	function create_user(e) {
		e.preventDefault();
		if (user) {
			setDoc(
				doc(collection(db, "recruiters_informations"), auth.currentUser.uid),
				{
					email: user.email,
					id: user.uid,
					firstName: profileData.firstName,
					lastName: profileData.lastName,
					company: profileData.company,
					city: profileData.city,
					contact: profileData.contact,
				}
			);
			// Clear the form fields
			setProfileData({
				firstName: "",
				lastName: "",
				city: "",
				company: "",
				contact: "",
			});
			navigate("/RecruiterProfile");
		} else {
			console.log("error happened. Try again!");
		}
	}
	return (
		<>
			<div className="text-center containerForm">
				<Form onSubmit={create_user}>
					<Form.Text className="sign center">About You</Form.Text>

					<center>
						<Form.Group className="mb-3 mt-4" controlId="formFirstName">
							<Form.Control
								className="input_box"
								type="text"
								name="firstName"
								onChange={update}
								value={profileData.firstName}
								placeholder="First Name"
								required
							/>
						</Form.Group>

						<Form.Group className="mb-3" controlId="formLastName">
							<Form.Control
								className="input_box"
								type="text"
								name="lastName"
								onChange={update}
								value={profileData.lastName}
								placeholder="Last Name"
								required
							/>
						</Form.Group>

						<Form.Group className="mb-3" controlId="formCity">
							<Form.Control
								className="input_box"
								type="text"
								name="city"
								onChange={update}
								value={profileData.city}
								placeholder="City"
							/>
						</Form.Group>

						<Form.Group className="mb-3" controlId="formcompany">
							<Form.Control
								as="textarea"
								rows={3}
								className="input_box"
								name="company"
								onChange={update}
								value={profileData.company}
								placeholder="company"
							/>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formcontact">
							<Form.Control
								as="textarea"
								rows={3}
								className="input_box"
								name="contact"
								onChange={update}
								value={profileData.contact}
								placeholder="contact"
							/>
						</Form.Group>
					</center>
					<Button className="sign_button mb-3 mt-3" type="submit">
						Register
					</Button>
					<br></br>
				</Form>
			</div>
		</>
	);
}

export default RecruiterForm;
