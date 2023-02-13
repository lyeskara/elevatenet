import React, { useState } from "react";
import { useUserAuth } from "../../context/UserAuthContext.js";
import { useNavigate } from "react-router-dom";
import {} from "react-bootstrap";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { Login } = useUserAuth();
  const navigate = useNavigate();

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
    <div>
      <p className="slogan">Bring your career to new heights</p>
    </div>
    
    <div className="container">
      <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} />
      </label>
      <br />
      <button type="submit"> Agree & Join</button>
    </form>
    </div>
    </>
    
    
  );
};

export default SignIn;
