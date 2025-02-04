import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../../css/changepassword.css';

function ChangePassword2() {
  const { token } = useParams(); // Extract the token from the URL
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verify token validity on component mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        console.log(token)
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/verifytokencp`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setIsTokenValid(true);
        } else {
          console.log(response)
          setMessage('Link has expired or is invalid.');
        }
      } catch (err) {
        setMessage('Link has expired or is invalid.');
      }
    };

    verifyToken();
  }, [token]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/changepassword`,
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setMessage('Password updated successfully. Please log in.');
      } else {
        setError('Failed to update the password. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while changing the password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isTokenValid) {
    return (
      <div className="changepassword-page">
        <div className="changepassword-container">
          <p className="changepassword-error">{message || 'Verifying link...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="changepassword-page">
      <div className="changepassword-container">
        <form className="changepassword-form" onSubmit={handleChangePassword}>
          <h2>Set a New Password</h2>
          {message && <p className="changepassword-success">{message}</p>}
          {error && <p className="changepassword-error">{error}</p>}
          <div className="changepassword-form-group">
            <input
              type="password"
              className="changepassword-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter new password"
              disabled={isSubmitting}
            />
          </div>
          <div className="changepassword-form-group">
            <input
              type="password"
              className="changepassword-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            className={`changepassword-button ${isSubmitting ? 'disabled' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Change Password'}
          </button>
          <p className="changepassword-additional-options">
            <Link to="/login" className="changepassword-link">
              Back to Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword2;
