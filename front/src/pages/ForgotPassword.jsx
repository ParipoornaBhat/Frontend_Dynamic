import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios for making HTTP requests
import '../css/Login.css'; // Reusing the same CSS for consistent styling

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email) {
      setError('Email is required.');
      return;
    }

    setIsLoading(true); // Set loading state
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/forgotpassword`,
        { email }
      );

      setSuccessMessage('Password reset link has been sent to your email.');
    } catch (err) {
      // Handle error
      setError(err.response?.data?.message || err.message || 'Failed to send the reset link.');
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <form className="login-form" onSubmit={handleForgotPassword}>
          <h2>Reset Your Password</h2>

          {/* Display error message */}
          {error && (
            <div
              style={{
                color: 'red',
                backgroundColor: '#ffe6e6',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '15px',
                textAlign: 'center',
              }}
            >
              {error}
            </div>
          )}

          {/* Display success message */}
          {successMessage && (
            <div
              style={{
                color: 'green',
                backgroundColor: '#e6ffe6',
                padding: '10px',
                borderRadius: '5px',
                marginBottom: '15px',
                textAlign: 'center',
              }}
            >
              {successMessage}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email"></label>
            <input
              type="email"
              id="login-password"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
          <p className="additional-options">
            Remembered your password? <Link to="/login" className="signup-link">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
