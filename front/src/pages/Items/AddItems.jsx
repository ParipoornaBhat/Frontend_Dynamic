import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Highlighter from "react-highlight-words";
import OrderModal from './OrderModal'
import ManageUserError from '../other/ErrorMessage'; // Import the ErrorMessage component
import ManageUserSuccess from '../other/SuccessMessage'; // Import the ErrorMessage component
import SettingModal from './SettingModal';
import './addItem.css'
import AddItemModal from './AdditemsModal';

const AddItems = () => {

    const [activeTab, setActiveTab] = useState('BOPP');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // Track error message
    const [successMessage, setSuccessMessage] = useState(''); // Track error message
    const [showModal, setShowModal] = useState(false); // To toggle modal visibility
    const [editFormData, setEditFormData] = useState({}); // Data to edit in the modal
    const [showADDUSERModal, setADDUSERShowModal] = useState(false); // To toggle modal visibility

  // Fetch form options from an API or data source
    const token = localStorage.getItem('token');
    const currentUserId = localStorage.getItem('_id');
    const employeeRoles = JSON.parse(localStorage.getItem('employeeRoles')) || [];
    const userRoles = JSON.parse(localStorage.getItem('userRoles')) || [];
    const getRoles = () => (activeTab === 'Employee' ? employeeRoles : userRoles);

//Searching users 
// const [searchItemQuery, setSearchQuery] = useState(''); // Search input state
// Searching users
// State for filters
const [selectedBrand, setSelectedBrand] = useState(''); // Filter by Brand
const [selectedType, setSelectedType] = useState(''); // Filter by Type (BOPP/PET)
const [sortOption, setSortOption] = useState('name-asc'); // Only A-Z, Z-A sorting

const [searchItemQuery, setSearchQuery] = useState(''); // Search input state
const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
const [totalPages, setTotalPages] = useState(1); // Total pages from API
const [items, setItems] = useState([]); // Store fetched items
const [isOrderModalOpen, setOrderModalOpen] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);

const openModal = (item) => {
  setSelectedItem(item);
  setOrderModalOpen(!isOrderModalOpen);
};

const closeModal = () => {
  setOrderModalOpen(!isOrderModalOpen);
  setSelectedItem(null);
};
  // Function to go to the previous image


    
      const handleADDUSEREditClick = () => {
        setADDUSERShowModal(true); // Show the modal
      };
      const handleADDUSERCloseModal = () => {
        setADDUSERShowModal(false);
      };
      // Close the modal
      const handleCloseModal = () => {
        setShowModal(false);
      };
      const handlePrevious = () => {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      };
      
      const handleNext = () => {
        if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
        }
      };
      const [imageIndexes, setImageIndexes] = useState({});

      const handleImageChange = (index, direction, imagesLength) => {
        setImageIndexes((prevIndexes) => {
          const prevIndex = prevIndexes[index] || 0;
    
          const newIndex =
            direction === "prev"
              ? prevIndex === 0
                ? imagesLength - 1
                : prevIndex - 1
              : prevIndex === imagesLength - 1
              ? 0
              : prevIndex + 1;
    
          return { ...prevIndexes, [index]: newIndex };
        });
      };
      

     // Get employee roles from localStorage
const userRole = localStorage.getItem('role'); // Get user role

// Check if userRole exists in the employeeRoles array
const isEmployee = employeeRoles.some(role => role.roleName.toLowerCase() === userRole?.toLowerCase());




//

const fetchItems = async () => {
  setIsLoading(true);
  setErrorMessage('');
const queryParams = new URLSearchParams({
    search: searchItemQuery,
    sort: sortOption,
    page: currentPage,
    limit: 10,
  });

  if (selectedBrand) queryParams.append('brand', selectedBrand);
  if (selectedType) queryParams.append('type', selectedType);

  const url = isEmployee
    ? `${import.meta.env.VITE_BASE_URL}/manage/AllItemsview/emp?${queryParams.toString()}`
    : `${import.meta.env.VITE_BASE_URL}/manage/UserItems/user?${queryParams.toString()}`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setItems(response.data.items);
    setTotalPages(response.data.totalPages);
    setCurrentPage(response.data.currentPage);
  } catch (error) {
    setErrorMessage('Failed to load items.');
    console.error('Error fetching items:', error);
  } finally {
    setIsLoading(false);
  }
};

      // Fetch items whenever dependencies change
      useEffect(() => {
        fetchItems();
      }, [currentPage, searchItemQuery, sortOption, selectedBrand, selectedType]);
      
    /*
      const RemarkCheck = ({ section, label }) => (
        <div className="ItemForm-Job-remarkcheck">
          <div className="ItemForm-Job-remark-checkbox">
            <input 
              className="ItemForm-Job-remark-inputcheck" 
              type="checkbox" 
              name={`${section}remarkcheck`} 
              checked={BOPP[section].jobInfo.remarksChecked}
              onChange={(e) => handleInputChange(section, 'jobInfo', e.target.checked, 'remarksChecked')} 
            />
            <label className="ItemForm-Job-remark-label">{label}</label>
          </div>
      
          {BOPP[section].jobInfo.remarksChecked && (
            <div className="ItemForm-Job-textbox">
              <textarea
                name={`${section}Remarks`}
                value={BOPP[section].jobInfo.Remarks}
                onChange={(e) => handleInputChange(section, 'jobInfo', e.target.value, 'Remarks')} 
                className="ItemForm-Job-remark-textarea"
              />
            </div>
          )}
        </div>
      );
      // Reusable Input Component
const CustomInput = ({ section, field, label, type = "text" }) => (
  <div className="ItemForm-Job-input">
    <label className="ItemForm-form-label">{label} :</label>
    <input
      type={type}
      name={field}
      value={BOPP[section][field]}
      onChange={(e) => handleInputChange(section, field, e.target.value)}
      className="ItemForm-form-input"
    />
  </div>
);
const RemarkCheck2 = ({ section, label, isItemInfo }) => (
  <div className="ItemForm-Job-remarkcheck">
    <div className="ItemForm-Job-remark-checkbox">
      <input 
        className="ItemForm-Job-remark-inputcheck" 
        type="checkbox" 
        name={`${section}remarkcheck`} 
        checked={isItemInfo ? BOPP.itemInfo.descriptionCheck : BOPP[section].jobInfo.remarksChecked}
        onChange={(e) => 
          isItemInfo 
            ? handleInputChange('itemInfo', 'descriptionCheck', e.target.checked)
            : handleInputChange(section, 'jobInfo', e.target.checked, 'remarksChecked')
        } 
      />
      <label className="ItemForm-Job-remark-label">{label}</label>
    </div>

    {(isItemInfo ? BOPP.itemInfo.descriptionCheck : BOPP[section].jobInfo.remarksChecked) && (
      <div className="ItemForm-Job-textbox">
        <textarea
          name={isItemInfo ? 'description' : `${section}Remarks`}
          value={isItemInfo ? BOPP.itemInfo.description : BOPP[section].jobInfo.Remarks}
          onChange={(e) =>
            isItemInfo
              ? handleInputChange('itemInfo', 'description', e.target.value)
              : handleInputChange(section, 'jobInfo', e.target.value, 'Remarks')
          } 
          className="ItemForm-Job-remark-textarea"
        />
      </div>
    )}
  </div>
);


// Reusable Select Component
const CustomSelect = ({ section, field, label, options }) => (
  <div className="ItemForm-Job-select">
    <label className="ItemForm-form-label">{label} :</label>
    <select
      value={BOPP[section][field]}
      onChange={(e) => handleInputChange(section, field, e.target.value)}
      className="ItemForm-form-select"
    >
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);
*/

  return (<>
       
       <div className="manageusers-container" style={{ marginBottom: "40px" }}>
       {/* Other components and JSX */} 
      {/* Display error message if there's an error */}
  {errorMessage && (
    <ManageUserError errorMessage={errorMessage} onClose={() => setErrorMessage("")} />
  )}
  {successMessage && (
    <ManageUserSuccess successMessage={successMessage} onClose={() => setSuccessMessage("")} />
  )}
      {/* Rest of your JSX */}
      <div className="manageusers-tabs">

        <button
          onClick={() => setActiveTab('BOPP')}
          className={activeTab === 'BOPP' ? 'manageuser-active-tab' : 'manageuser-inactive-tab'}
        >
          BOPP
        </button>
        <button
          onClick={() => setActiveTab('PET')}
          className={activeTab === 'PET' ? 'manageuser-active-tab' : 'manageuser-inactive-tab'}
        >
          PET
        </button>
     

{isEmployee && (
  <StyledWrapper>
    <button 
      type="button" 
      className="manageuser-1-button" 
      onClick={handleADDUSEREditClick}
    >
      <span className="manageuser-1-button__text">
        Add {activeTab} Item {/* Display Add User or Add Employee based on activeTab */}
      </span>
      <span className="manageuser-1-button__icon">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width={24} 
          viewBox="0 0 24 24" 
          strokeWidth={2} 
          strokeLinejoin="round" 
          strokeLinecap="round" 
          stroke="currentColor" 
          height={24} 
          fill="none" 
          className="manageuser-1-svg"
        >
          <line y2={19} y1={5} x2={12} x1={12} />
          <line y2={12} y1={12} x2={19} x1={5} />
        </svg>
      </span>
    </button>
  </StyledWrapper>
)}


        </div>
        {showADDUSERModal && (
          <AddItemModal
          activeTab={activeTab}
            onClose={handleADDUSERCloseModal} // Close modal
            onSave={() => {
              console.log("Saved Item");  // Log to check if it's triggered
             // Set success message
            }} 
          />
        )}
         {/* Settings Button */}
          {/* Modal */}
          {showModal && (
          <SettingModal
            editFormData={editFormData}
            onClose={handleCloseModal} // Close modal
            onSave={() => {
              setIsOptionsFetched(false);
              console.log("onSave is called");  // Log to check if it's triggered
             // Set success message
            }} 
          />
        )}



        
<div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
  }}
>
  <input
    type="text"
    placeholder="Search by Name or Phone"
    value={searchItemQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    style={{
      
      width:"60%",
      padding: "8px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    }}
  />

  {/* Brand Filter */}
  <select
    onChange={(e) => setSelectedBrand(e.target.value)}
    value={selectedBrand}
    style={{
      flex: "1",
      minWidth: "100px",
      padding: "8px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    }}
  >
    <option value="">All Brands</option>
    <option value="BrandA">Brand A</option>
    <option value="BrandB">Brand B</option>
  </select>

  {/* Type Filter */}
  <select
    onChange={(e) => setSelectedType(e.target.value)}
    value={selectedType}
    style={{
      flex: "1",
      minWidth: "100px",
      padding: "8px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    }}
  >
    <option value="">All Types</option>
    <option value="BOPP">BOPP</option>
    <option value="PET">PET</option>
  </select>

  {/* Sorting Dropdown */}
  <select
    onChange={(e) => setSortOption(e.target.value)}
    value={sortOption}
    style={{
      flex: "1",
      minWidth: "100px",
      padding: "8px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    }}
  >
    <option value="name-asc">Name (A-Z)</option>
    <option value="name-desc">Name (Z-A)</option>
    
  </select>
</div>

{isLoading ? (
  <div className="manageusers-loading">Loading items...</div>
) : items.length > 0 ?(
  <div className="ItemLists-container">
  <div className="ItemLists">
    {items.map((item, index) => {
      const images = item?.itemInfo?.itemImages || [];
      const currentIndex = 0;

      return (
        <div key={index} className="ItemLists-card" onClick={() => openModal(item)}>
          <div className="ItemLists-imageContainer">
            {images.length > 0 ? (
              <img src={images[currentIndex]} alt="Item" className="ItemLists-image" />
            ) : (
              <div className="ItemLists-noImage">No Image</div>
            )}{/* Banner for Printing & Lamination Details */}
            <div className="ItemLists-banner">
              <span>
                {item?.printing?.cylinderDirection || "N/A"} |{" "}
                {item?.lamination?.type || "N/A"}
              </span>
            </div>
          </div>

          <div className="ItemLists-details">
            <h3 className="ItemLists-itemName">
              <Highlighter
                highlightClassName="ItemLists-highlight"
                searchWords={[searchItemQuery]}
                autoEscape={true}
                textToHighlight={item?.itemInfo?.ItemName || "No Name"}
              />
            </h3>
            <p className="ItemLists-id">
              <strong>ID:</strong>{" "}
              <Highlighter
                highlightClassName="ItemLists-highlight"
                searchWords={[searchItemQuery]}
                autoEscape={true}
                textToHighlight={item?.itemInfo?.itemId || "N/A"}
              />
            </p>
            <p className="ItemLists-type"><strong>Type:</strong> {item?.itemInfo?.itemType || "N/A"}</p>
            <p className="ItemLists-brand"><strong>Brand:</strong> {item?.itemInfo?.nameAndCommodity || "N/A"}</p>
            <p className="ItemLists-itemName"><strong>GMS:</strong> {item?.itemInfo?.GMS || "N/A"}</p>
            <p className="ItemLists-date"><strong>Created At:</strong> {new Date(item?.createdAt).toLocaleString()}</p>
          </div>
        </div>
      );
    })}
  </div>

  {/* Order Modal */}
  {isOrderModalOpen &&(   <OrderModal item={selectedItem} isOpen={isOrderModalOpen} onClose={closeModal} />
)}
</div>

  )
: (
  <div>No items found.</div>
)}
     



        <div 
      className="manageuser-pagination-container" 
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
    >
      <button
        onClick={handlePrevious}
        disabled={isLoading || currentPage === 1}
        className="manageuser-pagination-button"
        style={{
          padding: '5px 10px',
          cursor: isLoading || currentPage === 1 ? 'not-allowed' : 'pointer',
          backgroundColor: isLoading || currentPage === 1 ? '#ddd' : '#4CAF50',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        Previous
      </button>

      <span 
        className="manageuser-pagination-info" 
        style={{ fontSize: '16px', fontWeight: '500' }}
      >
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={isLoading || currentPage === totalPages}
        className="manageuser-pagination-button"
        style={{
          padding: '5px 10px',
          cursor: isLoading || currentPage === totalPages ? 'not-allowed' : 'pointer',
          backgroundColor: isLoading || currentPage === totalPages ? '#ddd' : '#4CAF50',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        Next
      </button>
    </div>

    <br/><br/><br/>
        </div>
  </>)
}
const StyledWrapper = styled.div`

  .manageuser-1-button {
    position: relative;
    width: 70px; /* Reduced width */
    height: 38px; /* Updated height */
    cursor: pointer;
    display: flex;
    border-radius: 5px;
    align-items: center;
    border: 3px solid rgb(0, 0, 0);
    background-color:rgba(26, 177, 169, 0.79);
  }

  .manageuser-1-button, .manageuser-1-button__icon, .manageuser-1-button__text {
    transition: all 0.3s;
  }

  .manageuser-1-button .manageuser-1-button__text {
    color: #fff;
    font-weight: 600;
    font-size: 8px;
  }

  .manageuser-1-button .manageuser-1-button__icon {
    position: absolute;
    transform: translateX(42px); /* Adjusted to reduce space */
    height: 100%;
    width: 20px; /* Reduced width */
    background-color: rgb(8, 156, 149);
    display: flex;
    border-radius: 0 5px 5px 0;
    align-items: center;
    border: 3px solid rgb(0, 0, 0); /* Default border */
    border-left: none; /* Removes the left border */

    justify-content: center;
  }

  .manageuser-1-button .manageuser-1-svg {
    width: 18px; /* Reduced icon size */
    stroke: #fff;
  }

  .manageuser-1-button:hover {
    background:rgb(8, 156, 149);
  }

  .manageuser-1-button:hover .manageuser-1-button__text {
    color: transparent;
  }

  .manageuser-1-button:hover .manageuser-1-button__icon {
    width: 70px; /* Reduced width on hover */
    transform: translateX(-18px);
  }

  .manageuser-1-button:active .manageuser-1-button__icon {
    background-color: #2e8644;
  }

  .manageuser-1-button:active {
    border: 1px solid #2e8644;
  }
`;




export default AddItems;


