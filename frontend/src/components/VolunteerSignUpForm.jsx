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

  const [errors, setErrors] = useState({});
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

  const validateForm = () => {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.contactNumber) {
      newErrors.contactNumber = 'Contact Number is required';
    } else if (!phonePattern.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.preferredRoles) newErrors.preferredRoles = 'Preferred Roles is required';
    if (!formData.agreePolicies) newErrors.agreePolicies = 'You must agree to the policies';
    if (!formData.understandUnpaid) newErrors.understandUnpaid = 'You must understand the volunteer position is unpaid';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await axios.post('/api/volunteerSignUp', formData);
        alert('Volunteer signed up successfully!');
        setSubmissionStatus('success');
      } catch (error) {
        console.error('Error signing up volunteer:', error);
        setSubmissionStatus('fail');
      }
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
    setErrors({});
  };

  return (
    <div className="volunteer-signup-form">
      <h2>Volunteer Sign-Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <div className="input-box">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className="input-box">
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Enter your contact number"
            required
          />
          {errors.contactNumber && <p className="error">{errors.contactNumber}</p>}
        </div>
        <div className="input-box">
          <input
            type="text"
            name="preferredRoles"
            value={formData.preferredRoles}
            onChange={handleChange}
            placeholder="Enter your preferred roles"
            required
          />
          {errors.preferredRoles && <p className="error">{errors.preferredRoles}</p>}
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
          {errors.agreePolicies && <p className="error">{errors.agreePolicies}</p>}
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
          {errors.understandUnpaid && <p className="error">{errors.understandUnpaid}</p>}
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
