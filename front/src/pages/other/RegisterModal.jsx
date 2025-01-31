import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const RegisterModal = ({ onClose, activeTab }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    profilePic: null,
    companyBillingName: [''], // Only for users
  });
  const token = localStorage.getItem('token');

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [roles, setRoles] = useState([]);

  const inputRefs = useRef([]);
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleKeyDown = (e, index) => {
    // Handle Down arrow (ArrowDown or Enter for next input)
    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }

    // Handle Up arrow (ArrowUp for previous input)
    if (e.key === 'ArrowUp') {
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First Name is required';
    if (!formData.lastName) newErrors.lastName = 'Last Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (activeTab === 'User' && !formData.companyBillingName[0]) {
      newErrors.companyBillingName = 'Company Billing Name is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Check if profile pic exceeds 5MB
    if (formData.profilePic && formData.profilePic.size > 5 * 1024 * 1024) {
      setErrors({ profilePic: 'Profile picture must be less than 5MB.' });
      return;
    }

    try {
      const formPayload = new FormData();
      formPayload.append('firstName', formData.firstName);
      formPayload.append('lastName', formData.lastName);
      formPayload.append('email', formData.email);
      formPayload.append('phone', formData.phone);
      formPayload.append('role', formData.role);
    
      if (activeTab === 'User') {
        formPayload.append('companyBillingName', formData.companyBillingName);
      }
    
      if (formData.profilePic) {
        formPayload.append('profilePic', formData.profilePic); // Append the image file
      }
    
      const endpoint = activeTab === 'Employee' ? '/emp/empRegister' : '/user/userRegister';
      const baseUrl = import.meta.env.VITE_BASE_URL;
    
      // Perform the API request and await the response
      const response = await axios.post(`${baseUrl}${endpoint}`, formPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    
      console.log('Employee registered successfully', response.data);
    
      if (response.status === 201) {
        setSuccessMessage('Registration successful!');
        setTimeout(() => {
          setSuccessMessage('');
          onClose();
        }, 3000);
      }
    
    } catch (error) {
      if (error.response) {
        // The server responded with a status other than 2xx
        console.log('Error:', error.response.data.message);
        setErrors({ apiError: error.response.data.message });
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Request error:', error.request);
        setErrors({ apiError: 'No response from the server' });
      } else {
        // Something happened in setting up the request
        console.error('Error in setup:', error.message);
        setErrors({ apiError: error.message });
      }
    }
    
  };

  useEffect(() => {
    const storedRoles =
      activeTab === 'Employee'
        ? JSON.parse(localStorage.getItem('employeeRoles')) || []
        : JSON.parse(localStorage.getItem('userRoles')) || [];
    setRoles(storedRoles);
  }, [activeTab]);

  return (
    <StyledOverlay onClick={onClose}>
      <StyledModal onClick={(e) => e.stopPropagation()}>
        <section className="user-reg-container">
          <header>{activeTab} Registration</header>
          <form className="user-reg-form" onSubmit={handleSubmit}>
            <div className="user-reg-input-box">
              <label>Full Name</label>
              <div className="user-reg-name">
                <input
                  required
                  placeholder="Enter first name"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  ref={(el) => (inputRefs.current[0] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 0)}
                />
                {errors.firstName && <p className="user-reg-error">{errors.firstName}</p>}
                <input
                  required
                  placeholder="Enter last name"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  ref={(el) => (inputRefs.current[1] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 1)}
                />
                {errors.lastName && <p className="user-reg-error">{errors.lastName}</p>}
              </div>
            </div>

            <div className="user-reg-input-box">
              <label>Phone Number</label>
              <input
                required
                placeholder="Enter phone number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                ref={(el) => (inputRefs.current[2] = el)}
                onKeyDown={(e) => handleKeyDown(e, 2)}
              />
              {errors.phone && <p className="user-reg-error">{errors.phone}</p>}
            </div>

            <div className="user-reg-input-box">
              <label>Email</label>
              <input
                required
                placeholder="Enter email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                ref={(el) => (inputRefs.current[3] = el)}
                onKeyDown={(e) => handleKeyDown(e, 3)}
              />
              {errors.email && <p className="user-reg-error">{errors.email}</p>}
            </div>

            <div className="user-reg-input-box">
              <label>Role</label>
              <select
                required
                name="role"
                value={formData.role}
                onChange={handleChange}
                ref={(el) => (inputRefs.current[4] = el)}
                onKeyDown={(e) => handleKeyDown(e, 4)}
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role._id} value={role.roleName}>
                    {role.roleName}
                  </option>
                ))}
              </select>
              {errors.role && <p className="user-reg-error">{errors.role}</p>}
            </div>

            {activeTab === 'User' && (
              <div className="user-reg-input-box">
                <label>Company Billing Name</label>
                <input
                  required
                  placeholder="Enter company billing name"
                  type="text"
                  name="companyBillingName"
                  value={formData.companyBillingName[0]}
                  onChange={(e) => setFormData({ ...formData, companyBillingName: [e.target.value] })}
                  ref={(el) => (inputRefs.current[5] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 5)}
                />
                {errors.companyBillingName && <p className="user-reg-error">{errors.companyBillingName}</p>}
              </div>
            )}

            <div className="user-reg-input-box">
              <label>Profile Picture</label>
              <input
                type="file"
                name="profilePic"
                onChange={handleChange}
                ref={(el) => (inputRefs.current[6] = el)}
                onKeyDown={(e) => handleKeyDown(e, 6)}
              />
            </div>
            {errors.profilePic && <p className="error">{errors.profilePic}</p>}

            <div className="user-reg-buttons">
              <button type="submit">Submit</button>
              <button type="button" className="user-reg-close-btn" onClick={onClose}>Close</button>
            </div>

            {successMessage && <p className="user-reg-success">{successMessage}</p>}
            {errors.apiError && <p className="user-reg-error">{errors.apiError}</p>}
          </form>
        </section>
      </StyledModal>
    </StyledOverlay>
  );
};

const StyledOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const StyledModal = styled.div`
  position: relative;
  max-width: 500px;
  width: 100%;
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 1001;

  header {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
  }

  .user-reg-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .user-reg-input-box {
    display: flex;
    flex-direction: column;
  }

  .user-reg-name {
    display: flex;
    gap: 10px;
  }

  .user-reg-input-box label {
    margin-bottom: 5px;
    font-size: 1rem;
    font-weight: 600;
    color: #555;
  }

  input,
  select {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 1rem;
    margin-bottom: 15px;
    transition: border-color 0.3s;

    &:focus {
      border-color: #4a90e2;
      outline: none;
    }
  }

  .user-reg-buttons {
    display: flex;
    gap: 15px;
    justify-content: space-between;

    button {
      padding: 12px 18px;
      border-radius: 5px;
      font-size: 1rem;
      cursor: pointer;
      border: none;
      transition: background-color 0.3s;

      &:hover {
        background-color: #4a90e2;
        color: white;
      }

      .user-reg-close-btn {
        background-color: #e2e2e2;
      }

      button[type="submit"] {
        background-color: #4a90e2;
        color: white;
      }
    }
  }

  .user-reg-error {
    color: red;
    font-size: 0.875rem;
    margin-top: -10px;
  }

  .user-reg-success {
    color: green;
    font-size: 1rem;
    margin-top: 10px;
  }
`;

export default RegisterModal;
