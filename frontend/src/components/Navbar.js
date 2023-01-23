import React from 'react'
import {Link,Outlet} from 'react-router-dom'

function Navbar() {
  return (
    <>
    <nav>
    <ul>
        <li>
          <Link to="/">Linkedin</Link>
        </li>
        <li>
          <Link to="/SignIn">Sign In</Link>
        </li>
        <li>
          <Link to="/JoinNow">Join Now</Link>
        </li>
    </ul>
    </nav>
          <Outlet />
          </>
  )
}

export default Navbar
