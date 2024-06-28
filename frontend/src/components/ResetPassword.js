import React, { useState } from "react";
import "./ResetPassword.css";
import { FaLock } from "react-icons/fa";

const ResetPassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validate = () => {
    let isValid = true;

    // Validate new password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      setNewPasswordError(
        "New password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      isValid = false;
    } else {
      setNewPasswordError("");
    }

    // Validate password match
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Submit password reset request
      console.log("Password reset request submitted.");
    }
  };

  return (
    <div className="reset-password-wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Password Reset</h1>
        <p>Please reset your password.</p>
        <div className="input-box">
          <FaLock className="icon" />
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        {currentPasswordError && <p className="error">{currentPasswordError}</p>}

        <div className="input-box">
          <FaLock className="icon" />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        {newPasswordError && <p className="error">{newPasswordError}</p>}

        <div className="input-box">
          <FaLock className="icon" />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {confirmPasswordError && <p className="error">{confirmPasswordError}</p>}

        <button type="submit">Reset Password</button>

        <div className="link">
          <p>
            <a href="/login">Go back</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
