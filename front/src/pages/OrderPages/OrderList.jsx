import React, { useState, useEffect, useRef } from 'react';
import Highlighter from "react-highlight-words";
import ManageUserError from '../other/ErrorMessage'; // Import the ErrorMessage component
import ManageUserSuccess from '../other/SuccessMessage'; // Import the ErrorMessage component
import axios from 'axios';

const OrderList = ({ orders, isEmployee, updateOrderStatus, printOrder,setOrders }) => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderStatusMap, setOrderStatusMap] = useState({});
  const [statusChanged, setStatusChanged] = useState({});
  const [imageIndex, setImageIndex] = useState({}); // Tracks the current image index for each order
  const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // Track error message
    const [successMessage, setSuccessMessage] = useState(''); // Track error message
    const token = localStorage.getItem('token');

    const handleSaveStatus = async (orderId) => {
      if (!orderStatusMap[orderId]) {
        setErrorMessage("No change in status");
        return; // No status change, do nothing
      }
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
  
      try {
          const baseUrl = import.meta.env.VITE_BASE_URL;
          const endpoint = `/emp/updatestatus/${orderId}`;
  
          const response = await axios.post(`${baseUrl}${endpoint}`, 
              { newStatus: orderStatusMap[orderId] },
              {
                  headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                  },
              }
          );
  
          if (response.status === 200) {
              setSuccessMessage(`✅ Status updated successfully!`);
              setOrders(prevOrders =>
                  prevOrders.map(order =>
                      order._id === orderId ? { ...order, OrderStatus: orderStatusMap[orderId] } : order
                  )
              );
              setOrderStatusMap(prev => ({ ...prev, [orderId]: undefined })); // Reset local state
          } else {
              throw new Error("Unexpected server response.");
          }
      } catch (error) {
          console.error("❌ API Error:", error);
          let errorMsg = "❌ An unknown error occurred.";
  
          if (error.response) {
              switch (error.response.status) {
                  case 400:
                      errorMsg = "⚠️ Bad Request: " + (error.response.data.message || "Check your input.");
                      break;
                  case 401:
                      errorMsg = "🔒 Unauthorized: Please log in again.";
                      break;
                  case 403:
                      errorMsg = "🚫 Forbidden: You don't have permission.";
                      break;
                  case 404:
                      errorMsg = "🔍 Order Not Found.";
                      break;
                  case 500:
                      errorMsg = "🛑 Server Error: Try again later.";
                      break;
                  default:
                      errorMsg = "❌ API Error: " + (error.response.data.message || "Something went wrong.");
              }
          } else if (error.request) {
              errorMsg = "📡 Network Error: Please check your connection.";
          } else {
              errorMsg = "⚠️ Request Failed: " + error.message;
          }
  
          setErrorMessage(errorMsg);
      } finally {
          setLoading(false);
      }
  };
    const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleNextImage = (orderId, images) => {
    setImageIndex((prev) => ({
      ...prev,
      [orderId]: (prev[orderId] + 1) % images.length,
    }));
  };

  const handlePrevImage = (orderId, images) => {
    setImageIndex((prev) => ({
      ...prev,
      [orderId]: (prev[orderId] - 1 + images.length) % images.length,
    }));
  };
  const handleStatusChange = (orderId, newStatus) => {
    setOrderStatusMap(prev => ({
        ...prev,
        [orderId]: newStatus
    }));
  };



  


 
 
  

  const statusOptions = [
    "Under Review",
    "Order Confirmed",
    "Printing",
    "Ready to Dispatch",
    "Dispatched",
    "Completed",
  ];

  return (<>  
    
   <style>{`
    .OrderLists-container {
      padding: 20px;
    }

    .OrderLists-list {
      display: flex;
      flex-direction: column;
      
      gap: 10px;
    }

    .OrderLists-card {
      background: #fff;
      border-radius: 8px;
      border: 1px solid #ddd;
      box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: all 0.3s ease-in-out;
    }

    /* Row-wise arrangement */
    .OrderLists-main {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
    }

    /* Image Section */
    .OrderLists-image-container {
      position: relative;
      width: 175px;
      height: 225px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .OrderLists-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 5px;
    }

    .OrderLists-image-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0, 0, 0, 0.5);
      color: white;
      border: none;
      padding: 3px 6px;
      cursor: pointer;
      font-size: 12px;
    }

    .OrderLists-image-btn.left {
      left: 0;
    }

    .OrderLists-image-btn.right {
      right: 0;
    }

    /* Details Section */
    .OrderLists-details {
      flex-grow: 1;
      padding: 10px;
    }

    .OrderLists-id {
      font-size: 14px;
      font-weight: bold;
    }

    .OrderLists-details p {
      font-size: 16px;
      font-weight:bold;
      margin: 2px 0;
    }

    .OrderLists-expand-btn {
      background: none;
      border: none;
      color: #007BFF;
      cursor: pointer;
      font-size: 12px;
      margin-top: 5px;
    }

/* 🔹 Extra Details - Hidden by Default */
.OrderLists-extra-details {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transform: translateY(-10px);
  transition: max-height 0.4s ease-in-out, opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

/* 🔹 When Expanded, Show Below the Card */
.OrderLists-extra-details.show {
  max-height: 300px; /* Adjust based on content */
  opacity: 1;
  transform: translateY(0);
  padding: 15px;
  border-top: 2px solid #ccc;
  background: #f8f9fa;
  border-radius: 0 0 10px 10px; /* Rounded bottom */
  box-shadow: inset 0px -5px 10px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
}


    /* Status Section */
    .OrderLists-status {
      text-align: right;
      min-width: 120px;
    }

    .OrderLists-status select {
      padding: 3px;
      font-size: 12px;
      border-radius: 5px;
    }

    .OrderLists-save-btn, .OrderLists-print-btn {
      background-color: #28a745;
      color: white;
      border: none;
      padding: 5px 8px;
      cursor: pointer;
      border-radius: 5px;
      font-size: 12px;
      margin-left: 5px;
    }

    .OrderLists-print-btn {
      background-color: #4CAF50;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .OrderLists-main {
        flex-direction: column;
        align-items: center;
      }
      .OrderLists-status {
        text-align: left;
        margin-top: 10px;
      }
      .OrderLists-image-container {
      position: relative;
      width: 275px;
      height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
       .OrderLists-details p {
      font-size: 18px;
      font-weight:bold;
      margin: 2px 0;
    }
    }

    /* Status Timeline */
    .OrderLists-status-timeline {
      display: flex;
      gap: 5px;
      align-items: center;
      margin-top: 5px;
    }

    .OrderLists-status-step {
      padding: 5px 10px;
      border-radius: 5px;
      background: #ccc;
      font-size: 14px;
    }

    .OrderLists-status-step.active {
      background: #28a745;
      color: white;
    }

    .OrderLists-status-arrow {
      font-weight: bold;
      color: #666;
    }
     /* Default Save Button */
.OrderLists-save-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

/* Hover Effect */
.OrderLists-save-btn:hover {
  background-color: #218838;
}

/* Disabled Save Button (Applied Initially) */
.OrderLists-save-btn.disabled {
  background-color: rgb(132, 133, 133) !important;
  color: white !important;
  cursor: not-allowed !important;
  opacity: 0.6;
  transform: none !important;
}

/* Enabled State */
.OrderLists-save-btn.enabled {
  background-color: #28a745;
  cursor: pointer;
}
  /* 🔹 Container Styles */
.OrderLists-container {
  width: 100%;
  max-width: 900px;
  margin: auto;
}

/* 🔹 Order Card */
.OrderLists-card {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out;
}

.OrderLists-card.expanded {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* 🔹 Button for Expanding */
.OrderLists-expand-btn {
  margin-top: 10px;
  padding: 5px 10px;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.OrderLists-expand-btn:hover {
  background: #0056b3;
}

/* 🔹 Extra Details - Initially Hidden */
.OrderLists-extra-details {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.4s ease-in-out, opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  background: #f8f9fa;
  padding: 0;
  margin-top: 0;
  border-radius: 0 0 8px 8px;
  border-top: 2px solid #ccc;
}

/* 🔹 Show Expanded Details */
.OrderLists-extra-details.show {
  max-height: 300px; /* Adjust as needed */
  opacity: 1;
  padding: 15px;
  margin-top: 5px;
  transform: translateY(0);
}
/* 🔹 Order Card */
.OrderLists-card {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 0; /* Remove extra bottom margin */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out;
}

/* 🔹 Extra Details - Initially Hidden */
.OrderLists-extra-details {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.4s ease-in-out, opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  background: #f8f9fa;
  padding: 0; /* Ensure no extra padding initially */
  margin: 0; /* Remove any default margin */
  border-radius: 0 0 8px 8px;
  border-top: 1px solid #ccc;
}

/* 🔹 Show Expanded Details */
.OrderLists-extra-details.show {
  max-height: 300px; /* Adjust as needed */
  opacity: 1;
  padding: 15px; /* Add padding only when expanded */
  transform: translateY(-10px);
  z-index:-1;
}

/* 🔹 Ensure Order Item Structure is Tight */
.OrderLists-item {
  margin-bottom: 10px; /* Adjust spacing between orders */
  padding-bottom: 0;
}



    `}
  </style>
  {errorMessage && (
    <ManageUserError errorMessage={errorMessage} onClose={() => setErrorMessage("")} />
  )}
  {successMessage && (
    <ManageUserSuccess successMessage={successMessage} onClose={() => setSuccessMessage("")} />
  )}
  <div className="OrderLists-container">
  {orders.length > 0 ? (
    <div className="OrderLists-list">
      {orders.map((order) => {
        const images = order.item_Id.itemInfo.itemImages;
        const currentIndex = imageIndex[order._id] || 0;
        const isExpanded = expandedOrder === order._id;

        return (
          <div key={order._id} className="OrderLists-item">
            {/* 🔹 Main Order Card */}
            <div className={`OrderLists-card ${isExpanded ? "expanded" : ""}`}>
              <div className="OrderLists-main">
                
                {/* 🔹 Image Section */}
                <div className="OrderLists-image-c">
                  <div className="OrderLists-image-container">
                    {images.length > 1 && (
                      <button className="OrderLists-image-btn left" onClick={() => handlePrevImage(order._id, images)}>❮</button>
                    )}
                    <img src={images[currentIndex]} alt="Order Item" className="OrderLists-image" />
                    {images.length > 1 && (
                      <button className="OrderLists-image-btn right" onClick={() => handleNextImage(order._id, images)}>❯</button>
                    )}
                  </div>
                </div>

                {/* 🔹 Order Summary */}
                <div className="OrderLists-details">
                  <h3 className="OrderLists-id">Order ID: {order.OrderID}</h3>
                  <p><strong>Type:</strong> {order.OrderType}</p>
                  <p><strong>Created:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                  <p><strong>Item:</strong> {order.item_Id.itemInfo.ItemName}</p>
                  <p><strong>Mill:</strong> {order.item_Id.itemInfo.millAddress}</p>
                  <p><strong>Customer:</strong> {order.item_Id.itemInfo.agentCustomerName}</p>
                  <button className="OrderLists-expand-btn" onClick={() => toggleExpand(order._id)}>
                    {isExpanded ? "Hide Details" : "View More"}
                  </button>
                </div>

                {/* 🔹 Status Section */}
                <div className="OrderLists-status">
                  {isEmployee ? (
                    <>
                      <select
  value={orderStatusMap[order._id] ?? order.OrderStatus}
  onChange={(e) => handleStatusChange(order._id, e.target.value)}
>
  {statusOptions.map((status) => (
    <option key={status} value={status}>{status}</option>
  ))}
                        </select>

                        <button
                          className={`OrderLists-save-btn ${
                            orderStatusMap[order._id] === undefined || orderStatusMap[order._id] === order.OrderStatus
                              ? "disabled"
                              : "enabled"
                          }`}
                          onClick={() => handleSaveStatus(order._id)}
                        >
                          Save
                        </button>

                      <button className="OrderLists-print-btn" onClick={() => printOrder(order)}>Print</button>
                    </>
                  ) : (
                    <div className="OrderLists-status-timeline">
                      {statusOptions.map((status, index) => (
                        <div key={status} className={`OrderLists-status-step ${status === order.OrderStatus ? "active" : ""}`}>
                          {index > 0 && <span className="OrderLists-status-arrow">→</span>}
                          {status}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 🔹 Extra Details Section (Placed Below and Fully Visible When Expanded) */}
            <div className={`OrderLists-extra-details ${isExpanded ? "show" : ""}`}>
              <h4>Order Details</h4>
              <p><strong>Printing Output:</strong> {order.OrderDetails.printing.output} Units</p>
              <p><strong>Qty Pack Size:</strong> {order.OrderDetails.printing.qtyPackSize}</p>
              <p><strong>Number of Rolls:</strong> {order.OrderDetails.printing.numberOfRolles}</p>
              <p><strong>Lamination Quantity:</strong> {order.OrderDetails.lamination.quantity}</p>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div>No orders found.</div>
  )}
</div>


  </>);
};

export default OrderList;
