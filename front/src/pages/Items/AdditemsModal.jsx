import React, { useState, useEffect, useRef } from 'react';
import './addItem.css';
import Highlight from 'react-highlight-words';
import styled from 'styled-components';
import ManageUserError from '../other/ErrorMessage'; // Import the ErrorMessage component
import ManageUserSuccess from '../other/SuccessMessage'; // Import the ErrorMessage component
import SettingModal from './SettingModal';
import axios from 'axios';
import './addItem.css'
import { use } from 'react';
import Highlighter from "react-highlight-words";
import { Trash2 } from "lucide-react";
import { CustomInput, CustomSelect, RemarkCheck , RemarkCheck2 } from './Custominput'


const AddItemModal = ({ activeTab, onClose, onSave }) => {
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState(''); // Track error message
  const [successMessage, setSuccessMessage] = useState(''); // Track error message
  const [BOPPoptions, setBOPPoptions] = useState([]); // For storing BOPP options
  const [showModal, setShowModal] = useState(false); // To toggle modal visibility
  const [editFormData, setEditFormData] = useState({}); // Data to edit in the modal
  const [isOptionsFetched, setIsOptionsFetched] = useState(false); // Track if options are fetched

// Fetch form options from an API or data source
  const token = localStorage.getItem('token');
  const currentUserId = localStorage.getItem('_id');
  const employeeRoles = JSON.parse(localStorage.getItem('employeeRoles')) || [];
  const userRoles = JSON.parse(localStorage.getItem('userRoles')) || [];
  const getRoles = () => (activeTab === 'Employee' ? employeeRoles : userRoles);

//Searching users
const [searchTerm,setSearchTerm]=useState("");
const [isFocused, setIsFocused] = useState(false);
const [images, setImages] = useState([]);
const fileInputRef = useRef(null);
const requiredFields = {
itemInfo: {
    user_id:true,
    ItemName:true ,

    itemId: true,
    itemType: true,
    itemImages: false,
    descriptionCheck: false, // Optional
    description: false, // Optional
    nameAndCommodity: true,
    millAddress: true,
    agentCustomerName: true,
    GMS: false, // Optional
},
printing: {
    sizeMic: true,
    materialType: true,
    cylinder: true,
    numberOfColours: true,
    colourNames: true,
    cylinderDirection: true,
},
inspection1: { 
    jobInfo: { remarksChecked: false, Remarks: false } 
},
lamination: { 
    sizeMic: true, 
    type: true 
},
inspection2: { 
    jobInfo: { remarksChecked: false, Remarks: false } 
},
slitting: { 
    jobInfo: { remarksChecked: false, Remarks: false } 
},
fabricLamination: {
    size: true,
    materialType: true,
    sides: true,
    Trimming: false, // Optional
},
cuttingAndSlitting: {
    stiching: false, // Optional
    perforation: false, // Optional
    treadColour: false, // Optional
    handleType: false, // Optional
    handleColour: false, // Optional
    packing: false, // Optional
},
};

const [suggestions, setSuggestions] = useState([]);
const [isSearchDisabled, setIsSearchDisabled] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);
const searchRef = useRef(null); // Ref for detecting outside click
const [loading, setLoading] = useState(false);
const [BOPP, setBOPP] = useState({
  itemInfo: {
    ItemName:null ,

    user_id:null,
      itemId:null,
      itemType: null,
      itemImages:null ,
      descriptionCheck:false,
      description:'' ,
      nameAndCommodity:'',
      millAddress:'' ,
      agentCustomerName:'',
      GMS:'',
    },
  printing: { jobInfo: { 
                  position:1,
                  checked: true ,
                  remarksChecked:false,
                  Remarks:"",
              },
              sizeMic:"",
              materialType:"",
              cylinder:"",
              numberOfColours:0,
              colourNames:[],
              cylinderDirection:"",

},
  inspection1: {  jobInfo: { 
                      position:2,
                      checked: true ,
                      remarksChecked:false,
                      Remarks:"",
                  }, 
},
  lamination: {   jobInfo: { 
                      position:3,
                      checked: true ,
                      remarksChecked:false,
                      Remarks:"",
                  },
                  sizeMic:"",
                  type:"",
 
},
  inspection2: { 
              jobInfo: { 
                  position:4,
                  checked: true ,
                  remarksChecked:false,
                  Remarks:"",
              }, 

},
  slitting: { jobInfo: { 
                  position:5,
                  checked: true ,
                  remarksChecked:false,
                  Remarks:"",
              }, 
},
  fabricLamination: { jobInfo: { 
                          position:6,
                          checked: true ,
                          remarksChecked:false,
                          Remarks:"",
                      }, 
                      size:"",
                      materialType:"",
                      sides:"",
                      Trimming:false,
},
  cuttingAndSlitting: {   jobInfo: { 
                              position:7,
                              checked: true ,
                              remarksChecked:false,
                              Remarks:"",
                          },
                          stiching:false,
                          perforation:false,
                          treadColour:"",
                          handleType:"",
                          handleColour:"",
                          packing:false,
},
});
const validateForm = () => {
  const checkFields = (section, obj, parentData) => {
      for (const key in obj) {
          if (typeof obj[key] === "object" && obj[key] !== null) {
              if (!checkFields(section, obj[key], parentData?.[key])) return false;
          } else if (obj[key] === true) {
              // Check if the required field exists and is not empty or null
              const value = parentData?.[key];

              if (value === undefined || value === null || value === "") {
                  setErrorMessage(`Field "${key}" in section "${section}" is required.`);
                  return false;
              }
          }
      }
      return true;
  };

  for (const section in requiredFields) {
      if (!checkFields(section, requiredFields[section], BOPP[section])) return false;
  }

  return true;
};


const handleSubmit = async (e) => {
e.preventDefault();
setLoading(true);
setErrorMessage('');
setSuccessMessage('');

// Validate Required Fields
if (!validateForm()) {
    setLoading(false);
    return;
}

// Ensure at least one valid image is uploaded
const validImages = images.filter(image => image.file instanceof File);
if (validImages.length === 0) {
    setErrorMessage("At least one valid image must be uploaded.");
    setLoading(false);
    return;
}

try {
    const formData = new FormData();
    formData.append("BOPP", JSON.stringify(BOPP));

    // Append valid images
    validImages.forEach((image) => {
        formData.append("images", image.file);
    });

    const baseUrl = import.meta.env.VITE_BASE_URL;
    const endpoint = "/emp/ItemManagementBOPP/submit";

    // Perform API request
    const response = await axios.post(`${baseUrl}${endpoint}`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });

    if (response.status === 201) {
      setSuccessMessage("Form submitted successfully!");

      setTimeout(() => {
        setSuccessMessage('');
        onSave();  // Call onSave after 4 seconds
        onClose(); // Close the modal after 4 seconds
      }, 4000);

    } else {
        setErrorMessage("Unexpected server response.");
    }
} catch (error) {
    if (error.response) {
        console.error("Server Error:", error.response.data);
        setErrorMessage(`API Error: ${error.response.data.message || "Unknown error"}`);
    } else if (error.request) {
        console.error("Request Error:", error.request);
        setErrorMessage("API Error: No response from the server.");
    } else {
        console.error("Error:", error.message);
        setErrorMessage(`API Error: ${error.message}`);
    }
} finally {
    setLoading(false);
}
};







// Fetch users function
const fetchSearch = async () => {
  const queryParams = new URLSearchParams({ search: searchTerm.trim() });

  const url = `${import.meta.env.VITE_BASE_URL}/general/addItem/searchSuggestion?${queryParams.toString()}`;

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setSuggestions(response.data.users);
  } catch (error) {
    console.error("Failed to load options:", error);
  }
};

// Fetch suggestions only when input is focused
useEffect(() => {
  if (isFocused) {
    fetchSearch();
  }
}, [isFocused, searchTerm]);

// Handle outside click to close suggestions
useEffect(() => {
  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setIsFocused(false); // Hide suggestions
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

const fetchAndSelectUser = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/general/viewAnyProfile/addItem/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.status === 200 && response.data) {
      setSelectedUser(response.data);
      setSearchTerm(
        `${response.data.fullName.firstName} ${response.data.fullName.lastName} (${response.data.ID})(${response.data.phone})`
      );
      setSuggestions([]); // Hide suggestions
      setIsSearchDisabled(true); // Disable search input
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
};

// Clear selection and enable search input
const editSelection = () => {
  setSelectedUser(null);
  setSearchTerm("");
  setIsSearchDisabled(false);
};



  
    const [PET, setPET] = useState({
      printing: { jobInfo: { checked: false } },
      inspection1: { jobInfo: { checked: false } },
      slitting: { jobInfo: { checked: false } },
      inspection2: { jobInfo: { checked: false } },
      lamination: { jobInfo: { checked: false } },
      fabricLamination: { jobInfo: { checked: false } },
      cuttingAndSlitting: { jobInfo: { checked: false } },
    });
const fetchformoptions = async () => {
try {
  const token = localStorage.getItem('token'); // Get the token from localStorage
  if (!token) {
    setErrorMessage('No authentication token found');
    return;
  }

  // Check if options are already fetched
  if (isOptionsFetched) {
    return; // If options are already fetched, don't fetch again
  }

  const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/general/options`, {
    headers: {
      Authorization: `Bearer ${token}` // Attach token as Bearer token in Authorization header
    }
  });

  // If the response is successful
  setBOPPoptions(response.data.BOPPoptions); // Set options with the response data
  setIsOptionsFetched(true); // Mark options as fetched
  setEditFormData(response.data.BOPPoptions); 

  console.log('Options loaded successfully.')
} catch (error) {
  // Handle error: if there's an issue with the request
  setErrorMessage(error.response?.data?.message || 'Failed to load options.');
}
};

    const handleEditClick = () => {
      setShowModal(true); // Show the modal
    };
  
    // Close the modal
    const handleCloseModal = () => {
      setShowModal(false);
    };

    const handleInputChange = (process, field, value, subField) => {
      if (subField) {
        // If the field has subfields (like jobInfo), we update the specific subfield
        setBOPP((prevState) => ({
          ...prevState,
          [process]: {
            ...prevState[process],
            [field]: {
              ...prevState[process][field],
              [subField]: value, // Dynamically updating the subfield (e.g., Remarks, checked, etc.)
            },
          },
        }));
      } else {
        // If there are no subfields (direct field like sizeMic, materialType)
        setBOPP((prevState) => ({
          ...prevState,
          [process]: {
            ...prevState[process],
            [field]: value, // Direct field update
          },
        }));
      }
    };
    useEffect(() => {
      console.log(selectedUser)
      if (selectedUser) {
          setBOPP(prevBOPP => ({
              ...prevBOPP,
              itemInfo: {
                  ...prevBOPP.itemInfo, // Keep other values unchanged
                  user_id:`${selectedUser?._id}`,
                  itemId: `${selectedUser?.ID}-${activeTab}-${(selectedUser?.totalItems?.BOPP + 1).toString().padStart(4, "0")}`,
                  itemType: activeTab,
                  agentCustomerName: `${selectedUser?.fullName?.firstName} ${selectedUser?.fullName?.lastName}`
              }
          }));
      }
  }, [selectedUser]);
  
  
    useEffect(() => {
      if (!isOptionsFetched) {
        fetchformoptions(); // Fetch the data only when isOptionsFetched is false
      }
    }, [isOptionsFetched]);

    const handleImageChange = (event) => {
      const files = Array.from(event.target.files);
      processFiles(files);
  };
  
  const processFiles = (files) => {
      if (files.length + images.length > 4) {
          alert("You can upload a maximum of 4 images.");
          return;
      }
  
      const validFiles = files.filter((file) => {
          if (!file.type.startsWith("image/")) {
              alert(`${file.name} is not a valid image.`);
              return false;
          }
          if (file.size > 5 * 1024 * 1024) {
              alert(`${file.name} is too large. Max file size is 5MB.`);
              return false;
          }
          return true;
      });
  
      const newImages = validFiles.map((file) => {
          return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve({
                  url: reader.result, // For preview
                  file: file, // Store the actual File object
                  name: file.name,
                  size: (file.size / 1024 / 1024).toFixed(2) + " MB", // Convert bytes to MB
              });
              reader.readAsDataURL(file);
          });
      });
  
      Promise.all(newImages).then((results) =>
          setImages((prevImages) => [...prevImages, ...results])
      );
  };
  
  const handleRemoveImage = (event, index) => {
      event.stopPropagation(); // Prevent click event from triggering upload
      setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  
  const handleDragOver = (event) => {
      event.preventDefault();
  };
  
  const handleDrop = (event) => {
      event.preventDefault();
      const files = Array.from(event.dataTransfer.files);
      processFiles(files);
  };
  

  return (
    <>
    

    

      {/* Modal structure using Styled Components */}
      <StyledOverlay>
        <StyledModal>
        {activeTab === "BOPP" ? 
        (<>  {/* Display error and success messages */}
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


    <p className="ItemForm-form-message">
        Need to update addresses? Or Need to update Brands? Go to{" "}
 <br /> 
        <a 
          href="/manage-users" 
          target="_blank" 
          rel="noopener noreferrer"
          className="ItemForm-form-link"
        >Manage Users </a>  {" "}to add or edit Addresses/Brands.
      </p>
        <div className="ItemForm-container">
<form className="ItemFrom-reg-form" >
  <div className='ItemForm-Starting'>
<div className="ItemForm-ItemInfo">
<div className="ItemForm-Search-Container">
    <div className="ItemForm-Search-InputWrapper">
      <input
        type="text"
        className="ItemForm-Search-Input"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          fetchSearch();
        }}
        onFocus={() => setIsFocused(true)}  // Show suggestions on focus
        onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Hide with delay to allow clicks
        placeholder="Search By ID, Name, or Phone Number..."
        disabled={isSearchDisabled}
      />

      {selectedUser && (
        <button className="ItemForm-Search-EditButton" onClick={editSelection}>
          Edit Selection
        </button>
      )}

      {isFocused && suggestions.length > 0 && (  // Show only when focused
        <ul className="ItemForm-Search-SuggestionList">
          {suggestions.map((user) => (
            <li
              key={user._id}
              className="ItemForm-Search-SuggestionItem"
              onMouseDown={() => fetchAndSelectUser(user._id)} // Prevent blur issue
            >
              {/* Highlight Full Name */}
              <div className="ItemForm-Search-UserName">
                <Highlighter
                  highlightClassName="ItemForm-Search-Highlight"
                  searchWords={[searchTerm]}
                  autoEscape={true}
                  textToHighlight={`${user.fullName.firstName} ${user.fullName.lastName}`}
                />
              </div>

              {/* Highlight ID */}
              <div className="ItemForm-Search-UserID">
                <Highlighter
                  highlightClassName="ItemForm-Search-Highlight"
                  searchWords={[searchTerm]}
                  autoEscape={true}
                  textToHighlight={user.ID}
                />
              </div>

              {/* Highlight Phone Number */}
              <div className="ItemForm-Search-UserPhone">
                <Highlighter
                  highlightClassName="ItemForm-Search-Highlight"
                  searchWords={[searchTerm]}
                  autoEscape={true}
                  textToHighlight={user.phone}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
  {selectedUser && (
  <>
  <>{/*   itemInfo: {
              itemId:null,
              itemType: null,
              itemImages:null ,
              description:'' ,
              descriptioncheck:'',
              nameAndCommodity:'',
              millAddress:'' ,
              agentCustomerName:'',
              GMS:''
            },
      */}   </>     
      <div className='ItemForm-Job-Fields'>

     <div className='ItemForm-Job-input'>
    <label className="ItemForm-form-label">Item ID : </label>
              <input
                type="text"
                name="itemId"
                value={`${selectedUser?.ID}-${activeTab}-${(selectedUser?.totalItems?.BOPP + 1).toString().padStart(3, "0")}`}
                onChange={(e) => handleInputChange('itemInfo', 'itemId', e.target.value )}
                className="ItemForm-form-input"
                disabled
              />{/**Padding value 3 or 4.....*/}
    </div>
    <div className='ItemForm-Job-input'>
    <label className="ItemForm-form-label">Item Type : </label>
              <input
                type="text"
                name="itemType"
                value={`${activeTab}`}
                onChange={(e) => handleInputChange('itemInfo', 'itemType', e.target.value )}
                className="ItemForm-form-input"
                disabled
              />
    </div>
    <div className='ItemForm-Job-input'>
    <label className="ItemForm-form-label">Customer Name : </label>
              <input
                type="text"
                name="agentCustomerName"
                value={`${selectedUser?.fullName?.firstName} ${selectedUser?.fullName?.lastName}`}
                onChange={(e) => handleInputChange('itemInfo', 'agentCustomerName', e.target.value )}
                className="ItemForm-form-input"
                disabled
              />
    </div>    
    <div className='ItemForm-Job-input'>
    <label className="ItemForm-form-label">Item Name : </label>
              <input
                type="text"
                name="ItemName"
                value={BOPP.itemInfo.ItemName || ""}
                onChange={(e) => handleInputChange('itemInfo', 'ItemName', e.target.value )}
                className="ItemForm-form-input"
              />
    </div>  
    <div className='ItemForm-Job-input'>
    <label className="ItemForm-form-label">Name And Commodity (Brand):</label>          
    <input
        type="text"
        className="ItemForm-form-input"
        placeholder="Enter or select brand name..."
        value={BOPP.itemInfo.nameAndCommodity || ""}
        onChange={(e) =>
            handleInputChange("itemInfo", "nameAndCommodity", e.target.value)
        }
        list="brand-options"
    />
    {selectedUser?.brands?.length > 0 && (
        <datalist id="brand-options">
            {selectedUser.brands.map((brand, index) => (
                <option key={index} value={brand} />
            ))}
        </datalist>
    )}
</div>

<div className='ItemForm-Job-input'>
    <label className="ItemForm-form-label">Billing Address (millAddress):</label>          
    <input
        type="text"
        className="ItemForm-form-input"
        placeholder="Enter or select mill address..."
        value={BOPP.itemInfo.millAddress || ""}
        onChange={(e) =>
            handleInputChange("itemInfo", "millAddress", e.target.value)
        }
        list="mill-address-options"
    />
    {selectedUser?.addresses?.length > 0 && (
        <datalist id="mill-address-options">
            {selectedUser.addresses.map((address, index) => (
                <option key={index} value={address} />
            ))}
        </datalist>
    )}
</div>

<div className='ItemForm-Job-input'>
  <label className="ItemForm-form-label"> GMS (Package Capacity) : </label>
  <input
    type="text"
    name="GMS"
    value={BOPP.itemInfo.GMS || ''}  // Bind value to state
    onChange={(e) => handleInputChange('itemInfo', 'GMS', e.target.value)}
    className="ItemForm-form-input"
    required
  />
</div>


    </div>
    <div className='ItemForm-Image'>
    <div className="ItemForm-Image-container">
      <div
        className="ItemForm-Image-dropZone"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        {images.length === 0 ? (
          <p className="ItemForm-Image-placeholder">Drag & Drop or Click to Upload (Max: 4, 5MB each)</p>
        ) : (
          <div className="ItemForm-Image-grid">
            {images.map((image, index) => (
              <div key={index} className="ItemForm-Image-preview">
                <img src={image.url} alt={`Preview ${index + 1}`} className="ItemForm-Image-img" />
                <button
                  type="button"
                  className="ItemForm-Image-removeBtn"
                  onClick={(event) => handleRemoveImage(event, index)}
                >
                  <Trash2 size={16} />
                </button>
                <p className="ItemForm-Image-size">{image.size}</p>
              </div>
            ))}
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="ItemForm-Image-input"
          disabled={images.length >= 4}
          hidden
        />
      </div>
    </div>
    </div>
    <RemarkCheck2 section="itemInfo" label="Description" isItemInfo={true} BOPP={BOPP} handleInputChange={handleInputChange} /> 
  </>
)}

</div>


<br/>
<div className='ItemForm-Process'>
  <h1>Process Involved</h1>

  <div className="ItemForm-checks">
    <input 
      className="ItemForm-check-input" 
      type="checkbox" 
      id="printingCheck" 
      name="printingcheck" 
      checked={BOPP.printing.jobInfo.checked} 
      onChange={(e) => handleInputChange('printing', 'jobInfo', e.target.checked, 'checked')}  
    />
    <label className="ItemForm-check-label" htmlFor="printingCheck">Printing</label>
  </div>

  <div className="ItemForm-checks">
    <input 
      className="ItemForm-check-input" 
      type="checkbox" 
      id="inspection1" 
      name="inspection1" 
      checked={BOPP.inspection1.jobInfo.checked} 
      onChange={(e) => handleInputChange('inspection1', 'jobInfo', e.target.checked, 'checked')}  
    />
    <label className="ItemForm-check-label" htmlFor="inspection1">Inspection1</label>
  </div>

  <div className="ItemForm-checks">
    <input 
      className="ItemForm-check-input" 
      type="checkbox" 
      id="lamination" 
      name="lamination" 
      checked={BOPP.lamination.jobInfo.checked} 
      onChange={(e) => handleInputChange('lamination', 'jobInfo', e.target.checked, 'checked')}  
    />
    <label className="ItemForm-check-label" htmlFor="lamination">Lamination</label>
  </div>

  <div className="ItemForm-checks">
    <input 
      className="ItemForm-check-input" 
      type="checkbox" 
      id="inspection2" 
      name="inspection2" 
      checked={BOPP.inspection2.jobInfo.checked} 
      onChange={(e) => handleInputChange('inspection2', 'jobInfo', e.target.checked, 'checked')}  
    />
    <label className="ItemForm-check-label" htmlFor="inspection2">Inspection2</label>
  </div>

  <div className="ItemForm-checks">
    <input 
      className="ItemForm-check-input" 
      type="checkbox" 
      id="slitting" 
      name="slitting" 
      checked={BOPP.slitting.jobInfo.checked} 
      onChange={(e) => handleInputChange('slitting', 'jobInfo', e.target.checked, 'checked')}  
    />
    <label className="ItemForm-check-label" htmlFor="slitting">Slitting</label>
  </div>

  <div className="ItemForm-checks">
    <input 
      className="ItemForm-check-input" 
      type="checkbox" 
      id="fabricLamination" 
      name="fabricLamination" 
      checked={BOPP.fabricLamination.jobInfo.checked} 
      onChange={(e) => handleInputChange('fabricLamination', 'jobInfo', e.target.checked, 'checked')}  
    />
    <label className="ItemForm-check-label" htmlFor="fabricLamination">Fabric Lamination</label>
  </div>

  <div className="ItemForm-checks">
    <input 
      className="ItemForm-check-input" 
      type="checkbox" 
      id="cuttingAndSlitting" 
      name="cuttingAndSlitting" 
      checked={BOPP.cuttingAndSlitting.jobInfo.checked} 
      onChange={(e) => handleInputChange('cuttingAndSlitting', 'jobInfo', e.target.checked, 'checked')}  
    />
    <label className="ItemForm-check-label" htmlFor="cuttingAndSlitting">Cutting and Slitting</label>
  </div>
</div>

</div>
<hr/>
<br/><br/><br/><br/>
  <div className='ItemForm-Starting2'>
  {BOPP.printing.jobInfo.checked && (
  <>
    <div className="ItemForm-Job">
      <h2>Printing</h2>
      <br />
      <div className="ItemForm-Job-Fields">
     
        <>
        <CustomInput section="printing" field="sizeMic" label="Size x Mic" BOPP={BOPP} handleInputChange={handleInputChange} />
        <CustomSelect section="printing" field="materialType" label="Material Type" options={BOPPoptions?.find(opt => opt.name === "Printing Material Type")?.options || []} BOPP={BOPP} handleInputChange={handleInputChange} />
        <CustomSelect section="printing" field="cylinder" label="Cylinder" options={["Old", "New"]} BOPP={BOPP} handleInputChange={handleInputChange} />
        <CustomSelect section="printing" field="cylinderDirection" label="Cylinder Direction" options={["Reverse", "Straight"]} BOPP={BOPP} handleInputChange={handleInputChange} />
        <CustomSelect section="printing" field="numberOfColours" label="Number of Colours" options={Array.from({ length: 10 }, (_, i) => i)} BOPP={BOPP} handleInputChange={handleInputChange} />
        <CustomInput section="printing" field="colourNames" label="Colour Names (comma separated)" type="text" BOPP={BOPP} handleInputChange={handleInputChange} />
        <br />
        </>
        </div>
        <br />
        <RemarkCheck section="printing" label="Printing Remark" BOPP={BOPP} handleInputChange={handleInputChange} />
    </div>
    <hr />
  </>
)}

{BOPP.inspection1.jobInfo.checked && (
  <>
    <div className="ItemForm-Job">
      <h2>Inspection 1</h2>
      <br />
      <RemarkCheck section="inspection1" label="Inspection1 Remark" BOPP={BOPP} handleInputChange={handleInputChange}/>
    </div>
    <hr />
  </>
)}

{BOPP.lamination.jobInfo.checked && (
  <>
    <div className="ItemForm-Job">
    <h2>Lamination</h2>
<br />
<div className="ItemForm-Job-Fields">
  <CustomInput 
    section="lamination" 
    field="sizeMic" 
    label="Size x Mic" 
    BOPP={BOPP} 
    handleInputChange={handleInputChange} 
  />

  <CustomSelect 
    section="lamination" 
    field="type" 
    label="Lamination Type" 
    options={BOPPoptions?.find(opt => opt.name === "Lamination Type")?.options || []} 
    BOPP={BOPP} 
    handleInputChange={handleInputChange} 
  />
</div>

    <br />
    <RemarkCheck section="lamination" label="Lamination Remark" BOPP={BOPP} handleInputChange={handleInputChange} />

    </div>
    <hr />
  </>
)}

{BOPP.inspection2.jobInfo.checked && (
  <>
    <div className="ItemForm-Job">
      <h2>Inspection 2</h2>
      <br />
      <RemarkCheck section="inspection2" label="Inspection2 Remark" BOPP={BOPP} handleInputChange={handleInputChange}/>
    </div>
    <hr />
  </>
)}

{BOPP.slitting.jobInfo.checked && (
  <>
    <div className="ItemForm-Job">
      <h2>Slitting</h2>
      <br />
      <RemarkCheck section="slitting" label="Slitting Remark" BOPP={BOPP} handleInputChange={handleInputChange}/>
    </div>
    <hr />
  </>
)}

{BOPP.fabricLamination.jobInfo.checked && (
  <>
    <div className="ItemForm-Job">
      <h2>Fabric Lamination</h2>
      <br />
      <div className="ItemForm-Job-Fields">
  <CustomInput section="fabricLamination" field="size" label="Size" BOPP={BOPP} handleInputChange={handleInputChange} />
  <CustomSelect section="fabricLamination" field="materialType" label="Material Type" options={BOPPoptions.find(opt => opt.name === "Fabric Lamination Material Types")?.options || []} BOPP={BOPP} handleInputChange={handleInputChange} />
  <CustomSelect section="fabricLamination" field="sides" label="Sides" options={BOPPoptions.find(opt => opt.name === "Fabric Lamination Sides")?.options || []} BOPP={BOPP} handleInputChange={handleInputChange} />
  <CustomSelect section="fabricLamination" field="Trimming" label="Trimming" options={[false, true]} BOPP={BOPP} handleInputChange={handleInputChange} />

</div>
<br />
<RemarkCheck section="fabricLamination" label="Fabric Lamination Remark" BOPP={BOPP} handleInputChange={handleInputChange} />
    </div>
    <hr />
  </>
)}

{BOPP.cuttingAndSlitting.jobInfo.checked && (
  <>
    <div className="ItemForm-Job">
      <h2>Cutting And Slitting</h2>
      <br />
<div className="ItemForm-Job-Fields">
  <CustomSelect section="cuttingAndSlitting" field="stitching" label="Stitching" options={[false, true]} BOPP={BOPP} handleInputChange={handleInputChange} />
  <CustomSelect section="cuttingAndSlitting" field="perforation" label="Perforation" options={[false, true]} BOPP={BOPP} handleInputChange={handleInputChange} />
  <CustomInput section="cuttingAndSlitting" field="treadColour" label="Tread Colour" BOPP={BOPP} handleInputChange={handleInputChange} />
  <CustomSelect section="cuttingAndSlitting" field="handleType" label="Handle Type" options={BOPPoptions.find(opt => opt.name === "Cutting and Slitting Handle Types")?.options || []} BOPP={BOPP} handleInputChange={handleInputChange} />
  <CustomInput section="cuttingAndSlitting" field="handleColour" label="Handle Colour" BOPP={BOPP} handleInputChange={handleInputChange} />
  <CustomSelect section="cuttingAndSlitting" field="packing" label="Packing" options={[false, true]} BOPP={BOPP} handleInputChange={handleInputChange} />
</div>
<br />
<RemarkCheck section="cuttingAndSlitting" label="Cutting And Slitting Remark" BOPP={BOPP} handleInputChange={handleInputChange} />
    </div>
    <hr />
  </>
)}


</div>
<div
  className="BOPPsubmit"
  style={{
    display: "flex",
    justifyContent: "center",
  }}
>
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
</div>

    </form>

  
        </div></>) : activeTab === "PET" ? 
        (<>

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
        <div className="ItemForm-container">
          <form className='ItemForm-reg-form'>
        <div className='ItemForm-Starting'>
          <div className='ItemForm-ItemInfo'>
            <div className='ItemForm-Search-container'>

            </div>
            <div className='ItemForm-Search-container'>

            </div>
            <div className='ItemForm-Job-Fields'>
              <div className='ItemForm-Job-input'>{/*Label and input tags */}</div>
              <div className='ItemForm-Job-input'>{/*Label and input tags */}</div>
              <div className='ItemForm-Job-input'>{/*Label and input tags */}</div>

              <div className='ItemForm-Job-select'>{/*Label and select tags */}</div>
              <div className='ItemForm-Job-select'>{/*Label and select tags */}</div>
              <div className='ItemForm-Job-select'>{/*Label and select tags */}</div>

            </div>
            <div className='ItemForm-Image-container'>
            </div>
            <div className='ItemForm-Job-remarkcheck'>
              {/*Input and label */}
              <div className='ItemForm-Job-Textbox'></div>
            </div>
          </div>

          <div className='ItemForm-Process'>
            <div className='ItemForm-checks'></div>
            <div className='ItemForm-checks'></div>
            <div className='ItemForm-checks'></div>

          </div>
        </div>
        <div className='ItemForm-Starting2'>
          <div className='ItemForm-Job'>
          <div className='ItemForm-Job-Fields'>
              <div className='ItemForm-Job-input'>{/*Label and input tags */}</div>
              <div className='ItemForm-Job-input'>{/*Label and input tags */}</div>
              <div className='ItemForm-Job-input'>{/*Label and input tags */}</div>

              <div className='ItemForm-Job-select'>{/*Label and select tags */}</div>
              <div className='ItemForm-Job-select'>{/*Label and select tags */}</div>
              <div className='ItemForm-Job-select'>{/*Label and select tags */}</div>

            </div>
              <div className='ItemForm-Job-remarkcheck'>
              {/*Input and label */}
              <div className='ItemForm-Job-Textbox'></div>
            </div>
          </div>
          <div className='ItemForm-Job'>
            <div className='ItemForm-Job-Fields'>
              </div>
              <div className='ItemForm-Job-remarkcheck'>
              {/*Input and label */}
              <div className='ItemForm-Job-Textbox'></div>
            </div>
          </div>
          <div className='ItemForm-Job'>
          <div className='ItemForm-Job-Fields'>
              <div className='ItemForm-Job-input'>{/*Label and input tags */}</div>
              <div className='ItemForm-Job-input'>{/*Label and input tags */}</div>
              <div className='ItemForm-Job-input'>{/*Label and input tags */}</div>

              <div className='ItemForm-Job-select'>{/*Label and select tags */}</div>
              <div className='ItemForm-Job-select'>{/*Label and select tags */}</div>
              <div className='ItemForm-Job-select'>{/*Label and select tags */}</div>

            </div>
              <div className='ItemForm-Job-remarkcheck'>
              {/*Input and label */}
              <div className='ItemForm-Job-Textbox'></div>
            </div>
            
          </div>
          <div className='ItemForm-Job'>
            <div className='ItemForm-Job-Fields'>
              </div>
              <div className='ItemForm-Job-remarkcheck'>
              {/*Input and label */}
              <div className='ItemForm-Job-Textbox'></div>
            </div>
          </div>
          <div className='ItemForm-Job'>
          <div className='ItemForm-Job-Fields'>
              <div className='ItemForm-Job-input'>{/*Label and input tags */}</div>
              <div className='ItemForm-Job-input'>{/*Label and input tags */}</div>
              <div className='ItemForm-Job-input'>{/*Label and input tags */}</div>

              <div className='ItemForm-Job-select'>{/*Label and select tags */}</div>
              <div className='ItemForm-Job-select'>{/*Label and select tags */}</div>
              <div className='ItemForm-Job-select'>{/*Label and select tags */}</div>

            </div>
              <div className='ItemForm-Job-remarkcheck'>
              {/*Input and label */}
              <div className='ItemForm-Job-Textbox'></div>
            </div>
          </div>
          <div className='ItemForm-Job'>
          <div className='ItemForm-Job-Fields'>
              <div className='ItemForm-Job-input'>{/*Label and input tags */}</div>
              <div className='ItemForm-Job-input'>{/*Label and input tags */}</div>
              <div className='ItemForm-Job-input'>{/*Label and input tags */}</div>

              <div className='ItemForm-Job-select'>{/*Label and select tags */}</div>
              <div className='ItemForm-Job-select'>{/*Label and select tags */}</div>
              <div className='ItemForm-Job-select'>{/*Label and select tags */}</div>

            </div>
              <div className='ItemForm-Job-remarkcheck'>
              {/*Input and label */}
              <div className='ItemForm-Job-Textbox'></div>
            </div>
          </div>

</div>


        </form>

       





        </div>
            </> ) : (
        <><div className="ItemForm-container">
        Select BOPP Or PET
        
        
        
        </div></> 
      )}
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


export default AddItemModal;
