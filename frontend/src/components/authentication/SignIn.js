import React, { useState } from "react";
import { useUserAuth } from "../../context/UserAuthContext.js";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import { GoogleAuthProvider } from "firebase/auth";
import { signInWithGoogle } from "../../firebase.js";

const SignIn = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { Login } = useUserAuth();
	const navigate = useNavigate();
	const provider = new GoogleAuthProvider();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await Login(email, password);
			navigate("/Profile");
			console.log(Login(email, password));
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<>
			<Container fluid>
				<div>
					<p className="text-center slogan pt-4 pb-3">
						Bring your career to new heights
					</p>
				</div>

				<div className="text-center containerForm">
					<Form onSubmit={handleSubmit}>
						<Form.Text className="sign center">Sign In</Form.Text>
						{/* <div>
							<input
								className="input_radio mt-4"
								type="radio"
								id="recruiter"
								name="age"
								value="recruiter"
							></input>
							<label for="recruiter" className="label_radio">
								I'm a Recruiter
							</label>
							<input
								className="input_radio"
								type="radio"
								id="seeker"
								name="age"
								value="seeker"
							></input>
							<label for="seeker" className="label_radio">
								I'm a Job Seeker
							</label>
						</div> */}
						<Button className="google_button sign_button mb-3 mt-4">
							Continue with Google
						</Button>
						<p className="line">
							<span className="span_line">OR</span>
						</p>
						<center>
							<Form.Group className="mb-3 mt-4" controlId="formBasicEmail">
								<Form.Control
									className="input_box"
									type="email"
									placeholder="Enter email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</Form.Group>

							<Form.Group className="mb-3" controlId="formBasicPassword">
								<Form.Control
									className="input_box"
									type="password"
									placeholder="Password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
								<Form.Text className="text-muted">
									<a href="/" className="password">
										Forgot Password?
									</a>
								</Form.Text>
							</Form.Group>
						</center>
						<Button className="sign_button mb-3 mt-3" type="submit">
							Sign In
						</Button>
						<br></br>
						<Form.Text className="text-muted">
							New to ElevateNet?{" "}
							<a href="/JoinNow" className="join">
								Create an account
							</a>
						</Form.Text>
					</Form>
				</div>
			</Container>
		</>
	);
};

export default SignIn;
