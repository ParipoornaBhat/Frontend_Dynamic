import React, { useState, useEffect, useRef } from 'react';
import './addItem.css';
import Highlight from 'react-highlight-words';
import styled from 'styled-components';
import ManageUserError from '../other/ErrorMessage'; // Import the ErrorMessage component
import ManageUserSuccess from '../other/SuccessMessage'; // Import the ErrorMessage component
import SettingModal from './SettingModal';
import axios from 'axios';
import { use } from 'react';
import Highlighter from "react-highlight-words";
import { Trash2 } from "lucide-react";
import { CustomInput, CustomSelect, RemarkCheck , RemarkCheck2 } from './Custominput'

const OrderModal = ({ item, isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        printing: {
          output: item?.output || 0,
          qtyPackSize: item?.qtyPackSize || 0,
          numberOfRolles: item?.numberOfRolles || 0,
        },
        items: item || {}, // Ensure item is included in formData
      });
    
      // Update formData when item changes (e.g., when modal opens with new item)
      useEffect(() => {
        if (item) {
          setFormData({
            printing: {
              output: item.output || 0,
              qtyPackSize: item.qtyPackSize || 0,
              numberOfRolles: item.numberOfRolles || 0,
            },
            items: item,
          });
        }
      }, [item]);
    
    const token = localStorage.getItem('token');

    const [loading, setLoading] = useState(false);
    
      const [errorMessage, setErrorMessage] = useState(''); // Track error message
      const [successMessage, setSuccessMessage] = useState(''); // Track error message
      const { itemInfo, printing, lamination } = item;
      const [mainImage, setMainImage] = useState(itemInfo.itemImages[0]);
      const [isZoomVisible, setIsZoomVisible] = useState(false);
      const [zoomPosition, setZoomPosition] = useState("center");
      
      const requiredFields = {
        printing: {
          output: true,
          qtyPackSize: true,
          numberOfRolles: true,
        },
        item_Id: true, // Ensures item ID is provided
      };
      const validateForm = () => {
        for (const section in requiredFields) {
          const fields = requiredFields[section];
      
          for (const key in fields) {
            if (fields[key] === true) {
              const value = formData[section]?.[key] || formData[key]; // Handle both nested and direct fields
      
              if (value === undefined || value === null || value === "") {
                setErrorMessage(`Field "${key}" is required.`);
                return false;
              }
            }
          }
        }
        return true;
      };
      
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        const numericValue = Number(value);
      
        setFormData((prev) => {
          let { output, qtyPackSize, numberOfRolles } = prev.printing;
      
          // Ensure values are initialized properly
          output = output || 1;
          qtyPackSize = qtyPackSize || 1;
          numberOfRolles = numberOfRolles || 1;
      
          if (name === "output") {
            output = numericValue;
            qtyPackSize = numberOfRolles ? output / numberOfRolles : 1;  
            numberOfRolles = qtyPackSize ? output / qtyPackSize : 1;
          } 
          else if (name === "qtyPackSize") {
            qtyPackSize = numericValue;
            output = numberOfRolles ? qtyPackSize * numberOfRolles : 1;
            numberOfRolles = qtyPackSize ? output / qtyPackSize : 1;
          } 
          else if (name === "numberOfRolles") {
            numberOfRolles = numericValue;
            output = qtyPackSize ? numberOfRolles * qtyPackSize : 1;
            qtyPackSize = numberOfRolles ? output / numberOfRolles : 1;
          }
      
          return {
            ...prev,
            printing: { output, qtyPackSize, numberOfRolles },
          };
        });
      };

    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");
    
        if (!formData.items || Object.keys(formData.items).length === 0) {
            setErrorMessage("Item details are missing.");
            setLoading(false);
            return;
        }
    
        try {
            const baseUrl = import.meta.env.VITE_BASE_URL;
            const endpoint = "/emp/order/submit";
    
            console.log("Submitting Order:", formData);
    
            const response = await axios.post(`${baseUrl}${endpoint}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
    
            if (response.status === 201 && response.data.order) {
                const orderId = response.data.order.OrderID; // Extract Order ID
                setSuccessMessage(`Order placed successfully! Order ID: ${orderId}`);
    
                setTimeout(() => {
                    setSuccessMessage("");
                    onClose(); // Close modal after success
                }, 3000);
            } else {
                setErrorMessage("Unexpected server response.");
            }
        } catch (error) {
            setErrorMessage(`API Error: ${error.response?.data?.message || "Unknown error"}`);
        } finally {
            setLoading(false);
        }
    };
    
      const handleMouseEnter = () => {
        setIsZoomVisible(true);
      };
    
      const handleMouseLeave = () => {
        setIsZoomVisible(false);
      };
    
      const handleMouseMove = (e) => {
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const xPercent = ((e.clientX - left) / width) * 100;
        const yPercent = ((e.clientY - top) / height) * 100;
    
        setZoomPosition(`${xPercent}% ${yPercent}%`);
      };      return (
        <>
    
          {/* Modal structure using Styled Components */}
          <StyledOverlay>
            <StyledModal>
            <>  {/* Display error and success messages */}
              {errorMessage && (
                <ManageUserError errorMessage={errorMessage} onClose={() => setErrorMessage('')} />
              )}
              {successMessage && (
                <ManageUserSuccess successMessage={successMessage} onClose={() => setSuccessMessage('')} />
              )}
    <button
        type="button"
        onClick={onClose}
        style={{
          position: "absolute", // Stays inside the div but overlays content
          top: "10px",
          right: "10px",
          background: "transparent",
          border: "none",
          fontSize: "32px", // Bigger button
          fontWeight: "bold",
          cursor: "pointer",
          color: "#555",
          padding: "12px",
          transition: "color 0.3s ease, transform 0.2s ease",
          zIndex: 1000, // High z-index to overlay content
        }}
        onMouseOver={(e) => (e.target.style.color = "#000")}
        onMouseOut={(e) => (e.target.style.color = "#555")}
      >
        &times;
      </button>
    
      <>
      <style>{`
      .ItemOrderingView-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
}

.ItemOrderingView-main-image-container {
  width: 350px;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(128, 128, 128, 0.1);
  margin-bottom: 10px;
  position: relative;
}

.ItemOrderingView-main-image {
  width: 90%;
  height: 90%;
  object-fit: contain;
  display: block;
}

/* Zoom Preview Box */
.ItemOrderingView-zoom-preview {
  position: fixed;
  top: 60px;
  right: 90px;
  width: 250px;
  height: 300px;
  border: 2px solid #ddd;
  background-size: 500px; /* Increase background size to create zoom effect */
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 8px;
  display: block;
}

.ItemOrderingView-thumbnail-container {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.ItemOrderingView-thumbnail {
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
  width: 70px;
  height: 70px;
  background: rgba(128, 128, 128, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.ItemOrderingView-thumbnail:hover {
  transform: scale(1.05);
}

.ItemOrderingView-thumbnail-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}



  .ItemOrderingView-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
    justify-content: center;
  }

  .ItemOrderingView-image-section {
    flex: 1;
    min-width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Fixed size for main image container */
  .ItemOrderingView-main-image-container {
    width: 95%; /* Increased width */
    height: 500px; /* Increased height */
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    overflow: hidden;
    background: rgba(128, 128, 128, 0.1);
    margin-bottom: 10px;
  }

  /* Ensure the image is centered and larger */
  .ItemOrderingView-main-image {
    width: 90%;  /* Increased size */
    height: 90%;
    object-fit: contain;
    display: block;
  }

  .ItemOrderingView-thumbnail-container {
    display: flex;
    gap: 10px;
    justify-content: center;
  }

  /* Fixed size for thumbnails */
  .ItemOrderingView-thumbnail {
    cursor: pointer;
    border-radius: 10px;
    overflow: hidden;
    width: 70px; /* Increased size */
    height: 70px;
    background: rgba(128, 128, 128, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
  }

  .ItemOrderingView-thumbnail:hover {
    transform: scale(1.05);
  }

  /* Ensure thumbnails fit properly */
  .ItemOrderingView-thumbnail-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .ItemOrderingView-details-section {
    flex: 1;
    min-width: 300px;
  }

  .ItemOrderingView-product-title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  .ItemOrderingView-product-description {
    color: #666;
    margin-top: 10px;
  }

  hr {
    margin: 20px 0;
    border: 0.5px solid #ddd;
  }

  .ItemOrderingView-product-table {
    width: 100%;
    max-width: 400px;
    border-collapse: collapse;
  }

  .ItemOrderingView-product-table td {
    padding: 8px;
  }

  .ItemOrderingView-label {
    font-weight: 600;
    color: #555;
  }

  .ItemOrderingView-buttons {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }

  .ItemOrderingView-cart-btn,
  .ItemOrderingView-buy-btn {
    flex: 1;
    padding: 10px;
    font-size: 16px;
    border: none;
    cursor: pointer;
    transition: 0.3s;
  }

  .ItemOrderingView-cart-btn {
    background: #f5f5f5;
    color: #333;
  }

  .ItemOrderingView-cart-btn:hover {
    background: #e0e0e0;
  }

  .ItemOrderingView-buy-btn {
    background: orange;
    color: white;
  }

  .ItemOrderingView-buy-btn:hover {
    background: darkorange;
  }
`}</style>

<div className="ItemOrderingView-container">
  {/* Image Section */}
  <div className="ItemOrderingView-image-section">
    <div
      className="ItemOrderingView-main-image-container"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={mainImage}
        alt={itemInfo.ItemName}
        className="ItemOrderingView-main-image"
      />
    </div>

    {/* Thumbnail Images */}
    <div className="ItemOrderingView-thumbnail-container">
      {itemInfo.itemImages.map((img, index) => (
        <div
          key={index}
          className="ItemOrderingView-thumbnail"
          onClick={() => setMainImage(img)}
        >
          <img
            src={img}
            alt={`Thumbnail ${index + 1}`}
            className="ItemOrderingView-thumbnail-image"
          />
        </div>
      ))}
    </div>
  </div>

  {/* Product Details */}
  <div className="ItemOrderingView-details-section">
    <h1 className="ItemOrderingView-product-title">{itemInfo.ItemName}</h1>
    <p className="ItemOrderingView-product-description">{itemInfo.GMS}</p>

    <hr />

    <table className="ItemOrderingView-product-table">
      <tbody>
        <tr>
          <td className="ItemOrderingView-label">Item ID</td>
          <td>{itemInfo.itemId}</td>
        </tr>
        <tr>
          <td className="ItemOrderingView-label">Type</td>
          <td>{itemInfo.itemType}</td>
        </tr>
        <tr>
          <td className="ItemOrderingView-label">Commodity</td>
          <td>{itemInfo.nameAndCommodity}</td>
        </tr>
        <tr>
          <td className="ItemOrderingView-label">Printing</td>
          <td>{printing.cylinderDirection}</td>
        </tr>
        <tr>
          <td className="ItemOrderingView-label">Lamination</td>
          <td>{lamination.type}</td>
        </tr>
      </tbody>
    </table>
    <form onSubmit={handleSubmit} >
        <div style={{width: "150px" }}>
    <h3 style={{ marginBottom: "10px", fontSize: "20px", color: "#333" }}>Order Details</h3>

<label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Output (kg):</label>
<input
  type="number"
  name="output"
  value={formData.printing.output}
  onChange={handleChange}
  required
  style={{
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
  }}
/>

<label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Quantity per Pack:</label>
<input
  type="number"
  name="qtyPackSize"
  value={formData.printing.qtyPackSize}
  onChange={handleChange}
  required
  style={{
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
  }}
/>

<label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Number of Rolls:</label>
<input
  type="number"
  name="numberOfRolles"
  value={formData.printing.numberOfRolles}
  onChange={handleChange}
  required
  style={{
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
  }}
/>
</div>

        <div className="ItemOrderingView-buttons">
          
        </div>
      
    <div className="ItemOrderingView-buttons">
    
      <button className="ItemOrderingView-cart-btn">Edit</button>
      <button
    type="submit"
    onClick={handleSubmit}
    disabled={loading}
    style={{
      padding: "16px 32px", // Increased size
      fontSize: "18px", // Slightly larger text
      fontWeight: "600",
      color: "#fff",
      backgroundColor: loading ? "#9ca3af" : "rgb(12, 4, 247)",
      border: "none",
      borderRadius: "10px", // Slightly rounder corners
      cursor: loading ? "not-allowed" : "pointer",
      boxShadow: loading ? "none" : "0px 5px 10px rgba(0, 0, 0, 0.2)", // More pronounced shadow
      transition: "background-color 0.3s ease, box-shadow 0.3s ease",
    }}
  >
    {loading ? "Adding Item..." : "Add Item to User"}
  </button>

      <button type="submit" className="ItemOrderingView-buy-btn">
            Place Order
          </button>    </div></form>
  </div>

  {/* Zoom Preview Box */}
  {isZoomVisible && (
    <div
      className="ItemOrderingView-zoom-preview"
      style={{
        backgroundImage: `url(${mainImage})`,
        backgroundPosition: zoomPosition,
      }}
    ></div>
  )}
</div>



    </>
       </>
            </StyledModal>
          </StyledOverlay>
        </>
      );
}
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
  max-width:90%;
  width: 100%;
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 1001;


  /* Enable overflow */
  max-height: 80vh; /* Optional: limit the modal height to a percentage of the viewport */
  overflow-y: auto; /* Enables scrolling when content exceeds the modal height */
`;





export default OrderModal