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
    setOrderStatusMap((prev) => ({ ...prev, [orderId]: newStatus }));
    setStatusChanged((prev) => ({ ...prev, [orderId]: true }));
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

  return (<>
  <style>{`.order-list-container {
  padding: 20px;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-card {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-id {
  font-size: 18px;
  font-weight: bold;
}

.print-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.order-image-container {
  position: relative;
  text-align: center;
  margin: 10px 0;
}

.order-image {
  width: 100%;
  max-width: 150px;
  height: auto;
  border-radius: 8px;
}

.image-btn {
  position: absolute;
  top: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  cursor: pointer;
  padding: 5px 10px;
  transform: translateY(-50%);
}

.image-btn.left {
  left: 5px;
}

.image-btn.right {
  right: 5px;
}

.expand-btn {
  background: #007BFF;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  margin-top: 10px;
}

.order-extra-details {
  margin-top: 10px;
  background: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
}

.status-timeline {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.status-step {
  padding: 5px 10px;
  border-radius: 5px;
  background: #ccc;
}

.status-step.active {
  background: #28a745;
  color: white;
}

.status-arrow {
  font-weight: bold;
  color: #666;
}
`}</style>
    <div className="order-list-container">
      {orders.length > 0 ? (
        <div className="order-list">
          {orders.map((order) => {
            const images = order.item_Id.itemInfo.itemImages;
            const currentIndex = imageIndex[order._id] || 0;

            return (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <h3 className="order-id">Order ID: {order.OrderID}</h3>
                  {isEmployee && (
                    <button className="print-btn" onClick={() => printOrder(order)}>
                      Print
                    </button>
                  )}
                </div>

                {/* Image Carousel */}
                <div className="order-image-container">
                  {images.length > 1 && (
                    <button className="image-btn left" onClick={() => handlePrevImage(order._id, images)}>
                      ◀
                    </button>
                  )}
                  <img src={images[currentIndex]} alt="Order Item" className="order-image" />
                  {images.length > 1 && (
                    <button className="image-btn right" onClick={() => handleNextImage(order._id, images)}>
                      ▶
                    </button>
                  )}
                </div>

                <div className="order-details">
                  <p><strong>Type:</strong> {order.OrderType}</p>
                  <p><strong>Status:</strong> 
                    {isEmployee ? (
                      <>
                        <select value={orderStatusMap[order._id] || order.OrderStatus} onChange={(e) => handleStatusChange(order._id, e.target.value)}>
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                        <button className="save-btn" onClick={() => handleSaveStatus(order._id)}>Save</button>
                      </>
                    ) : (
                      order.OrderStatus
                    )}
                  </p>
                  <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>

                  <button className="expand-btn" onClick={() => toggleExpand(order._id)}>
                    {expandedOrder === order._id ? "Hide Details" : "View More"}
                  </button>

                  {expandedOrder === order._id && (
                    <div className="order-extra-details">
                      <h4>Order Details</h4>
                      <p><strong>Printing Output:</strong> {order.OrderDetails.printing.output} Units</p>
                      <p><strong>Qty Pack Size:</strong> {order.OrderDetails.printing.qtyPackSize}</p>
                      <p><strong>Number of Rolls:</strong> {order.OrderDetails.printing.numberOfRolles}</p>
                      <p><strong>Lamination Quantity:</strong> {order.OrderDetails.lamination.quantity}</p>
                      <p><strong>Item Name:</strong> {order.item_Id.itemInfo.ItemName}</p>
                      <p><strong>Mill Address:</strong> {order.item_Id.itemInfo.millAddress}</p>
                      <p><strong>Customer Name:</strong> {order.item_Id.itemInfo.agentCustomerName}</p>

                      {!isEmployee && (
                        <div className="status-timeline">
                          {statusOptions.map((status, index) => (
                            <div key={status} className={`status-step ${status === order.OrderStatus ? "active" : ""}`}>
                              {index > 0 && <span className="status-arrow">→</span>}
                              {status}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
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
