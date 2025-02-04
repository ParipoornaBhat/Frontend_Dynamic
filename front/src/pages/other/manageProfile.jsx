import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../../css/manageuserprofile.css';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import defaultpic from '../../assets/default.png';

const ManageProfile = ({ ID ,isVisible, onClose }) => {
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // State to handle image preview
  const [manageUserProfileEditError, setManageUserProfileEditError] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
      const [successMessage, setSuccessMessage] = useState('');
      const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');
  const _id = ID;
  const fileInputRef = useRef(null);

  
  
// UseEffect to fetch the profile data when the component is visible and the token is available.
const fetchProfile = async () => {
  if (!isVisible || !token) return;

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/manage/viewAnyProfile/${_id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.status === 200 && response.data) {
      setProfileData(response.data);
    } else {
      console.log(response);
      setError('Failed to fetch profile details. Please try again later.');
    }
  } catch (error) {
    if (error.response) {
      // Handle various error responses
      if (error.response.status === 404) {
        setError('Profile not found. Please check the user ID.');
      } else if (error.response.status === 401) {
        setError('Unauthorized access. Please login again.');
      } else if (error.response.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(`Error: ${error.response.status}. ${error.response.data?.message || 'An unexpected error occurred.'}`);
      }
    } else if (error.request) {
      // Request was made but no response received
      setError('No response from the server. Please check your network connection.');
    } else {
      // Error in setting up request
      setError(`Error: ${error.message}`);
    }
  }
};

// UseEffect to fetch the profile data when the component is visible and the token is available
useEffect(() => {
  if (isVisible) {
    fetchProfile();
  }
}, [isVisible, token, _id]); // UseEffect will trigger when these dependencies change

// Handle edit toggle and refetch the profile when canceling the edit
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



const handleSaveChanges = async (userId) => {
  if (!profileData) return;

  try {
      const { fullName, role, email, phone, companyBillingName, address, msgService, profilePic } = profileData;
      const updates = {};

      // Include fullName if present
      if (fullName) {
          updates.fullName = {
              firstName: fullName.firstName,
              lastName: fullName.lastName
          };
      }

      // Include role if present
      if (role) {
          updates.role = role;
      }

      // Include email if present
      if (email) {
          updates.email = email;
      }

      // Include phone if present
      if (phone) {
          updates.phone = phone;
      }

      // Include companyBillingName if present
      if (companyBillingName) {
          updates.companyBillingName = companyBillingName;
      }

      // Include address if present
      if (address) {
          updates.address = {
              street: address.street,
              city: address.city,
              state: address.state,
              postalCode: address.postalCode,
              country: address.country,
          };
      }

      // Include msgService if present
      if (msgService) {
          updates.msgService = msgService;
      }

      const formData = new FormData();
      formData.append('_id', userId);  // Pass the userId here
      formData.append('updates', JSON.stringify(updates));

      // If profilePic is a file, append it to the formData
      if (profilePic instanceof File) {
          formData.append('profilePic', profilePic);
      }
      console.log(userId)
      const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/manage/anyProfileEdit`,
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
              fullName: updates.fullName || prev.fullName,
              role: updates.role || prev.role,
              email: updates.email || prev.email,
              phone: updates.phone || prev.phone,
              companyBillingName: updates.companyBillingName || prev.companyBillingName,
              address: updates.address || prev.address,
              msgService: updates.msgService || prev.msgService,
              profilePic: profilePic instanceof File ? URL.createObjectURL(profilePic) : prev.profilePic,
          }));
          handleEditToggle();
          setUpdateMessage('Profile updated successfully!');
      } else {
          setUpdateMessage('Failed to update profile.');
      }

      // Clear the update message after 2 seconds
      setTimeout(() => {
          setUpdateMessage('');
      }, 2000);
  } catch (error) {
      setUpdateMessage('Error saving profile. Please try again later.');
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

        setProfileData((prev) => ({
          ...prev,
          profilePic: file,  // Store the File object
      }));
    }
  };
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setUpdateMessage('');
  
    // Create a FormData object to collect form data
    const formData = new FormData(e.target); // e.target refers to the form element
    
    // Get the email from FormData
    const email = formData.get('email');  // Make sure the email field has name="email"
  
    if (!email) {
      setUpdateMessage('Email is required.');
      return;
    }
  
    setIsLoading(true); // Set loading state
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/forgotpassword`,
        { email }
      );
  
      setUpdateMessage('Password reset link has been sent to your email.');
    } catch (err) {
      // Handle error
      setUpdateMessage(`Error in sending email: ${err.message}`);
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
  
const handleMsgServiceToggle = async (type,userId) => {
  if (!profileData) return;

  // Ensure msgService is defined (use a default object if undefined)
  const updatedMsgService = {
    ...profileData.msgService,
    [type]: !profileData.msgService?.[type],  // Toggle the service value
  };

  const _id = userId;
  
  // Log the updated msgService to ensure it's correct
  console.log("Updated MsgService: ", updatedMsgService);

  setProfileData((prev) => ({ ...prev, msgService: updatedMsgService }));
  setLoading(true); // Start loading

  try {
    // Log the payload being sent to the backend
    console.log("Sending Payload: ", {
      _id,
      updates: { msgService: updatedMsgService }
    });

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/manage/anyProfileEdit`,
      {
        _id,
        updates: { msgService: updatedMsgService },
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Log the response from the API
    console.log("API Response: ", response);

    if (response.status === 200) {
      setUpdateMessage('Message service settings updated successfully!');
    } else {
      setUpdateMessage('Failed to update message service settings.');
    }
  } catch (error) {
    console.error("Error updating message service settings:", error);
    setUpdateMessage('Error updating message service settings.');
  } finally {
    setLoading(false); // Stop loading
    setTimeout(() => {
      setUpdateMessage('');
    }, 2000);
  }
};




  if (error) {
    return (
      <div className={`profile-container ${isVisible ? 'visible' : ''}`}>
        <button className="close-button" onClick={onClose}>X</button>
        <p>{error}</p>
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
      <p><strong>Phone:</strong> {profileData?.phone}</p>
      <p><strong>Email:</strong> {profileData?.email}</p>
      <p><strong>Role:</strong> {profileData?.role}</p>
      {profileData?.companyBillingName && (
        <p><strong>Company Billing Name:</strong> {profileData?.companyBillingName}</p>
      )}
      <p><strong>Address:</strong> {`${profileData?.address?.street}, ${profileData?.address?.city}, ${profileData?.address?.state}, ${profileData?.address?.postalCode}, ${profileData?.address?.country}`}</p>
    </div>
  </>
) : (
  <>
  <div className="profile-image-container" onClick={handleImageClick}>
    <img
      src={selectedImage || profileData?.profilePic || defaultpic}
      alt="Profile"
      className="profile-image"
    />
  </div>
  {isEditing && (
    <div className="profile-image-overlay-edit">
      <FontAwesomeIcon icon={faPen} className="profile-edit-icon" title="Edit Profile Picture" />
    </div>
  )}
  <input
    type="file"
    ref={fileInputRef}
    style={{ display: 'none' }}
    accept="image/*"
    onChange={handleImageChange}
  />
  <div className="profile-details-section">
    <div className="profile-name-row">
      <input
        type="text"
        value={profileData?.fullName?.firstName || ''}
        onChange={(e) => setProfileData({ ...profileData, fullName: { ...profileData.fullName, firstName: e.target.value } })}
        className="profile-name-input"
        placeholder="First Name"
      />
      <input
        type="text"
        value={profileData?.fullName?.lastName || ''}
        onChange={(e) => setProfileData({ ...profileData, fullName: { ...profileData.fullName, lastName: e.target.value } })}
        className="profile-name-input"
        placeholder="Last Name"
      />
    </div>
    <div className="profile-details-row">
      <div className="profile-detail-label">Phone:</div>
      <input
        type="text"
        value={profileData?.phone || ''}
        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
        className="profile-detail-input"
        placeholder="Phone"
      />
    </div>
    <div className="profile-details-row">
      <div className="profile-detail-label">Email:</div>
      <input
        type="email"
        value={profileData?.email || ''}
        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
        className="profile-detail-input"
        placeholder="Email"
      />
    </div>
    <div className="profile-details-row">
      
      <p><strong>Role:</strong> {profileData?.role}</p>

    </div>
    {profileData?.companyBillingName && (
      <div className="profile-details-row">
        <div className="profile-detail-label">Company Billing Name:</div>
        <input
          type="text"
          value={profileData?.companyBillingName || ''}
          onChange={(e) => setProfileData({ ...profileData, companyBillingName: e.target.value })}
          className="profile-detail-input"
          placeholder="Company Billing Name"
        />
      </div>
    )}
    <div className="profile-address-form">
      <div className="profile-address-row">
        <label className="profile-address-label">Street:</label>
        <input
          type="text"
          value={profileData?.address?.street || ''}
          onChange={(e) => setProfileData({ ...profileData, address: { ...profileData.address, street: e.target.value } })}
          className="profile-address-input"
          placeholder="Street"
        />
      </div>

      <div className="profile-address-row">
        <label className="profile-address-label">City:</label>
        <input
          type="text"
          value={profileData?.address?.city || ''}
          onChange={(e) => setProfileData({ ...profileData, address: { ...profileData.address, city: e.target.value } })}
          className="profile-address-input"
          placeholder="City"
        />
      </div>

      <div className="profile-address-row">
        <label className="profile-address-label">State:</label>
        <input
          type="text"
          value={profileData?.address?.state || ''}
          onChange={(e) => setProfileData({ ...profileData, address: { ...profileData.address, state: e.target.value } })}
          className="profile-address-input"
          placeholder="State"
        />
      </div>

      <div className="profile-address-row">
        <label className="profile-address-label">Postal Code:</label>
        <input
          type="text"
          value={profileData?.address?.postalCode || ''}
          onChange={(e) => setProfileData({ ...profileData, address: { ...profileData.address, postalCode: e.target.value } })}
          className="profile-address-input"
          placeholder="Postal Code"
        />
      </div>

      <div className="profile-address-row">
        <label className="profile-address-label">Country:</label>
        <input
          type="text"
          value={profileData?.address?.country || ''}
          onChange={(e) => setProfileData({ ...profileData, address: { ...profileData.address, country: e.target.value } })}
          className="profile-address-input"
          placeholder="Country"
        />
      </div>
    </div>

    <div className="profile-actions">
    <button 
  className="profile-save-button" 
  onClick={() => handleSaveChanges(profileData?._id)} // Wrap in an anonymous function
>
  Save Changes
</button>
      <button className="profile-cancel-button" onClick={handleEditToggle}>Cancel</button>
    </div>
  </div>
</>

)}     <form className="change" onSubmit={handleForgotPassword}>
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
    type="hidden"
    id="login-password"
    name="email"
    className="login-input"
    value={profileData?.email}
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
      onChange={() => handleMsgServiceToggle('email',profileData?._id)}
      disabled={loading} // Disable while loading
    />
  </div>
  <div className="notification-toggle">
    <label>WhatsApp Service</label>
    <input
      type="checkbox"
      checked={profileData?.msgService?.whatsapp || false}
      onChange={() => handleMsgServiceToggle('whatsapp',profileData?._id)}
      disabled={loading} // Disable while loading
    />
  </div>
  {updateMessage && <span className="update-message">{updateMessage}</span>}
</div>
       </div>
     </div>
   );
  
  }    

ManageProfile.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ManageProfile;
