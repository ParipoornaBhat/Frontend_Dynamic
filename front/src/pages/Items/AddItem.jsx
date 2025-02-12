import React, { useState } from 'react';
import axios from 'axios';
import './addItem.css';
import Highlight from 'react-highlight-words';
import styled from 'styled-components';
import ManageUserError from '../other/ErrorMessage'; // Import the ErrorMessage component

const BOPPListing = () => {
    const [activeTab, setActiveTab] = useState('BOPP');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
  const [BOPPformData, setBoppFormData] = useState({
    itemInfo: {
      itemId: '',
      itemType: '',
      itemImages: [],
      description: '',
      nameAndCommodity: '',
      millAddress: '',
      agentCustomerName: '',
      GMS: ''
    },
    printingInfo: {
      jobInfo: { checked: false },
      sizeMic: '',
      materialType: '',
      cylinder: '',
      location: '',
      numberOfColours: 0,
      colourNames: [],
      cylinderDirection: ''
    },
    lamination: {
      jobInfo: { checked: false },
      sizeMic: '',
      type: '',
      quantity: 0
    },
    inspection1: {
      jobInfo: { checked: false }
    },
    inspection2: {
      jobInfo: { checked: false }
    }
  });
  const [PETformData, setPetFormData] = useState({
    itemInfo: {
      itemId: '',
      itemType: '',
      itemImages: [],
      description: '',
      nameAndCommodity: '',
      millAddress: '',
      agentCustomerName: '',
      GMS: ''
    },
    printingInfo: {
      jobInfo: { checked: false },
      sizeMic: '',
      materialType: '',
      cylinder: '',
      location: '',
      numberOfColours: 0,
      colourNames: [],
      cylinderDirection: ''
    },
    lamination: {
      jobInfo: { checked: false },
      sizeMic: '',
      type: '',
      quantity: 0
    },
    inspection1: {
      jobInfo: { checked: false }
    },
    inspection2: {
      jobInfo: { checked: false }
    }
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');



  const token = localStorage.getItem('token');
  const currentUserId = localStorage.getItem('_id');
  const employeeRoles = JSON.parse(localStorage.getItem('employeeRoles')) || [];



  // Function to handle user search


const handleSearch = async (e) => {
  const query = e.target.value;
  setSearchQuery(query);
  
  if (query.length > 0) {
    try {
      const response = await axios.get(`/api/users?search=${query}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  } else {
    setUsers([]);
  }
};

// Handle user selection
const handleSelectUser = (user) => {
  setSelectedUser(user);
  setSearchQuery(user.name); // Optionally, display the selected user's name
  setUsers([]); // Clear the dropdown once a user is selected
};


  // Validation function
  const validateForm = () => {
    let errors = {};
    
    if (!formData.itemInfo.itemId) errors.itemId = 'Item ID is required';
    if (!formData.itemInfo.itemType) errors.itemType = 'Item Type is required';
    if (!formData.itemInfo.description) errors.description = 'Description is required';
    if (!formData.itemInfo.nameAndCommodity) errors.nameAndCommodity = 'Name and Commodity are required';
    if (!formData.itemInfo.millAddress) errors.millAddress = 'Mill Address is required';
    if (!formData.itemInfo.agentCustomerName) errors.agentCustomerName = 'Agent Customer Name is required';
    if (!formData.itemInfo.GMS) errors.GMS = 'GMS is required';

    // You can add more validations for the other fields

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form data
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Check if itemImages exceed size limit (assuming a 5MB limit)
    for (let i = 0; i < formData.itemInfo.itemImages.length; i++) {
      if (formData.itemInfo.itemImages[i].size > 5 * 1024 * 1024) {
        setErrors({ profilePic: 'Image must be less than 5MB.' });
        return;
      }
    }

    try {
      const formPayload = new FormData();
      formPayload.append('itemId', formData.itemInfo.itemId);
      formPayload.append('itemType', formData.itemInfo.itemType);
      formPayload.append('description', formData.itemInfo.description);
      formPayload.append('nameAndCommodity', formData.itemInfo.nameAndCommodity);
      formPayload.append('millAddress', formData.itemInfo.millAddress);
      formPayload.append('agentCustomerName', formData.itemInfo.agentCustomerName);
      formPayload.append('GMS', formData.itemInfo.GMS);

      // Add printing info fields if checked
      if (formData.printingInfo.jobInfo.checked) {
        formPayload.append('sizeMic', formData.printingInfo.sizeMic);
        formPayload.append('materialType', formData.printingInfo.materialType);
        formPayload.append('cylinder', formData.printingInfo.cylinder);
        formPayload.append('location', formData.printingInfo.location);
        formPayload.append('numberOfColours', formData.printingInfo.numberOfColours);
        formPayload.append('colourNames', formData.printingInfo.colourNames.join(','));
        formPayload.append('cylinderDirection', formData.printingInfo.cylinderDirection);
      }

      // Add lamination info fields if checked
      if (formData.lamination.jobInfo.checked) {
        formPayload.append('laminationSizeMic', formData.lamination.sizeMic);
        formPayload.append('laminationType', formData.lamination.type);
        formPayload.append('laminationQuantity', formData.lamination.quantity);
      }

      // Add files (if any)
      if (formData.itemInfo.itemImages && formData.itemInfo.itemImages.length > 0) {
        for (let image of formData.itemInfo.itemImages) {
          formPayload.append('itemImages', image);
        }
      }

      const endpoint = activeTab === 'Employee' ? '/emp/empRegister' : '/user/userRegister';
      const baseUrl = import.meta.env.VITE_BASE_URL;

      // Perform the API request and await the response
      const response = await axios.post(`${baseUrl}${endpoint}`, formPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Item registered successfully', response.data);

      if (response.status === 201) {
        setSuccessMessage('Registration successful!');
        setTimeout(() => {
          setSuccessMessage('');
          // Reset form or close modal (if applicable)
        }, 3000);
      }

    } catch (error) {
      if (error.response) {
        console.log('Error:', error.response.data.message);
        setErrors({ apiError: error.response.data.message });
      } else if (error.request) {
        console.error('Request error:', error.request);
        setErrors({ apiError: 'No response from the server' });
      } else {
        console.error('Error in setup:', error.message);
        setErrors({ apiError: error.message });
      }
    }
  };


  return (
    <div className='AddItem-formdiv'>


      
       <div className="AddItem-user-search">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search by ID, Name, or Phone"
        className="AddItem-search-input"
      />
      {users.length > 0 && (
        <div className="AddItem-dropdown">
          {users.map((user) => (
            <div
              key={user.id}
              className="AddItem-dropdown-item"
              onClick={() => handleSelectUser(user)}
            >
              <span>
                <Highlight
                  searchWords={[searchQuery]} 
                  textToHighlight={user.id} 
                  autoEscape={true} 
                  highlightClassName="AddItem-highlight"
                />
              </span> - 
              <span>
                <Highlight
                  searchWords={[searchQuery]} 
                  textToHighlight={user.name} 
                  autoEscape={true} 
                  highlightClassName="AddItem-highlight"
                />
              </span> - 
              <span>
                <Highlight
                  searchWords={[searchQuery]} 
                  textToHighlight={user.phoneNumber} 
                  autoEscape={true} 
                  highlightClassName="AddItem-highlight"
                />
              </span>
            </div>
          ))}
        </div>
      )}
      {selectedUser && (
        <div className="AddItem-selected-user">
          <p>Selected User: {selectedUser.name} (ID: {selectedUser.id})</p>
        </div>
      )}
    </div>
      <form onSubmit={handleSubmit} className="AddItem-form">
        
      <div className="AddItem-field">
          <label>Item Type</label>
              <select
              value={formData.itemInfo.itemType}
              onChange={(e) => setFormData({ ...formData, itemInfo: { ...formData.itemInfo, itemType: e.target.value } })}
                className="AddItem-input"
              >
               
              <option value="Old">BOPP</option>
              <option value="New">PET</option>
              </select>
      </div>
        {/* Other Item Info Fields (Description, Name, etc.) */}
        <div className="AddItem-field">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.itemInfo.description}
            onChange={(e) => setFormData({ ...formData, itemInfo: { ...formData.itemInfo, description: e.target.value } })}
            className="AddItem-input"
          />
          {errors.description && <p className="AddItem-error">{errors.description}</p>}
        </div>
  
        {/* Item Images Upload */}
        <div className="AddItem-field">
          <label>Item Images</label>
          <input
            type="file"
            multiple
            onChange={(e) => setFormData({ ...formData, itemInfo: { ...formData.itemInfo, itemImages: Array.from(e.target.files) } })}
            className="AddItem-input"
          />
          {errors.profilePic && <p className="AddItem-error">{errors.profilePic}</p>}
        </div>
  
        {/* Printing Info Checkbox and Fields */}
        <div className="AddItem-field">
          <label>
            <input
              type="checkbox"
              checked={formData.printingInfo.jobInfo.checked}
              onChange={(e) =>
                setFormData({ ...formData, printingInfo: { ...formData.printingInfo, jobInfo: { checked: e.target.checked } } })
              }
            />
            Printing Info
          </label>
        </div>
  
        {formData.printingInfo.jobInfo.checked && (
          <>
            <div className="AddItem-field">
              <label>Size Mic</label>
              <input
                type="text"
                name="sizeMic"
                value={formData.printingInfo.sizeMic}
                onChange={(e) => setFormData({ ...formData, printingInfo: { ...formData.printingInfo, sizeMic: e.target.value } })}
                className="AddItem-input"
              />
            </div>
            <div className="AddItem-field">
              <label>Material Type</label>
              <input
                type="text"
                name="materialType"
                value={formData.printingInfo.materialType}
                onChange={(e) => setFormData({ ...formData, printingInfo: { ...formData.printingInfo, materialType: e.target.value } })}
                className="AddItem-input"
              />
            </div>
            <div className="AddItem-field">
              <label>Cylinder</label>
              <select
                value={formData.printingInfo.cylinder}
                onChange={(e) => setFormData({ ...formData, printingInfo: { ...formData.printingInfo, cylinder: e.target.value } })}
                className="AddItem-input"
              >
                <option value="">Select</option>
                <option value="Old">Old</option>
                <option value="New">New</option>
              </select>
            </div>
            {/* Additional Printing Fields */}
            <div className="AddItem-field">
              <label>Number of Colours</label>
              <input
                type="number"
                name="numberOfColours"
                value={formData.printingInfo.numberOfColours}
                onChange={(e) => setFormData({ ...formData, printingInfo: { ...formData.printingInfo, numberOfColours: e.target.value } })}
                className="AddItem-input"
              />
            </div>
            <div className="AddItem-field">
              <label>Colour Names (comma separated)</label>
              <input
                type="text"
                name="colourNames"
                value={formData.printingInfo.colourNames.join(',')}
                onChange={(e) => setFormData({ ...formData, printingInfo: { ...formData.printingInfo, colourNames: e.target.value.split(',') } })}
                className="AddItem-input"
              />
            </div>
  
            <div className="AddItem-field">
              <label>Cylinder Direction</label>
              <input
                type="text"
                name="cylinderDirection"
                value={formData.printingInfo.cylinderDirection}
                onChange={(e) => setFormData({ ...formData, printingInfo: { ...formData.printingInfo, cylinderDirection: e.target.value } })}
                className="AddItem-input"
              />
            </div>
          </>
        )}
  
        {/* Lamination Info */}
        <div className="AddItem-field">
          <label>
            <input
              type="checkbox"
              checked={formData.lamination.jobInfo.checked}
              onChange={(e) =>
                setFormData({ ...formData, lamination: { ...formData.lamination, jobInfo: { checked: e.target.checked } } })
              }
            />
            Lamination Info
          </label>
        </div>
  
        {formData.lamination.jobInfo.checked && (
          <>
            <div className="AddItem-field">
              <label>Lamination Size Mic</label>
              <input
                type="text"
                value={formData.lamination.sizeMic}
                onChange={(e) => setFormData({ ...formData, lamination: { ...formData.lamination, sizeMic: e.target.value } })}
                className="AddItem-input"
              />
            </div>
  
            <div className="AddItem-field">
              <label>Lamination Type</label>
              <input
                type="text"
                value={formData.lamination.type}
                onChange={(e) => setFormData({ ...formData, lamination: { ...formData.lamination, type: e.target.value } })}
                className="AddItem-input"
              />
            </div>
  
            <div className="AddItem-field">
              <label>Lamination Quantity</label>
              <input
                type="number"
                value={formData.lamination.quantity}
                onChange={(e) => setFormData({ ...formData, lamination: { ...formData.lamination, quantity: e.target.value } })}
                className="AddItem-input"
              />
            </div>
          </>
        )}
  
        {/* Inspection Fields */}
        <div className="AddItem-field">
          <label>
            <input
              type="checkbox"
              checked={formData.inspection1.jobInfo.checked}
              onChange={(e) =>
                setFormData({ ...formData, inspection1: { ...formData.inspection1, jobInfo: { checked: e.target.checked } } })
              }
            />
            Inspection 1
          </label>
        </div>
  
        <div className="AddItem-field">
          <label>
            <input
              type="checkbox"
              checked={formData.inspection2.jobInfo.checked}
              onChange={(e) =>
                setFormData({ ...formData, inspection2: { ...formData.inspection2, jobInfo: { checked: e.target.checked } } })
              }
            />
            Inspection 2
          </label>
        </div>
  
        {/* Success Message */}
        {successMessage && <p className="AddItem-success">{successMessage}</p>}
  
        {/* Submit Button */}
        <button type="submit" className="AddItem-submit">Submit</button>
      </form>
    </div>
  );
  return (
    <div className='AddItem-formdiv'>



       <div className="AddItem-user-search">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search by ID, Name, or Phone"
        className="AddItem-search-input"
      />
      {users.length > 0 && (
        <div className="AddItem-dropdown">
          {users.map((user) => (
            <div
              key={user.id}
              className="AddItem-dropdown-item"
              onClick={() => handleSelectUser(user)}
            >
              <span>
                <Highlight
                  searchWords={[searchQuery]} 
                  textToHighlight={user.id} 
                  autoEscape={true} 
                  highlightClassName="AddItem-highlight"
                />
              </span> - 
              <span>
                <Highlight
                  searchWords={[searchQuery]} 
                  textToHighlight={user.name} 
                  autoEscape={true} 
                  highlightClassName="AddItem-highlight"
                />
              </span> - 
              <span>
                <Highlight
                  searchWords={[searchQuery]} 
                  textToHighlight={user.phoneNumber} 
                  autoEscape={true} 
                  highlightClassName="AddItem-highlight"
                />
              </span>
            </div>
          ))}
        </div>
      )}
      {selectedUser && (
        <div className="AddItem-selected-user">
          <p>Selected User: {selectedUser.name} (ID: {selectedUser.id})</p>
        </div>
      )}
    </div>
      <form onSubmit={handleSubmit} className="AddItem-form">
        
      <div className="AddItem-field">
          <label>Item Type</label>
              <select
              value={formData.itemInfo.itemType}
              onChange={(e) => setFormData({ ...formData, itemInfo: { ...formData.itemInfo, itemType: e.target.value } })}
                className="AddItem-input"
              >
               
              <option value="Old">BOPP</option>
              <option value="New">PET</option>
              </select>
      </div>
        {/* Other Item Info Fields (Description, Name, etc.) */}
        <div className="AddItem-field">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.itemInfo.description}
            onChange={(e) => setFormData({ ...formData, itemInfo: { ...formData.itemInfo, description: e.target.value } })}
            className="AddItem-input"
          />
          {errors.description && <p className="AddItem-error">{errors.description}</p>}
        </div>
  
        {/* Item Images Upload */}
        <div className="AddItem-field">
          <label>Item Images</label>
          <input
            type="file"
            multiple
            onChange={(e) => setFormData({ ...formData, itemInfo: { ...formData.itemInfo, itemImages: Array.from(e.target.files) } })}
            className="AddItem-input"
          />
          {errors.profilePic && <p className="AddItem-error">{errors.profilePic}</p>}
        </div>
  
        {/* Printing Info Checkbox and Fields */}
        <div className="AddItem-field">
          <label>
            <input
              type="checkbox"
              checked={formData.printingInfo.jobInfo.checked}
              onChange={(e) =>
                setFormData({ ...formData, printingInfo: { ...formData.printingInfo, jobInfo: { checked: e.target.checked } } })
              }
            />
            Printing Info
          </label>
        </div>
  
        {formData.printingInfo.jobInfo.checked && (
          <>
            <div className="AddItem-field">
              <label>Size Mic</label>
              <input
                type="text"
                name="sizeMic"
                value={formData.printingInfo.sizeMic}
                onChange={(e) => setFormData({ ...formData, printingInfo: { ...formData.printingInfo, sizeMic: e.target.value } })}
                className="AddItem-input"
              />
            </div>
            <div className="AddItem-field">
              <label>Material Type</label>
              <input
                type="text"
                name="materialType"
                value={formData.printingInfo.materialType}
                onChange={(e) => setFormData({ ...formData, printingInfo: { ...formData.printingInfo, materialType: e.target.value } })}
                className="AddItem-input"
              />
            </div>
            <div className="AddItem-field">
              <label>Cylinder</label>
              <select
                value={formData.printingInfo.cylinder}
                onChange={(e) => setFormData({ ...formData, printingInfo: { ...formData.printingInfo, cylinder: e.target.value } })}
                className="AddItem-input"
              >
                <option value="">Select</option>
                <option value="Old">Old</option>
                <option value="New">New</option>
              </select>
            </div>
            {/* Additional Printing Fields */}
            <div className="AddItem-field">
              <label>Number of Colours</label>
              <input
                type="number"
                name="numberOfColours"
                value={formData.printingInfo.numberOfColours}
                onChange={(e) => setFormData({ ...formData, printingInfo: { ...formData.printingInfo, numberOfColours: e.target.value } })}
                className="AddItem-input"
              />
            </div>
            <div className="AddItem-field">
              <label>Colour Names (comma separated)</label>
              <input
                type="text"
                name="colourNames"
                value={formData.printingInfo.colourNames.join(',')}
                onChange={(e) => setFormData({ ...formData, printingInfo: { ...formData.printingInfo, colourNames: e.target.value.split(',') } })}
                className="AddItem-input"
              />
            </div>
  
            <div className="AddItem-field">
              <label>Cylinder Direction</label>
              <input
                type="text"
                name="cylinderDirection"
                value={formData.printingInfo.cylinderDirection}
                onChange={(e) => setFormData({ ...formData, printingInfo: { ...formData.printingInfo, cylinderDirection: e.target.value } })}
                className="AddItem-input"
              />
            </div>
          </>
        )}
  
        {/* Lamination Info */}
        <div className="AddItem-field">
          <label>
            <input
              type="checkbox"
              checked={formData.lamination.jobInfo.checked}
              onChange={(e) =>
                setFormData({ ...formData, lamination: { ...formData.lamination, jobInfo: { checked: e.target.checked } } })
              }
            />
            Lamination Info
          </label>
        </div>
  
        {formData.lamination.jobInfo.checked && (
          <>
            <div className="AddItem-field">
              <label>Lamination Size Mic</label>
              <input
                type="text"
                value={formData.lamination.sizeMic}
                onChange={(e) => setFormData({ ...formData, lamination: { ...formData.lamination, sizeMic: e.target.value } })}
                className="AddItem-input"
              />
            </div>
  
            <div className="AddItem-field">
              <label>Lamination Type</label>
              <input
                type="text"
                value={formData.lamination.type}
                onChange={(e) => setFormData({ ...formData, lamination: { ...formData.lamination, type: e.target.value } })}
                className="AddItem-input"
              />
            </div>
  
            <div className="AddItem-field">
              <label>Lamination Quantity</label>
              <input
                type="number"
                value={formData.lamination.quantity}
                onChange={(e) => setFormData({ ...formData, lamination: { ...formData.lamination, quantity: e.target.value } })}
                className="AddItem-input"
              />
            </div>
          </>
        )}
  
        {/* Inspection Fields */}
        <div className="AddItem-field">
          <label>
            <input
              type="checkbox"
              checked={formData.inspection1.jobInfo.checked}
              onChange={(e) =>
                setFormData({ ...formData, inspection1: { ...formData.inspection1, jobInfo: { checked: e.target.checked } } })
              }
            />
            Inspection 1
          </label>
        </div>
  
        <div className="AddItem-field">
          <label>
            <input
              type="checkbox"
              checked={formData.inspection2.jobInfo.checked}
              onChange={(e) =>
                setFormData({ ...formData, inspection2: { ...formData.inspection2, jobInfo: { checked: e.target.checked } } })
              }
            />
            Inspection 2
          </label>
        </div>
  
        {/* Success Message */}
        {successMessage && <p className="AddItem-success">{successMessage}</p>}
  
        {/* Submit Button */}
        <button type="submit" className="AddItem-submit">Submit</button>
      </form>
    </div>
  );
  
};

export default BOPPListing;
