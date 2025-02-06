import React, { useState, useEffect } from "react";
import "../../css/manageusererror.css"; // Import the corresponding CSS

const ManageUserError = ({ errorMessage, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (errorMessage) {
      const timerId = setTimeout(() => {
        onClose();
      }, 4000); // Closes the error message after 4 seconds
      setTimer(timerId);
    }

    return () => {
      if (timer) clearTimeout(timer); // Clean up the timer on unmount or if message changes
    };
  }, [errorMessage, onClose]);

  const handleExpandClick = () => {
    if (timer) {
      clearTimeout(timer); // Stop the timer when the message is expanded
    }
    setIsExpanded(true);
  };

  const handleCloseClick = () => {
    onClose(); // Close the error message when 'x' is clicked
  };

  if (!errorMessage) return null;

  return (
    <div className={`manageuser-error-message ${isExpanded ? 'expanded' : ''} show`}>
      <div className="manageuser-error-content">
        <p>{errorMessage}</p>
        <div className="manageuser-error-actions">
          {!isExpanded && (
            <button onClick={handleExpandClick} className="manageuser-error-expand">
              More
            </button>
          )}
          <button onClick={handleCloseClick} className="manageuser-error-close">
            ✖
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageUserError;
