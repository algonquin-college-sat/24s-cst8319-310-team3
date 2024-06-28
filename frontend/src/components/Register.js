import React, { useState, useEffect } from "react";
import "./Register.css";
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import Alert from "@mui/material/Alert";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [additionalFieldsVisible, setAdditionalFieldsVisible] = useState(false);
  const [showNameField, setShowNameField] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [userData, setUserData] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [signupMessage, setSignupMessage] = useState(false);

  const EyeIcon = showPassword ? FaEye : FaEyeSlash;
  const ConfirmEyeIcon = showConfirmPassword ? FaEye : FaEyeSlash;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$#!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };

  const passwordsMatch = (password1, password2) => {
    return password1 === password2;
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError(!isValidEmail(e.target.value) || e.target.value === "");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError(!isValidPassword(e.target.value));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError(!passwordsMatch(password, e.target.value));
  };

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      console.log("Invalid email:", email);
      return;
    } else if (email === "") {
      setEmailError("Please enter your email address.");
    }

    setLoading(true);

    try {
      console.log("Sending OTP request to server...");
      const response = await axios.post("http://localhost:3000/api/otp/send-otp", { email });
      console.log("OTP response received:", response.data);

      if (response.data.status === "success") {
        setShowOtpModal(true);
      } else if (response.data.status === "fail") {
        setEmailError(response.data.message);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    console.log("OTP submitted:", otp);

    try {
      const [otpResponse, userResponse] = await Promise.all([
        axios.post("http://localhost:3000/api/otp/verify-otp", { email, otp }),
        axios.post("http://localhost:3000/api/user/check", { email }),
      ]);

      if (otpResponse.data.status === "success" && userResponse.data.status === "success") {
        console.log("OTP verified! and you have a membership");
        console.log("userResponse.data:", userResponse.data);
        setUserData(userResponse.data);
        setOtpError("");
        setAdditionalFieldsVisible(true);
        setShowNameField(false);
        setShowOtpModal(false);
      } else if (otpResponse.data.status === "success" && userResponse.data.status === "fail") {
        console.log("OTP verified!");
        setAdditionalFieldsVisible(true);
        setShowNameField(true);
        setShowOtpModal(false);
      } else {
        setOtpError("Otp is not valid, please enter it again");
        console.log("OTP verificatin is failed");
        setOtp("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    // Handle the completion of registration here
    // Validate input fields
    let errors = {};

    if (!userData || !userData.data) {
      if (!firstName.trim()) {
        setFirstNameError(true);
        errors.firstName = true;
      }

      if (!lastName.trim()) {
        setLastNameError(true);
        errors.lastName = true;
      }
    }

    if (!password.trim()) {
      errors.password = true;
    }

    if (!confirmPassword.trim()) {
      errors.confirmPassword = true;
    }

    if (Object.keys(errors).length > 0) {
      // Display error messages or handle validation errors
      return;
    }

    if (!isValidPassword(password)) {
      console.log("Password does not meet complexity requirements");
      return;
    }
    if (!passwordsMatch(password, confirmPassword)) {
      console.log("Passwords do not match");
      return;
    }

    let dataToSend;

    if (!userData || !userData.data) {
      // if userData not exist, create a new user
      dataToSend = {
        email,
        first_name: firstName,
        last_name: lastName,
        created: new Date().toISOString(),
        isPaid: false,
        password,
      };
    } else {
      // if userData exists, use the user data from mockfile/api call
      dataToSend = {
        email: userData.data.email,
        first_name: userData.data.first_name || "",
        last_name: userData.data.last_name || "",
        created: userData.data.created,
        event_id: userData.data.event_id,
        isPaid: true,
        password,
      };
    }

    try {
      const response = await axios.post("http://localhost:3000/api/auth/signup", dataToSend);
      if (response.data.status === "success") {
        console.log("Success to save user data");
        setSignupMessage("Successfully signed up! Redirecting to login page...");
        setRedirectUrl(response.data.redirectUrl);
      } else if (response.data.status === "fail") {
        console.log("Failed to save user data");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (redirectUrl) {
      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 3000); // redirect after 3 seconds
    }
  }, [redirectUrl]);

  return (
    <div className="register-wrapper">
      <div className="register-box">
        <h2 id="register-modal-title">Register</h2>
        {signupMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {signupMessage}
          </Alert>
        )}
        <div className="input-box">
          <FaEnvelope className="icon" />
          <input
            id="email"
            type="text"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={emailError && !isFocused ? "error-input" : ""}
            disabled={additionalFieldsVisible}
          />
        </div>
        {emailError && !isFocused && <p className="error-text">{emailError}</p>}
        {loading && <p className="loading-spinner">Loading...</p>}
        {!additionalFieldsVisible && (
          <>
            <button className="register-button" onClick={handleSubmit}>
              Continue
            </button>
            <div className="register-link">
              <p>
                Do you have an account? <a href="/Login">Login</a>
              </p>
            </div>
          </>
        )}

        {additionalFieldsVisible && (
          <>
            {showNameField && (
              <>
                <div className="input-box">
                  <FaUser className="icon" />
                  <input
                    type="text"
                    placeholder="First Name"
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setFirstNameError(false);
                    }}
                    required
                    className={firstNameError ? "error-input" : ""}
                  />
                </div>
                {firstNameError && <p className="error-text">First Name is required.</p>}
                <div className="input-box">
                  <FaUser className="icon" />
                  <input
                    type="text"
                    placeholder="Last Name"
                    onChange={(e) => {
                      setLastName(e.target.value);
                      setLastNameError(false);
                    }}
                    required
                    className={lastNameError ? "error-input" : ""}
                  />
                </div>
                {lastNameError && <p className="error-text">Last Name is required.</p>}
              </>
            )}
            <div className="input-box">
              <FaLock className="icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required
                className={passwordError ? "error-input" : ""}
              />
              <EyeIcon onClick={togglePasswordVisibility} className="eye-icon" />
            </div>
            {passwordError && (
              <p className="error-text">
                Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase
                letter, one number, and one special character.
              </p>
            )}
            <div className="input-box">
              <FaLock className="icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                onChange={handleConfirmPasswordChange}
                required
                className={confirmPasswordError ? "error-input" : ""}
              />
              <ConfirmEyeIcon onClick={toggleConfirmPasswordVisibility} className="eye-icon" />
            </div>
            {confirmPasswordError && <p className="error-text">Passwords do not match.</p>}
            <button className="register-button" onClick={handleCompleteRegistration}>
              Complete Registration
            </button>
          </>
        )}

        {showOtpModal && (
          <div className="otp-modal">
            <div className="otp-modal-content">
              <span className="close" onClick={() => setShowOtpModal(false)}>
                &times;
              </span>
              <h2>Enter OTP</h2>
              <Alert severity="success" sx={{ mb: 2 }}>
                We've sent a verifiaction code to your email
              </Alert>
              <form onSubmit={handleOtpSubmit}>
                <div className="input-box">
                  <FaLock className="icon" />
                  <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                </div>
                {otpError && <p className="error-text">{otpError}</p>}
                <button className="register-button" type="submit">
                  Verify
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
