import React, { useState } from 'react';
import '../css/Login.css'; // Keeping the existing CSS import
import axios from 'axios'
import { useNavigate, Link } from "react-router-dom";


function Login() {
  const [ password, setPassword ] = useState('')
  const [identifier, setIdentifier] = useState('');
  const [errors, setErrors] = useState([]); // State to store backend error messages
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = {
      email: identifier,
      password: password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/emp/login`,
        userData
      );

      if (response.status === 200) {
        const data = response.data;

        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('_id', data.id);
        navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const responseData = error.response.data;
        if (responseData.errors) {
          // Field-specific errors
          setErrors(responseData.errors.map((err) => err.msg));
        } else if (responseData.message) {
          // General error message
          setErrors([responseData.message]);
        } else {
          setErrors(['An unexpected error occurred. Please try again.']);
        }
      } else {
        setErrors(['An unexpected error occurred. Please try again.']);
      }
    }
  };

  const handleKeyDown = (e, nextInputId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextInput = document.getElementById(nextInputId);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  return (
    <div className="login-page">
      
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Welcome to the Portal</h2>
          {errors.length > 0 && (
            <div className="login-errors">
              {errors.map((error, index) => (
                <div key={index} className="login-error">
                  {error}
                </div>
              ))}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="identifier"></label>
            <input
              type="text"
              id="login-identifier"
              className="login-input"
              value={identifier}
              onKeyDown={(e) => handleKeyDown(e, 'login-password')} // Move focus to password field on Enter
              onChange={(e) => setIdentifier(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="login-label"></label>
            <div className="login-password-container">
           <input
              type={showPassword ? "text" : "password"}               
              id="login-password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            /> 
            <span
            className="login-password-toggle"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <i className="fas fa-eye-slash"></i> // Eye slash icon when password is visible
            ) : (
              <i className="fas fa-eye"></i> // Eye icon when password is hidden
            )}
          </span>
          </div>
          </div>
          <Link to="/forgotpassword" className="forgot-password-link">
              Forgot Password?
            </Link>
          <button type="submit" className="login-button">
            Login
          </button>
          
            
            
          
        </form>
      </div>
    </div>
  );

}
export default Login;
