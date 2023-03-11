import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../styles/nav.css";
import { useUserAuth } from "../context/UserAuthContext";
import { auth } from "../firebase";
import logo from "./../images/logo.JPG";
import home from "./../images/icon_home.png";
import person from "./../images/icon_person.png";
import briefcase from "./../images/icon_briefcase.png";
import connection from "./../images/connection.png";
import bell from "./../images/icon_bell.png";
import ellipses from "./../images/icon_ellipses.png";
import { Navbar, Nav, Container } from "react-bootstrap";

import Search from "./connection/Search";

function NavbarFun() {
	const userr = auth.currentUser;
	const { logOut } = useUserAuth();
	const navigate = useNavigate();
	const handleLogout = async () => {
		try {
			await logOut();
			navigate("/");
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<>
			<Navbar bg="white" expand="lg">
				<Container fluid>
					<Navbar.Brand href="/">
						<img src={logo} alt="ElevateNet" />
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="navbarScroll" />
					<Navbar.Collapse id="navbarScroll">
						<Nav className="ms-auto"></Nav>
						<Nav>
							{userr && (
								<>
									<Nav>
										<Link to="/">
											<img src={home} alt="home" />
										</Link>
										<Link to="/Profile">
											<img src={person} alt="profile" />
										</Link>
										<Link to="/JobPostings">
											<img src={briefcase} alt="briefcase" />
										</Link>
										<Link to="/connections">
											<img src={connection} alt="connection" />
										</Link>
										<Link to="/">
											<img src={bell} alt="bell" />
										</Link>
										<Link to="/">
											<img src={ellipses} alt="ellipses" />
										</Link>
									</Nav>
									<Nav>
										<button>
											<Search />
										</button>
										<button onClick={handleLogout} className="logout_button">
											Sign Out
										</button>
									</Nav>
								</>
							)}
							{!userr && (
								<>
									<Nav>
										<Link to="/SignIn">Sign In</Link>
									</Nav>
									<Nav>
										<Link to="/JoinNow">Sign Up</Link>
									</Nav>
								</>
							)}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>

			<Outlet />
		</>
	);
}

export default NavbarFun;