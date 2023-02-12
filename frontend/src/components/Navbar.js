import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../styles/nav.css";
import { useUserAuth } from "../context/UserAuthContext";
import { auth } from "../firebase";
import logo from './../images/logo.JPG';
import home from './../images/icon_home.png';
import person from './../images/icon_person.png';
import briefcase from './../images/icon_briefcase.png';
import connection from './../images/connection.png';
import bell from './../images/icon_bell.png';
import ellipses from './../images/icon_ellipses.png';
import {Navbar, Nav, Container} from "react-bootstrap"; 


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
        <Navbar.Brand href="/"><img src={logo} alt="ElevateNet"></img></Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
        <Nav className="me-auto">
           
          </Nav>
          <Nav>
          
          
          {userr && (
            <>

            <Nav>
              
              <Link  to="/"><img src={home} alt="home"></img></Link>
                <Link  to="/Profile"><img src={person} alt="profile"></img></Link>
                <Link  to="/"><img src={briefcase} alt="briefcase"></img></Link>
                <Link  to="/"><img src={connection} alt="connection"></img></Link>
                <Link  to="/"><img src={bell} alt="bell"></img></Link>
                <Link  to="/"><img src={ellipses} alt="ellipses"></img></Link>

              <li>
                <Link to="/Profile">Profile</Link>
                <button><Search/></button>

                <button onClick={handleLogout} className="list-item">
                  logout
                </button>
              
            </Nav>
              
            </>
          )}
          {!userr && (
            <>
              <div>
                 <Link to="/SignIn">Sign In</Link>
              </div>

               <div><Link to="/JoinNow">Sign Up</Link>    </div>
                
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
