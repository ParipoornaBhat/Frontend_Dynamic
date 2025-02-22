import { useState } from "react";
import Highlighter from "react-highlight-words";

const OrderList = ({ orders, isEmployee, updateOrderStatus, printOrder }) => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderStatusMap, setOrderStatusMap] = useState({});
  const [statusChanged, setStatusChanged] = useState({});
  const [imageIndex, setImageIndex] = useState({}); // Tracks the current image index for each order

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
    setOrderStatusMap((prevStatusMap) => ({
      ...prevStatusMap,
      [orderId]: newStatus
    }));
  };
  

  const handleSaveStatus = (orderId) => {
    if (orderStatusMap[orderId]) {
      updateOrderStatus(orderId, orderStatusMap[orderId]);
      setStatusChanged((prev) => ({ ...prev, [orderId]: false }));
      
    }
  };
 
  

  const statusOptions = [
    "Under Review",
    "Order Confirmed",
    "Printing",
    "Ready to Dispatch",
    "Dispatched",
    "Completed",
  ];

  return (<>      <style>{`
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
      justify-content: space-between;
      padding: 10px;
    }

    /* Image Section */
    .OrderLists-image-container {
      position: relative;
      width: 80px;
      height: 80px;
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
      font-size: 12px;
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

    /* Extra Details (Slide Down Effect) */
    .OrderLists-extra-details {
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
    }

    .OrderLists-card .OrderLists-extra-details.show {
      max-height: 200px;
      opacity: 1;
      padding: 10px;
      border-top: 1px solid #ddd;
      background: #f8f9fa;
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
        align-items: flex-start;
      }
      .OrderLists-status {
        text-align: left;
        margin-top: 10px;
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
      .OrderLists-save-btn:disabled {
  background-color: rgb(132, 133, 133) !important;
  color: #fff !important;
  cursor: not-allowed !important;
  opacity: 0.6 !important;
}

    `}
  </style>

  <div className="OrderLists-container">
    {orders.length > 0 ? (
      <div className="OrderLists-list">
        {orders.map((order) => {
          const images = order.item_Id.itemInfo.itemImages;
          const currentIndex = imageIndex[order._id] || 0;
          const isExpanded = expandedOrder === order._id;

          return (
            <div key={order._id} className="OrderLists-card">
              <div className="OrderLists-main">
                {/* Image Section */}
                <div className="OrderLists-image-container">
                  {images.length > 1 && (
                    <button className="OrderLists-image-btn left" onClick={() => handlePrevImage(order._id, images)}>❮</button>
                  )}
                  <img src={images[currentIndex]} alt="Order Item" className="OrderLists-image" />
                  {images.length > 1 && (
                    <button className="OrderLists-image-btn right" onClick={() => handleNextImage(order._id, images)}>❯</button>
                  )}
                </div>

                {/* Order Summary */}
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

                {/* Status Section */}
                <div className="OrderLists-status">
                  {isEmployee ? (
                    <>
                      <select
                        value={orderStatusMap[order._id] || order.OrderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <button
  className="OrderLists-save-btn"
  onClick={() => handleSaveStatus(order._id)}
  disabled={orderStatusMap[order._id] === order.OrderStatus} 
  style={{
    backgroundColor:
      orderStatusMap[order._id] === order.OrderStatus ? "rgb(132, 133, 133)" : "#28a745",
    color:
      orderStatusMap[order._id] === order.OrderStatus ? "#fff" : "white",
    cursor:
      orderStatusMap[order._id] === order.OrderStatus ? "not-allowed" : "pointer",
    opacity: orderStatusMap[order._id] === order.OrderStatus ? 0.6 : 1,
  }}
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
