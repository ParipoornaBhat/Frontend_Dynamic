import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../../css/profile.css';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import defaultpic from '../../assets/default.png';
import ManageUserError from '../other/ErrorMessage'; // Import the ErrorMessage component
import ManageUserSuccess from '../other/SuccessMessage'; // Import the SuccessMessage component

const Profile = ({ isVisible, onClose }) => {
  const [profileData, setProfileData] = useState(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // State to handle image preview
  const [profileeditError, setProfileeditError] = useState(''); // State for error message
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');
  const _id = localStorage.getItem('_id');
  const fileInputRef = useRef(null); // For triggering file input
  const [errorMessage, setErrorMessage] = useState('');

  const fetchProfile = async () => {
    if (!isVisible || !token) return;

    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/emp/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 && response.data) {
        setProfileData(response.data);
      } else {
        setErrorMessage('Failed to fetch profile details.');
      }
    } catch (error) {
      setErrorMessage('Error fetching profile data. Please try again later.');
    }
  };
  useEffect(() => {
      if (isVisible) {
      fetchProfile();
    }
  }, [isVisible, token]);

  const handleEditToggle = () => {
    setIsEditing((prevState) => {
      const newIsEditing = !prevState;
  
      // If the user is cancelling the edit, refetch the profile data
      if (!newIsEditing) {
        fetchProfile(); // Fetch profile again when canceling the edit
      }
  
      return newIsEditing;
    });
  };
/*
  const handleSaveChanges = async () => {
    if (!profileData) return;

    try {
        const { address, msgService, profilePic } = profileData;
        const updates = {};

        // Add address updates if available
        if (address) {
            updates.address = {
                street: address.street,
                city: address.city,
                state: address.state,
                postalCode: address.postalCode,
                country: address.country,
            };
        }

        // Add msgService update if available
        if (msgService) {
            updates.msgService = msgService;
        }

        const formData = new FormData();
        formData.append('_id', profileData._id);
        formData.append('updates', JSON.stringify(updates)); // Convert updates to JSON string

        // Append profilePic only if it's a File object
        if (profilePic instanceof File) {
            formData.append('profilePic', profilePic);
        }

        const response = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/general/selfProfileEdit`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        if (response.status === 200) {
            setProfileData((prev) => ({
                ...prev,
                address: updates.address || prev.address,
                msgService: updates.msgService || prev.msgService,
                profilePic: profilePic instanceof File ? URL.createObjectURL(profilePic) : prev.profilePic, // Update profilePic preview if changed
            }));
            setIsEditing(false);
            setUpdateMessage('Profile updated successfully!');
        } else {
            setUpdateMessage('Failed to update profile.');
        }

        setTimeout(() => {
            setUpdateMessage('');
        }, 2000);
    } catch (error) {
        setUpdateMessage('Error saving profile. Please try again later.');
    }
};*/

const handleForgotPassword = async (e) => {
  e.preventDefault();
  setUpdateMessage('');

  // Create a FormData object to collect form data
  const formData = new FormData(e.target); // e.target refers to the form element
  
  // Get the email from FormData
  const email = formData.get('email');  // Make sure the email field has name="email"

  if (!email) {
    setErrorMessage('Email is required.');
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
    setErrorMessage(`Error in sending email: ${err.message}`);
    setTimeout(() => {
      setUpdateMessage('');
    }, 2000);
  } finally {
    setIsLoading(false); // Reset loading state
    setTimeout(() => {
      setUpdateMessage('');
    }, 2000);
  }
};
  

  const handleKeyDown = (e, nextField) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextField) {
        document.getElementById(nextField)?.focus();
      } else {
        handleSaveChanges();
      }
    } else if (e.key === 'ArrowDown') {
      moveFocus(e.target.id, 'down');
    } else if (e.key === 'ArrowUp') {
      moveFocus(e.target.id, 'up');
    }
  };

  const moveFocus = (currentFieldId, direction) => {
    const fields = ['street', 'city', 'state', 'postalCode', 'country'];
    const currentIndex = fields.indexOf(currentFieldId);
    let nextIndex = currentIndex;

    if (direction === 'down' && currentIndex < fields.length - 1) {
      nextIndex = currentIndex + 1;
    } else if (direction === 'up' && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    }

    document.getElementById(fields[nextIndex])?.focus();
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            setProfileeditError('File size exceeds 5MB, please upload a smaller file.');
            setSelectedImage(null);
            return;
        }

        setProfileeditError('');
        setSelectedImage(URL.createObjectURL(file));

        // Update profileData with the actual File object
        setProfileData((prev) => ({
            ...prev,
            profilePic: file,  // Store the File object
        }));
    }
};
// Handle input changes
const handleChange = (e, field, index) => {
  setProfileData((prev) => {
    const updatedField = [...(prev[field] || [])];
    const value = e.target.value.trim(); // Trim spaces

    // Prevent setting empty values (optional)
    if (value === "") {
      updatedField[index] = ""; // Keep it controlled, but don't save it in updates
    } else {
      updatedField[index] = value;
    }

    return { ...prev, [field]: updatedField };
  });
};
const handleDeleteItem = (field, index) => {
  setProfileData((prev) => {
    const updatedField = [...(prev[field] || [])];
    updatedField.splice(index, 1); // Remove item
    return { ...prev, [field]: updatedField };
  });
};
// Handle adding an item
const handleAddItem = (field) => {
  setProfileData((prev) => {
    const updatedField = [...(prev[field] || []), ""]; // Add empty string to keep input controlled
    return { ...prev, [field]: updatedField };
  });
};

const handleSaveChanges = async () => {
  if (!profileData) return;

  try {
    const { addresses = [], brands = [], companyBillingName = [], msgService, profilePic, role } = profileData;
    const updates = {};

    // Fetch userRoles from localStorage
    const userRoles = JSON.parse(localStorage.getItem("userRoles")) || [];

    // Check if the user's role is in userRoles
    const canEditBrandsAndCompany = userRoles.some(userRole => userRole.roleName === role);

    // Remove empty strings before updating
    const filteredAddresses = addresses.filter(addr => addr.trim() !== "");
    if (filteredAddresses.length > 0) updates.addresses = filteredAddresses;

    if (canEditBrandsAndCompany) {
      const filteredBrands = brands.filter(brand => brand.trim() !== "");
      const filteredCompanyBillingNames = companyBillingName.filter(name => name.trim() !== "");

      if (filteredBrands.length > 0) updates.brands = filteredBrands;
      if (filteredCompanyBillingNames.length > 0) updates.companyBillingName = filteredCompanyBillingNames;
    }

    if (msgService) updates.msgService = msgService;

    const formData = new FormData();
    formData.append('_id', profileData._id);
    formData.append('updates', JSON.stringify(updates)); // Convert updates to JSON

    // Append profilePic only if it's a new file
    if (profilePic instanceof File) {
      formData.append('profilePic', profilePic);
    }

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/general/selfProfileEdit`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.status === 200) {
      setProfileData((prev) => ({
        ...prev,
        ...updates, // Apply updated fields
        profilePic: profilePic instanceof File ? URL.createObjectURL(profilePic) : prev.profilePic,
      }));
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
    } else {
      setErrorMessage('Failed to update profile.');
    }

    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 2000);
  } catch (error) {
    setErrorMessage('Error saving profile. Please try again later.');
  }
};





  const handleMsgServiceToggle = async (type) => {
    if (!profileData) return;

    const updatedMsgService = { 
      ...profileData.msgService, 
      [type]: !profileData.msgService?.[type] 
    };

    setProfileData((prev) => ({ ...prev, msgService: updatedMsgService }));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/general/selfProfileEdit`,
        {
          _id,
          updates: { msgService: updatedMsgService },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setSuccessMessage('Message service settings updated successfully!');
      } else {
        setErrorMessage('Failed to update message service settings.');
      }
    } catch (error) {
      setErrorMessage('Error updating message service settings.');
    }

    setTimeout(() => {
      setUpdateMessage(`\n \n`);
    }, 2000);
  };

  if (error) {
    return (
      <div className={`profile-container ${isVisible ? 'visible' : ''}`}>
        <button className="close-button" onClick={onClose}>X</button>
       <br/><br/><br/><br/> <p>{error}</p>
      </div>
    );
  }

  return (
    
    <div className={`profile-container ${isVisible ? 'visible' : ''}`}>
      <button className="close-button" onClick={onClose}>X</button>
      <div className="profile-header">
        {!isEditing && (
          <FontAwesomeIcon
            icon={faPen}
            className="edit-icon"
            onClick={handleEditToggle}
            title="Edit Profile"
          />
        )}
      </div>
      <div className="profile-content">
      {!isEditing ? (
<>
  <div className="profile-picture-container" onClick={handleImageClick}>
    <img
      src={selectedImage || profileData?.profilePic || defaultpic}
      alt="Profile"
      className="profile-picture"
    />
  </div>
  <div className="profile-details">
    <h2>{profileData?.fullName?.firstName} {profileData?.fullName?.lastName}</h2>
    <p><strong>ID:</strong> {profileData?.ID}</p>
    <p><strong>Phone:</strong> {profileData?.phone}</p>
    <p><strong>Email:</strong> {profileData?.email}</p>
    <p><strong>Role:</strong> {profileData?.role}</p>

    {/* Display Addresses */}
    <p><strong>Addresses:</strong></p>
    <ul className="profile-address-list">
      {profileData?.addresses?.length ? (
        profileData.addresses.map((address, index) => <li key={index}>{address}</li>)
      ) : (
        <li>No Addresses</li>
      )}
    </ul>

    {/* Check userRoles from localStorage */}
    {(() => {
    const userRoles = JSON.parse(localStorage.getItem("userRoles")) || [];

    // Check if profileData.role exists in any roleName inside userRoles
    const canViewBrandsAndCompany = userRoles.some(role => role.roleName === profileData?.role);

    return canViewBrandsAndCompany ? (
        <>
            {/* Display Brands */}
            <p><strong>Brands:</strong></p>
            <ul className="profile-brand-list">
                {profileData?.brands?.length ? (
                    profileData.brands.map((brand, index) => <li key={index}>{brand}</li>)
                ) : (
                    <li>No Brands</li>
                )}
            </ul>

            {/* Display Company Billing Name */}
            <p><strong>Company Billing Name:</strong></p>
            <ul className="profile-company-list">
                {profileData?.companyBillingName?.length ? (
                    profileData.companyBillingName.map((name, index) => <li key={index}>{name}</li>)
                ) : (
                    <li>No Company Billing Name</li>
                )}
            </ul>
        </>
    ) : null;
})()}

  </div>
</>

) : (
  <>
    <div className="profile-picture-container" onClick={handleImageClick}>
      <img
        src={selectedImage || profileData?.profilePic || defaultpic}
        alt="Profile"
        className="profile-picture"
      />
    </div>
    {isEditing && (
      <div className="image-overlay">
        <FontAwesomeIcon icon={faPen} className="edit-icon" title="Edit Profile Picture" />
      </div>
    )}
    <input
      type="file"
      ref={fileInputRef}
      style={{ display: 'none' }}
      accept="image/*"
      onChange={handleImageChange}
    />
    <div className="edit-form">
      <h2>{profileData?.fullName?.firstName} {profileData?.fullName?.lastName}</h2>
      <p><strong>ID:</strong> {profileData?.ID}</p>
      <p><strong>Phone:</strong> {profileData?.phone}</p>
      <p><strong>Email:</strong> {profileData?.email}</p>
      <p><strong>Role:</strong> {profileData?.role}</p>

      {/* Edit Addresses */}
      {/* Edit Addresses */}
      <div>
      
  <h3>Addresses</h3>
  {profileData?.addresses?.map((address, index) => (
    <div key={index} className="modal-option-row">
      <input 
        type="text" 
        value={address ?? ""} // Ensure controlled input
        onChange={(e) => handleChange(e, 'addresses', index)} 
      />
      <button type="button" onClick={() => handleDeleteItem('addresses', index)}>Delete</button>
    </div>
  ))}
  <button type="button" onClick={() => handleAddItem('addresses')}>Add Address</button>
</div>

{/* Edit Brands & Company Billing Names */}
{(() => {
    const userRoles = JSON.parse(localStorage.getItem("userRoles")) || [];
    
    // Check if the user's role exists in userRoles
    const canEditBrandsAndCompany = userRoles.some(role => role.roleName === profileData?.role);

    if (!canEditBrandsAndCompany) return null; // Prevent rendering if not authorized

    return (
        <>
            <div>
                <h3>Brands</h3>
                {profileData?.brands?.map((brand, index) => (
                    <div key={index} className="modal-option-row">
                        <input 
                          type="text" 
                          value={brand ?? ""} // Ensure controlled input
                          onChange={(e) => handleChange(e, 'brands', index)} 
                        />
                        <button type="button" onClick={() => handleDeleteItem('brands', index)}>Delete</button>
                    </div>
                ))}
                <button type="button" onClick={() => handleAddItem('brands')}>Add Brand</button>
            </div>

            <div>
                <h3>Company Billing Names</h3>
                {profileData?.companyBillingName?.map((name, index) => (
                    <div key={index} className="modal-option-row">
                        <input 
                          type="text" 
                          value={name ?? ""} // Ensure controlled input
                          onChange={(e) => handleChange(e, 'companyBillingName', index)} 
                        />
                        <button type="button" onClick={() => handleDeleteItem('companyBillingName', index)}>Delete</button>
                    </div>
                ))}
                <button type="button" onClick={() => handleAddItem('companyBillingName')}>Add Billing Name</button>
            </div>
        </>
    );
})()}






      <button className="change-password-button" onClick={handleSaveChanges}>
        Save Changes
      </button>
      <button className="change-password-button" onClick={handleEditToggle}>
        Cancel
      </button>
    </div>
  </>
)}
   <form className="change" onSubmit={handleForgotPassword}>
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

        

        <div className="form-group">
          <label htmlFor="email"></label>
          <input
            type="hidden"
            id="login-email2"
            name="email"
            className="login-input"
            value={profileData?.email || ""}
            required
            
          />
        </div>
        <button type="submit" className="login-button" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Password reset Link'}
        </button> </form>
        <div className="notification-settings">
          <h3>Manage Message Service</h3>
          <div className="notification-toggle">
            <label>Email Service</label>
            <input
              type="checkbox"
              checked={profileData?.msgService?.email || false}
              onChange={() => handleMsgServiceToggle('email')}
            />
          </div>
          <div className="notification-toggle">
            <label>WhatsApp Service</label>
            <input
              type="checkbox"
              checked={profileData?.msgService?.whatsapp || false}
              onChange={() => handleMsgServiceToggle('whatsapp')}
            />
          </div>
          {updateMessage && <span className="update-message">{updateMessage}</span>}
        </div><br/><br/><br/>
      </div>
      {/* Display error and success messages */}
      {errorMessage && (
        <ManageUserError errorMessage={errorMessage} onClose={() => setErrorMessage('')} />
      )}
      {successMessage && (
        <ManageUserSuccess successMessage={successMessage} onClose={() => setSuccessMessage('')} />
      )}
    </div>
  );
};

Profile.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Profile;
