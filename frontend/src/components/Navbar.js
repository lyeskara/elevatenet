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
import messaging from "./../images/messaging_icon.png";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useState } from 'react';

import Search from "./connection/Search";

function NavbarFun() {
  const userr = auth.currentUser;
  const { logOut } = useUserAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLinkClick = () => {
    setExpanded(false);
  };
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
      <Navbar bg="white" expand="lg" expanded={expanded}>
        <Container fluid>
          <Navbar.Brand href="/">
            <img src={logo} alt="ElevateNet" />
          </Navbar.Brand>
          {userr && (
            <>
              <Nav>
                <div className="mt-3">
                  <Search />
                </div>
              </Nav>
            </>
          )}
          <Navbar.Toggle aria-controls="navbarScroll" onClick={() => setExpanded(!expanded)}/>
          <Navbar.Collapse id="navbarScroll">
            <Nav className="ms-auto"></Nav>
            <Nav>
              {userr && (
                <>
                  <Nav>
                    <Link to="/Feed" onClick={handleLinkClick}> 
                      <img className="nav-icon" src={home} alt="home" />
                    </Link>
                    <Link to="/Profile" onClick={handleLinkClick}>
                      <img className="nav-icon" src={person} alt="profile" />
                    </Link>
                    <Link to="/Messaging" onClick={handleLinkClick}>
                      <img className="nav-icon" src={messaging} alt="messaging" />
                    </Link>
                    <Link to="/JobPostings" onClick={handleLinkClick}>
                      <img className="nav-icon" src={briefcase} alt="briefcase" />
                    </Link>
                    <Link to="/connections" onClick={handleLinkClick}>
                      <img className="nav-icon" src={connection} alt="connection" />
                    </Link>
                    <Link to="/Notification" onClick={handleLinkClick}>
											<img className="nav-icon" src={bell} alt="bell" />
										</Link>
                    <div class="dropdown" >
                      <button class="dropbtn" onClick={handleLinkClick}>
                        <img className="nav-ellipse" src={ellipses} alt="ellipses" />
                      </button>
                      <div class="dropdown-content">
                        <Link to="/ProfileInfoSettings" onClick={handleLinkClick}>Settings</Link>
                        <a onClick={handleLogout}>Sign Out</a>
                      </div>
                    </div>
                  </Nav>
                </>
              )}

              {!userr && (
                <>
                  <Nav>
                    <Link to="/SignIn" onClick={handleLinkClick}>Sign In</Link>
                  </Nav>
                  <Nav>
                    <Link to="/JoinNow" onClick={handleLinkClick}>Sign Up</Link>
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
