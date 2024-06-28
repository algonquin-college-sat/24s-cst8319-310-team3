import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VolunteerSignUpForm.css';

const VolunteerSignUpForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    preferredRoles: '',
    agreePolicies: false,
    understandUnpaid: false,
  });

  const [submissionStatus, setSubmissionStatus] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('/api/getUserInfo');
        setFormData((prevFormData) => ({
          ...prevFormData,
          name: response.data.name,
          email: response.data.email,
        }));
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/volunteerSignUp', formData);
      alert('Volunteer signed up successfully!');
      setSubmissionStatus('success');
    } catch (error) {
      console.error('Error signing up volunteer:', error);
      setSubmissionStatus('fail');
    }
  };

  const handleClearForm = () => {
    setFormData({
      name: '',
      email: '',
      contactNumber: '',
      preferredRoles: '',
      agreePolicies: false,
      understandUnpaid: false,
    });
  };

  return (
    <div className="volunteer-signup-form">
      <h2>Volunteer Sign-Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        </div>
        <div className="input-box">
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        </div>
        <div className="input-box">
          <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="Contact Number" required />
        </div>
        <div className="input-box">
          <input type="text" name="preferredRoles" value={formData.preferredRoles} onChange={handleChange} placeholder="Preferred Roles" required />
        </div>
        <div className="volunteer-agreement">
          <label>
            <input
              type="checkbox"
              name="agreePolicies"
              checked={formData.agreePolicies}
              onChange={handleChange}
              required
            />
            I agree to abide by the policies and guidelines of Ottawa Tamil Sangam
          </label>
          <label>
            <input
              type="checkbox"
              name="understandUnpaid"
              checked={formData.understandUnpaid}
              onChange={handleChange}
              required
            />
            I understand that my volunteer position is unpaid and does not imply any employment relationship.
          </label>
        </div>
        <button type="submit">Submit</button>
        <button type="button" onClick={handleClearForm} className="clear-form">Clear form</button>
      </form>
      {submissionStatus === 'success' && <p>Thank you for signing up as a volunteer!</p>}
      {submissionStatus === 'fail' && <p>There was an error submitting the form. Please try again.</p>}
    </div>
  );
};

export default VolunteerSignUpForm;
