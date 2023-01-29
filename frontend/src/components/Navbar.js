import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../styles/nav.css";
import { useUserAuth } from "../context/UserAuthContext";
import { auth } from "../firebase";
function Navbar() {
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
      <nav>
        <ul>
          <li>
            <Link to="/">Linkedin</Link>
          </li>
          {userr && (
            <>
              <li>
                <Link to="/Profile">Profile</Link>
                <button onClick={handleLogout} className="list-item">
                  logout
                </button>
              </li>
            </>
          )}
          {!userr && (
            <>
              <li>
                <Link to="/SignIn">Sign In</Link>
              </li>
              <li>
                <Link to="/JoinNow">Join Now</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <Outlet />
    </>
  );
}

export default Navbar;
