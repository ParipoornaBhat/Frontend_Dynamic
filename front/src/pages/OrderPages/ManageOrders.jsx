import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Highlighter from "react-highlight-words";
import ManageUserError from '../other/ErrorMessage'; // Import the ErrorMessage component
import ManageUserSuccess from '../other/SuccessMessage'; // Import the ErrorMessage component
import '../Items/addItem.css'
import OrderList from "./OrderList"
const ManageOrders = () => {

    const [activeTab, setActiveTab] = useState('BOPP');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // Track error message
    const [successMessage, setSuccessMessage] = useState(''); // Track error message
    const [showModal, setShowModal] = useState(false); // To toggle modal visibility
    const [editFormData, setEditFormData] = useState({}); // Data to edit in the modal
    const [showADDUSERModal, setADDUSERShowModal] = useState(false); // To toggle modal visibility
    const [orders, setOrders] = useState([]); // Stores the fetched orders
    const [searchOrderID, setSearchOrderID] = useState(""); // Search input
    const [selectedStatus, setSelectedStatus] = useState(""); // Order Status filter
    const [fromDate, setFromDate] = useState(""); // Start Date filter
    const [toDate, setToDate] = useState(""); // End Date filter
    
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
const printOrder = (order) => {
  const printableContent = `
    Order ID: ${order.OrderID}\n
    Order Type: ${order.OrderType}\n
    Order Status: ${order.OrderStatus}\n
    Created At: ${new Date(order.createdAt).toLocaleString()}\n
    Printing Output: ${order.OrderDetails.printing.output} Units\n
    Qty Pack Size: ${order.OrderDetails.printing.qtyPackSize}\n
    Number of Rolls: ${order.OrderDetails.printing.numberOfRolles}\n
    Lamination Quantity: ${order.OrderDetails.lamination.quantity}\n
  `;
  const newWindow = window.open("", "_blank");
  newWindow.document.write(`<pre>${printableContent}</pre>`);
  newWindow.print();
  newWindow.close();
};

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    await axios.put(`${import.meta.env.VITE_BASE_URL}/manage/updateOrderStatus`, {
      orderId,
      newStatus,
    });
    setSuccessMessage("Order status updated successfully!");
  } catch (error) {
    setErrorMessage("Failed to update order status:", error);
  }
};
const openModal = (item) => {
  setSelectedItem(item);
  setOrderModalOpen(!isOrderModalOpen);
};

const closeModal = () => {
  setOrderModalOpen(!isOrderModalOpen);
  setSelectedItem(null);
};
  // Function to go to the previous image


      const handleEditClick = () => {
        setShowModal(true); // Show the modal
      };
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
// 🔹 State Variables

// 🔹 Fetch orders whenever dependencies change
useEffect(() => {
  fetchOrders();
}, [currentPage, searchOrderID, sortOption, selectedStatus, fromDate, toDate, isEmployee]);

//

const fetchOrders = async () => {
  setIsLoading(true);
  setErrorMessage("");

  const queryParams = new URLSearchParams({
    search: searchOrderID,
    sort: sortOption,
    page: currentPage,
    limit: 10,
  });

  if (selectedStatus) queryParams.append("status", selectedStatus);
  if (fromDate) queryParams.append("fromDate", fromDate);
  if (toDate) queryParams.append("toDate", toDate);

  const url = isEmployee
    ? `${import.meta.env.VITE_BASE_URL}/manage/AllOrdersview/emp?${queryParams.toString()}`
    : `${import.meta.env.VITE_BASE_URL}/manage/UserOrders/user?${queryParams.toString()}`;

  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setOrders(response.data.orders);
    setTotalPages(response.data.totalPages);
    setCurrentPage(response.data.currentPage);
    console.log(response.data.orders)
  } catch (error) {
    setErrorMessage("Failed to load orders.");
    console.error("Error fetching orders:", error);
  } finally {
    setIsLoading(false);
  }
};


 
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
  {/* Search by Order ID */}
  <input
    type="text"
    placeholder="Search by Order ID"
    value={searchOrderID}
    onChange={(e) => setSearchOrderID(e.target.value)}
    style={{
      width: "60%",
      padding: "8px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    }}
  />

  {/* Order Status Filter */}
  <select
    onChange={(e) => setSelectedStatus(e.target.value)}
    value={selectedStatus}
    style={{
      flex: "1",
      minWidth: "120px",
      padding: "8px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    }}
  >
    <option value="">All Statuses</option>
    <option value="Under Review">Under Review</option>
    <option value="Confirmed">Confirmed</option>
    <option value="Printing">Printing</option>
    <option value="Dispatch in Two Days">Dispatch in Two Days</option>
    <option value="Completed">Completed</option>
  </select>

  {/* Date Range Filters */}
  <input
    type="date"
    value={fromDate}
    onChange={(e) => setFromDate(e.target.value)}
    style={{
      padding: "8px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    }}
  />
  <input
    type="date"
    value={toDate}
    onChange={(e) => setToDate(e.target.value)}
    style={{
      padding: "8px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    }}
  />

  {/* Sorting Dropdown */}
  <select
    onChange={(e) => setSortOption(e.target.value)}
    value={sortOption}
    style={{
      flex: "1",
      minWidth: "120px",
      padding: "8px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    }}
  >
    <option value="newest">Newest</option>
    <option value="oldest">Oldest</option>
  </select>
</div>


<OrderList orders={orders} isEmployee={isEmployee} updateOrderStatus={updateOrderStatus} printOrder={printOrder} setOrders={setOrders}/>




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




export default ManageOrders;


