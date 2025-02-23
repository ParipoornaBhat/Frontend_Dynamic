import React, { useState } from 'react';
import axios from 'axios';
import ManageUserError from '../other/ErrorMessage'; // Import the ErrorMessage component
import ManageUserSuccess from '../other/SuccessMessage'; // Import the SuccessMessage component
import styled from 'styled-components';

const Modal = ({ editFormData, onClose, onSave }) => {
  const [formData, setFormData] = useState(editFormData); // Form data initialized with passed data
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isOptionsFetched, setIsOptionsFetched] = useState(false); // Track if options are fetched
  // Handle adding a new option to a material
  const handleAddOption = (materialName) => {
    const newOption = prompt('Enter a new option:');
    if (newOption) {
      const updatedData = formData.map((material) =>
        material.name === materialName
          ? { ...material, options: [...material.options, newOption] }
          : material
      );
      setFormData(updatedData);
    }
  };

  // Handle deleting an option from a material
  const handleDeleteOption = (materialName, optionToDelete) => {
    const updatedData = formData.map((material) =>
      material.name === materialName
        ? {
            ...material,
            options: material.options.filter((option) => option !== optionToDelete),
          }
        : material
    );
    setFormData(updatedData);
  };

  // Handle the form submission (saving the data)
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('No authentication token found');
        return;
      }
      console.log(formData)
      // POST the updated options to the backend
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/general/optionEdit`,  // Make sure this is the correct endpoint
        { BOPPoptions: formData },  // Send the updated form data
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Include the token in the Authorization header
          },
        }
      );
      

      setSuccessMessage('Options saved successfully.');
      onSave(); // Call onSave to refresh options in the parent component
      onClose(); // Close the modal after saving
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to save options.');
    }
  };

  // Handle input changes if needed (optional)
  const handleChange = (e, materialName) => {
    const { name, value } = e.target;

    const updatedData = formData.map((material) =>
      material.name === materialName
        ? {
            ...material,
            options: material.options.map((option, index) =>
              index === parseInt(name) ? value : option
            ),
          }
        : material
    );
    setFormData(updatedData);
  };

  return (
    <>
      {/* Display error and success messages */}
      {errorMessage && (
        <ManageUserError errorMessage={errorMessage} onClose={() => setErrorMessage('')} />
      )}
      {successMessage && (
        <ManageUserSuccess successMessage={successMessage} onClose={() => setSuccessMessage('')} />
      )}

      {/* Modal structure using Styled Components */}
      <StyledOverlay>
      <StyledModal>
  <h2>Edit Material Options</h2>

  {/* Display each material and their options */}
  <form>
    {Array.isArray(formData) && formData.length > 0 ? (
      formData.map((material) => (
        <div key={material.name}>
          <h3>{material.name}</h3>
          <div>
            {Array.isArray(material.options) &&
              material.options.map((option, optionIndex) => (
                <div key={optionIndex} className="formsetModal-option-row">
                  <input
                    type="text"
                    value={option}
                    name={optionIndex.toString()}
                    onChange={(e) => handleChange(e, material.name)}
                  />
                  <button type="button" onClick={() => handleDeleteOption(material.name, option)}>
                    Delete
                  </button>
                </div>
              ))}
          </div>
          <button type="button" onClick={() => handleAddOption(material.name)}>
            Add Option
          </button>
        </div>
      ))
    ) : (
      <p>No materials available</p>
    )}
  </form>

  {/* Modal action buttons */}
  <div className="formsetModal-modal-actions">
    <button type="button" onClick={onClose}>Close</button>
    <button type="button" onClick={handleSave}>Save</button>
  </div>
</StyledModal>

      </StyledOverlay>
    </>
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

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
  }

  .formsetModal-option-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  input {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 1rem;
    width: 70%;
  }

  button {
    padding: 5px 10px;
    border-radius: 5px;
    background-color: #f44336;
    color: white;
    border: none;
    cursor: pointer;
  }

  .formsetModal-modal-actions {
    display: flex;
    gap: 15px;
    justify-content: flex-end;
    margin-top: 20px;

    button {
      padding: 10px 20px;
      border-radius: 5px;
      font-size: 1rem;
      cursor: pointer;
      border: none;
      transition: background-color 0.3s;

      &:hover {
        background-color: #4a90e2;
        color: white;
      }
    }
  }

  /* Enable overflow */
  max-height: 80vh; /* Optional: limit the modal height to a percentage of the viewport */
  overflow-y: auto; /* Enables scrolling when content exceeds the modal height */
`;


export default Modal;
