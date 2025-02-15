import React, { useState, useEffect } from "react";
import "../../css/manageusererror.css"; // Import the corresponding CSS

const ManageUserSuccess = ({ successMessage, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (successMessage) {
      const timerId = setTimeout(() => {
        onClose();
      }, 4000); // Close the success message after 4 seconds
      setTimer(timerId);
    }

    return () => {
      if (timer) clearTimeout(timer); // Clean up the timer on unmount or if message changes
    };
  }, [successMessage, onClose]);

  const handleExpandClick = () => {
    if (timer) {
      clearTimeout(timer); // Stop the timer when the message is expanded
    }
    setIsExpanded(true); // Expand the message
  };

  const handleCloseClick = () => {
    onClose(); // Close the message when 'x' is clicked
  };

  if (!successMessage) return null; // Don't render the component if no message is passed

  return (
    <div className={`manageuser-success-message ${isExpanded ? 'expanded' : ''} show`}>
      <div className="manageuser-success-content">
        <p>{successMessage}</p>
        <div className="manageuser-success-actions">
          {!isExpanded && (
            <button onClick={handleExpandClick} className="manageuser-success-expand">
              More
            </button>
          )}
          <button onClick={handleCloseClick} className="manageuser-success-close">
            ✖
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageUserSuccess;
