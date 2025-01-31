import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css'; // Reusing the same CSS for consistent styling

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Registering with:', email, password, confirmPassword);
    // Registration logic here
  };

  return (
    <div className="login-page">
      <div className="image-container">
        <img src="https://dynamicpackagings.co/images/logo.png" alt="Welcome" className="welcome-image" />
      </div>
      <div className="login-container">
        <form className="login-form" onSubmit={handleRegister}>
          <h2>Create an Account</h2>
          <div className="form-group">
            <label htmlFor="email"></label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password"></label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password"></label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
            />
          </div>
          <button type="submit" className="login-button">
            Register
          </button>
          <p className="additional-options">
            Already have an account? <Link to="/auth/login" className="signup-link">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
