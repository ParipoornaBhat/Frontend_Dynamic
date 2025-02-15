import React, { useState, useEffect, useRef } from 'react';
import './addItem.css';
import Highlight from 'react-highlight-words';
import styled from 'styled-components';
import ManageUserError from '../other/ErrorMessage'; // Import the ErrorMessage component
import ManageUserSuccess from '../other/SuccessMessage'; // Import the ErrorMessage component
import SettingModal from './SettingModal';
import axios from 'axios';
import './addItem.css'


const AddItems = () => {
    const [activeTab, setActiveTab] = useState('BOPP');
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

    const [BOPP, setBOPP] = useState({
        itemInfo: {
            itemId:null,
            itemType: null,
            itemImages:null ,
            description:null ,
            nameAndCommodity:null,
            millAddress:null ,
            agentCustomerName:null,
            GMS: null
          },
        printing: { jobInfo: { 
                        position:1,
                        checked: false ,
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
                            checked: false ,
                            remarksChecked:false,
                            Remarks:"",
                        }, 
    },
        lamination: {   jobInfo: { 
                            position:3,
                            checked: false ,
                            remarksChecked:false,
                            Remarks:"",
                        },
                        sizeMic:"",
                        type:"",
       
    },
        inspection2: { 
                    jobInfo: { 
                        position:4,
                        checked: false ,
                        remarksChecked:false,
                        Remarks:"",
                    }, 

    },
        slitting: { jobInfo: { 
                        position:5,
                        checked: false ,
                        remarksChecked:false,
                        Remarks:"",
                    }, 
    },
        fabricLamination: { jobInfo: { 
                                position:6,
                                checked: false ,
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
                                    checked: false ,
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

    setSuccessMessage('Options loaded successfully.'); // Set success message
  } catch (error) {
    // Handle error: if there's an issue with the request
    setErrorMessage(error.response?.data?.message || 'Failed to load options.');
  }
};

    
      // Effect hook to call fetchformoptions when the component mounts
     


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
        if (!isOptionsFetched) {
          fetchformoptions(); // Fetch the data only when isOptionsFetched is false
        }
      }, [isOptionsFetched]);

  return (<>
  
       
        <div className="manageusers-container">
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
        <button           
      className='manageuser-active-tab' 
      onClick={handleEditClick}>Edit Options</button>
        </div>
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


        {isLoading && <div className="manageusers-loading">Loading users...</div>}
        
        
        
        
        {activeTab === "BOPP" ? 
        (<>
        <div className="ItemForm-container">
<div className="ItemForm-OrderInfo">
            


</div>  <form className="ItemFrom-reg-form" >

      <div className='ItemForm-Process'>
  <h1>Process Involved</h1>

  <div className="ItemForm-checks">
    <input 
        className="ItemForm-check-input" 
        type="checkbox" 
        name="printingcheck" 
        checked={BOPP.printing.jobInfo.checked} onChange={(e) => handleInputChange('printing', 'jobInfo', e.target.checked, 'checked')}  
    />
    <label className="ItemForm-check-label">Printing</label>
  </div>
  <div className="ItemForm-checks">
  <input 
    className="ItemForm-check-input" 
    type="checkbox" 
    name="inspection1" 
    checked={BOPP.inspection1.jobInfo.checked} 
    onChange={(e) => handleInputChange('inspection1', 'jobInfo', e.target.checked, 'checked')} 
  />
  <label className="ItemForm-check-label">Inspection1</label>
</div>

<div className="ItemForm-checks">
  <input 
    className="ItemForm-check-input" 
    type="checkbox" 
    name="lamination" 
    checked={BOPP.lamination.jobInfo.checked} 
    onChange={(e) => handleInputChange('lamination', 'jobInfo', e.target.checked, 'checked')} 
  />
  <label className="ItemForm-check-label">Lamination</label>
</div>

<div className="ItemForm-checks">
  <input 
    className="ItemForm-check-input" 
    type="checkbox" 
    name="inspection2" 
    checked={BOPP.inspection2.jobInfo.checked} 
    onChange={(e) => handleInputChange('inspection2', 'jobInfo', e.target.checked, 'checked')} 
  />
  <label className="ItemForm-check-label">Inspection2</label>
</div>
<div className="ItemForm-checks">
  <input 
    className="ItemForm-check-input" 
    type="checkbox" 
    name="slitting" 
    checked={BOPP.slitting.jobInfo.checked} 
    onChange={(e) => handleInputChange('slitting', 'jobInfo', e.target.checked, 'checked')} 
  />
  <label className="ItemForm-check-label">Slitting</label>
</div>


<div className="ItemForm-checks">
  <input 
    className="ItemForm-check-input" 
    type="checkbox" 
    name="fabricLamination" 
    checked={BOPP.fabricLamination.jobInfo.checked} 
    onChange={(e) => handleInputChange('fabricLamination', 'jobInfo', e.target.checked, 'checked')} 
  />
  <label className="ItemForm-check-label">Fabric Lamination</label>
</div>

<div className="ItemForm-checks">
  <input 
    className="ItemForm-check-input" 
    type="checkbox" 
    name="cuttingAndSlitting" 
    checked={BOPP.cuttingAndSlitting.jobInfo.checked} 
    onChange={(e) => handleInputChange('cuttingAndSlitting', 'jobInfo', e.target.checked, 'checked')} 
  />
  <label className="ItemForm-check-label">Cutting and Slitting</label>
</div>
</div>
<hr/>

  
  {
  BOPP.printing.jobInfo.checked && ( 
  <>
  {/*   printing: { jobInfo: { 
                        position:1,
                        checked: false ,
                        remarksChecked:false,
                        Remarks:"",
                    },
                    sizeMic:"",
                    materialType:"",
                    cylinder:"",
                    numberOfColours:0,
                    colourNames:[],
                    cylinderDirection:"", */}

        
        
        <h2>Printing</h2><br/>
        <div className='ItemForm-Job'>
        <>
        <div className='ItemForm-Job-input'>
    <label className="ItemForm-form-label">Size x Mic : </label>
              <input
                type="text"
                name="sizeMic"
                value={BOPP.printing.sizeMic}
                onChange={(e) => handleInputChange('printing', 'sizeMic', e.target.value )}
                className="ItemForm-form-input"
              />
    </div>
    <div className='ItemForm-Job-input'>
    <label className="ItemForm-form-label">Material Type : </label>
              
              <select
                
                onChange={(e) => handleInputChange('printing', 'materialType', e.target.value )}
                className="ItemForm-form-select"
              >
                {BOPPoptions && BOPPoptions.find(option => option.name === "Printing Material Type") && 
    BOPPoptions.find(option => option.name === "Printing Material Type").options.map((option, index) => (
      <option key={index} value={option}>
        {option}
      </option>))}
              </select>
    </div>
    <div className='ItemForm-Job-select'>
    <label className="ItemForm-form-label">Cylinder : </label>
            <select
                
                onChange={(e) => handleInputChange('printing', 'cylinder', e.target.value )}
                className="ItemForm-form-select"
              >
                <option value="Old">Old</option>
                <option value="New">New</option>
              </select>
    </div>
    <div className='ItemForm-Job-select'>
    <label className="ItemForm-form-label">Cylinder Direction</label>
              
               <select
                
                onChange={(e) => handleInputChange('printing', 'cylinderDirection', e.target.value )}
                className="ItemForm-form-select"
              >
                <option value="Reverse" >Reverse</option>
                <option value="Straigth">Straigth</option>
              </select>
    </div>

    <div className='ItemForm-Job-select'>
    <label className="ItemForm-form-label">Number of Colours : </label>
    <select
        name="numberOfColours"
        value={BOPP.printing.numberOfColours || 0}
        onChange={(e) => handleInputChange('printing', 'numberOfColours', e.target.value )}
        className="ItemForm-form-input"
    >
        {Array.from({ length: 10 }, (_, i) => (
            <option key={`A-${i}`} value={i}>{i}</option>
        ))}
    </select>
    </div>
    
    <div className='ItemForm-Job-input'>
    <label className="ItemForm-form-label">Colour Names (comma separated) : </label>
              <input
                type="text"
                name="colourNames"
                value={BOPP.printing.colourNames.join(',')}
                onChange={(e) => handleInputChange('printing', 'colourNames', e.target.value.split(',')) }
                className="ItemForm-form-input"
              />
    </div>
    
            </>
    <br/>
    <div className='ItemForm-Job-remarkcheck'>
        <input 
            className="ItemForm-Job-remark-inputcheck" 
            type="checkbox" 
            name="printingremarkcheck" 
            checked={BOPP.printing.jobInfo.remarksChecked}
            onChange={(e) => handleInputChange('printing', 'jobInfo', e.target.checked, 'remarksChecked')} 
        />
        <label className="ItemForm-Job-remark-label">Printing Remark</label>
        {
  BOPP.printing.jobInfo.remarksChecked && (
    <div className='ItemForm-Job-textbox'>
        <textarea
            name="printingRemarks"
            value={BOPP.printing.jobInfo.Remarks}
            onChange={(e) => handleInputChange('printing', 'jobInfo', e.target.checked, 'Remarks')} 
            className="ItemForm-Job-remark-textarea"
        />
</div>
  )
}
     </div>

    </div>
    <hr/></>)
}

{
  BOPP.inspection1.jobInfo.checked && (<>
    {/*    inspection1: { jobInfo: { 
                        position:2,
                        checked: false ,
                        remarksChecked:false,
                        Remarks:"",
                    },  */}
            <h2>inspection1</h2>

      <div className='ItemForm-Job'>
      <br/>
      <div className='ItemForm-Job-remarkcheck'>
          <input 
              className="ItemForm-Job-remark-inputcheck" 
              type="checkbox" 
              name="inspection1remarkcheck" 
              checked={BOPP.inspection1.jobInfo.remarksChecked}
              onChange={(e) => handleInputChange('inspection1', 'jobInfo', e.target.checked, 'remarksChecked')} 
          />
          <label className="ItemForm-Job-remark-label">inspection1 Remark</label>
          {
    BOPP.inspection1.jobInfo.remarksChecked && (
      <div className='ItemForm-Job-textbox'>
          <textarea
              name="inspection1Remarks"
              value={BOPP.inspection1.jobInfo.Remarks}
              onChange={(e) => handleInputChange('inspection1', 'jobInfo', e.target.checked, 'Remarks')} 
              className="ItemForm-Job-remark-textarea"
          />
  </div>
    )
  }
       </div>
  
      </div>
      <hr/></>)
}

{
  BOPP.lamination.jobInfo.checked && (<>
    {/*   lamination: {   jobInfo: { 
                            position:3,
                            checked: false ,
                            remarksChecked:false,
                            Remarks:"",
                        },
                        sizeMic:"",
                        type:"",
                         */}
  
   
          
          
          <h2>lamination</h2><br/>
          <div className='ItemForm-Job'>
          <>
          <div className='ItemForm-Job-input'>
      <label className="ItemForm-form-label">Size x Mic : </label>
                <input
                  type="text"
                  name="laminationsizeMic"
                  value={BOPP.lamination.sizeMic}
                  onChange={(e) => handleInputChange('lamination', 'sizeMic', e.target.value )}
                  className="ItemForm-form-input"
                />
      </div>
      
      <div className='ItemForm-Job-select'>
      <label className="ItemForm-form-label">Type : </label>
              <select
                  onChange={(e) => handleInputChange('lamination', 'type', e.target.value )}
                  className="ItemForm-form-select"
                >
                  {BOPPoptions && BOPPoptions.find(option => option.name === "Lamination Type") && 
                  BOPPoptions.find(option => option.name === "Lamination Type").options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>))}
                </select>
      </div>
      
              </>
      <br/>
      <div className='ItemForm-Job-remarkcheck'>
          <input 
              className="ItemForm-Job-remark-inputcheck" 
              type="checkbox" 
              name="laminationremarkcheck" 
              checked={BOPP.lamination.jobInfo.remarksChecked}
              onChange={(e) => handleInputChange('lamination', 'jobInfo', e.target.checked, 'remarksChecked')} 
          />
          <label className="ItemForm-Job-remark-label">lamination Remark</label>
          {
    BOPP.lamination.jobInfo.remarksChecked && (
      <div className='ItemForm-Job-textbox'>
          <textarea
              name="laminationRemarks"
              value={BOPP.lamination.jobInfo.Remarks}
              onChange={(e) => handleInputChange('lamination', 'jobInfo', e.target.checked, 'Remarks')} 
              className="ItemForm-Job-remark-textarea"
          />
  </div>
    )
  }
       </div>
  
      </div>
      <hr/></>)
}

{
  BOPP.inspection2.jobInfo.checked && (<>
    {/*   inspection2: { 
                    jobInfo: { 
                        position:4,
                        checked: false ,
                        remarksChecked:false,
                        Remarks:"",
                    }, 
                     */}
            <h2>inspection2</h2>

      <div className='ItemForm-Job'>
      <br/>
      <div className='ItemForm-Job-remarkcheck'>
          <input 
              className="ItemForm-Job-remark-inputcheck" 
              type="checkbox" 
              name="inspection2remarkcheck" 
              checked={BOPP.inspection2.jobInfo.remarksChecked}
              onChange={(e) => handleInputChange('inspection2', 'jobInfo', e.target.checked, 'remarksChecked')} 
          />
          <label className="ItemForm-Job-remark-label">inspection2 Remark</label>
          {
    BOPP.inspection2.jobInfo.remarksChecked && (
      <div className='ItemForm-Job-textbox'>
          <textarea
              name="inspection2Remarks"
              value={BOPP.inspection2.jobInfo.Remarks}
              onChange={(e) => handleInputChange('inspection2', 'jobInfo', e.target.checked, 'Remarks')} 
              className="ItemForm-Job-remark-textarea"
          />
  </div>
    )
  }
       </div>
  
      </div>
      <hr/></>)
}
{
  BOPP.slitting.jobInfo.checked && (<>
    {/*   slitting: { jobInfo: { 
                        position:5,
                        checked: false ,
                        remarksChecked:false,
                        Remarks:"",
                    }, 
    
        
        
                         */}
  
      
          
          
          <h2>slitting</h2><br/>
          <div className='ItemForm-Job'>
      <br/>
      <div className='ItemForm-Job-remarkcheck'>
          <input 
              className="ItemForm-Job-remark-inputcheck" 
              type="checkbox" 
              name="slittingremarkcheck" 
              checked={BOPP.slitting.jobInfo.remarksChecked}
              onChange={(e) => handleInputChange('slitting', 'jobInfo', e.target.checked, 'remarksChecked')} 
          />
          <label className="ItemForm-Job-remark-label">slitting Remark</label>
          {
    BOPP.slitting.jobInfo.remarksChecked && (
      <div className='ItemForm-Job-textbox'>
          <textarea
              name="slittingRemarks"
              value={BOPP.slitting.jobInfo.Remarks}
              onChange={(e) => handleInputChange('slitting', 'jobInfo', e.target.checked, 'Remarks')} 
              className="ItemForm-Job-remark-textarea"
          />
  </div>
    )
  }
       </div>
  
      </div>
      <hr/></>)
}


{
  BOPP.fabricLamination.jobInfo.checked && (<>
    {/*   fabricLamination: { jobInfo: { 
                                position:6,
                                checked: false ,
                                remarksChecked:false,
                                Remarks:"",
                            }, 
                            size:"",
                            materialType:"",
                            sides:"",
                            Trimming:false,
                        },
     */}
  
      
          <h2>fabricLamination</h2><br/>
          <div className='ItemForm-Job'>
          <>
          <div className='ItemForm-Job-input'>
      <label className="ItemForm-form-label">Size : </label>
                <input
                  type="text"
                  name="fabricLaminationsize"
                  value={BOPP.fabricLamination.size}
                  onChange={(e) => handleInputChange('fabricLamination', 'size', e.target.value )}
                  className="ItemForm-form-input"
                />
      </div>
     
      <div className='ItemForm-Job-select'>
      <label className="ItemForm-form-label">materialType : </label>
              <select
                  value={BOPP.fabricLamination.materialType}
                  onChange={(e) => handleInputChange('fabricLamination', 'materialType', e.target.value )}
                  className="ItemForm-form-select"
                >
                  {BOPPoptions && BOPPoptions.find(option => option.name === "Fabric Lamination Material Types") && 
                  BOPPoptions.find(option => option.name === "Fabric Lamination Material Types").options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>))}
                </select>
      </div>
      <div className='ItemForm-Job-select'>
      <label className="ItemForm-form-label">sides : </label>
              <select
                  value={BOPP.fabricLamination.sides}
                  onChange={(e) => handleInputChange('fabricLamination', 'sides', e.target.value )}
                  className="ItemForm-form-select"
                >
                  {BOPPoptions && BOPPoptions.find(option => option.name === "Fabric Lamination Sides") && 
                  BOPPoptions.find(option => option.name === "Fabric Lamination Sides").options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>))}
                </select>
      </div>
      <div className='ItemForm-Job-select'>
      <label className="ItemForm-form-label">Trimming : </label>
              <select
                  value={BOPP.fabricLamination.Trimming}
                  onChange={(e) => handleInputChange('fabricLamination', 'Trimming', e.target.value )}
                  className="ItemForm-form-select"
                >
                  <option value={false} >False</option>
                  <option value={true}>True</option>
                </select>
      </div>
      perforation??
      
      
              </>
      <br/>
      <div className='ItemForm-Job-remarkcheck'>
          <input 
              className="ItemForm-Job-remark-inputcheck" 
              type="checkbox" 
              name="fabricLaminationremarkcheck" 
              checked={BOPP.fabricLamination.jobInfo.remarksChecked}
              onChange={(e) => handleInputChange('fabricLamination', 'jobInfo', e.target.checked, 'remarksChecked')} 
          />
          <label className="ItemForm-Job-remark-label">fabricLamination Remark</label>
          {
    BOPP.fabricLamination.jobInfo.remarksChecked && (
      <div className='ItemForm-Job-textbox'>
          <textarea
              name="fabricLaminationRemarks"
              value={BOPP.fabricLamination.jobInfo.Remarks}
              onChange={(e) => handleInputChange('fabricLamination', 'jobInfo', e.target.checked, 'Remarks')} 
              className="ItemForm-Job-remark-textarea"
          />
  </div>
    )
  }
       </div>
  
      </div>
      <hr/></>)
}

{
  BOPP.cuttingAndSlitting.jobInfo.checked && (<>
    {/*   cuttingAndSlitting: {   jobInfo: { 
                                    position:7,
                                    checked: false ,
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
     */}
  
      
          
          
          <h2>cuttingAndSlitting</h2><br/>
          <div className='ItemForm-Job'>
          <>

          <div className='ItemForm-Job-select'>
      <label className="ItemForm-form-label">stiching : </label>
              <select
                  value={BOPP.cuttingAndSlitting.stiching}
                  onChange={(e) => handleInputChange('cuttingAndSlitting', 'stiching', e.target.value )}
                  className="ItemForm-form-select"
                >
                  <option value={false} >No</option>
                  <option value={true}>Yes</option>
                </select>
      </div>
      <div className='ItemForm-Job-select'>
      <label className="ItemForm-form-label">perforation : </label>
              <select
                  value={BOPP.cuttingAndSlitting.perforation}
                  onChange={(e) => handleInputChange('cuttingAndSlitting', 'perforation', e.target.value )}
                  className="ItemForm-form-select"
                >
                  <option value={false} >No</option>
                  <option value={true}>Yes</option>
                </select>
      </div>
      

          <div className='ItemForm-Job-input'>
      <label className="ItemForm-form-label">treadColour : </label>
                <input
                  type="text"
                  name="cuttingAndSlittingtreadColour"
                  value={BOPP.cuttingAndSlitting.treadColour}
                  onChange={(e) => handleInputChange('cuttingAndSlitting', 'treadColour', e.target.value )}
                  className="ItemForm-form-input"
                />
      </div>
      
     
      <div className='ItemForm-Job-select'>
      <label className="ItemForm-form-label">handleType : </label>
              <select
                  value={BOPP.cuttingAndSlitting.handleType}
                  onChange={(e) => handleInputChange('cuttingAndSlitting', 'handleType', e.target.value )}
                  className="ItemForm-form-select"
                >
                  {BOPPoptions && BOPPoptions.find(option => option.name === "Cutting and Slitting Handle Types") && 
                  BOPPoptions.find(option => option.name === "Cutting and Slitting Handle Types").options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>))}
                </select>
      </div>
      
      <div className='ItemForm-Job-input'>
      <label className="ItemForm-form-label">handleColour : </label>
                <input
                  type="text"
                  name="cuttingAndSlittinghandleColour"
                  value={BOPP.cuttingAndSlitting.handleColour}
                  onChange={(e) => handleInputChange('cuttingAndSlitting', 'handleColour', e.target.value )}
                  className="ItemForm-form-input"
                />
      </div>
      
      <div className='ItemForm-Job-select'>
      <label className="ItemForm-form-label">packing : </label>
              <select
                  value={BOPP.cuttingAndSlitting.packing}
                  onChange={(e) => handleInputChange('cuttingAndSlitting', 'packing', e.target.value )}
                  className="ItemForm-form-select"
                >
                  <option value={false} >No</option>
                  <option value={true}>Yes</option>
                </select>
      </div>
      
      
              </>
      <br/>
      <div className='ItemForm-Job-remarkcheck'>
          <input 
              className="ItemForm-Job-remark-inputcheck" 
              type="checkbox" 
              name="cuttingAndSlittingremarkcheck" 
              checked={BOPP.cuttingAndSlitting.jobInfo.remarksChecked}
              onChange={(e) => handleInputChange('cuttingAndSlitting', 'jobInfo', e.target.checked, 'remarksChecked')} 
          />
          <label className="ItemForm-Job-remark-label">cuttingAndSlitting Remark</label>
          {
    BOPP.cuttingAndSlitting.jobInfo.remarksChecked && (
      <div className='ItemForm-Job-textbox'>
          <textarea
              name="cuttingAndSlittingRemarks"
              value={BOPP.cuttingAndSlitting.jobInfo.Remarks}
              onChange={(e) => handleInputChange('cuttingAndSlitting', 'jobInfo', e.target.checked, 'Remarks')} 
              className="ItemForm-Job-remark-textarea"
          />
  </div>
    )
  }
       </div>
  
      </div>
      <hr/></>)
}



</form>

  
        </div></>) : activeTab === "PET" ? 
        (<>
        <div className="ItemForm">
        
        
        
        
            </div></> ) : (
        <><div className="ItemForm">
        Select BOPP Or PET
        
        
        
        </div></> 
      )}


        </div>
  </>)
}

export default AddItems;