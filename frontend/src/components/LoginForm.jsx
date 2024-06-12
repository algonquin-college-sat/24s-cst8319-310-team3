import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./LoginForm.css";
import { FaUser, FaLock } from "react-icons/fa";
import axios from "axios";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [loginError, setLoginError] = useState("");

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validate = () => {
    let isValid = true;
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Email:", email);

      try {
        const response = await axios.post("http://localhost:3000/api/user/login", { email, password });
        if (response.data.status === "success") {
          setRedirectUrl(response.data.redirectUrl);
        } else if (response.data.status === "fail") {
          setLoginError(response.data.message);
          console.log(loginError);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }, [redirectUrl]);

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div className="input-box">
          <FaUser className="icon" />
          <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        {emailError && <p className="error">{emailError}</p>}

        <div className="input-box">
          <FaLock className="icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {loginError && <p className="error">{loginError}</p>}
        <div className="remember-forgot">
          <label>
            <input type="checkbox" />
            Remember me
          </label>
          <a href="/reset-password">Forgot password?</a>
        </div>

        <button type="submit">Login</button>

        <div className="register-link">
          <p>
            Don't have an account? <a href="/Register">Sign up</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
