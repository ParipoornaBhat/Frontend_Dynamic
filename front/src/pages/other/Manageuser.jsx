import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaPlus, FaEllipsisV } from 'react-icons/fa';
import ManageUserError from './ErrorMessage'; // Import the ErrorMessage component
import '../../css/manageuser.css';
import defaultpic from '../../assets/default.png';
import ManageProfile from './manageProfile';
import RegisterModal from './RegisterModal';
import Highlight from 'react-highlight-words';
import styled from 'styled-components';

const ManageUsers = () => {
  const [activeTab, setActiveTab] = useState('Employee');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);  // Track which user's menu is open
  const [errorMessage, setErrorMessage] = useState(''); // Track error message
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isMProfileOpen, setIsProfileOpen] = useState(false);  
  const [isMProfileVisible, setIsProfileVisible] = useState(false);
  
  const handleMProfileToggle = () => {
    setIsProfileVisible(!isMProfileVisible);  // Toggle visibility for the profile
  };

  const toggleMProfile = () => {
    setIsProfileOpen(!isMProfileOpen);  // Toggle profile open/close state
  };

  const handleMenuToggle = (userId, e) => {
    e.stopPropagation();  // Prevent event propagation so that clicking inside the menu won't trigger outside click
    setMenuOpen(menuOpen === userId ? null : userId);  // Toggle menu visibility for the clicked user
  };

  const handleMProfileClick = (e) => {
    e.stopPropagation();  // Prevent the profile button click from closing the menu
    handleMProfileToggle();  // Toggle profile visibility for the selected user
  };

  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(null);  // Close the menu if clicked outside of it
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []); 

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Restore scrolling
      document.body.style.pointerEvents = "auto"; // Restore clicks
    }
  }, [isModalOpen]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  



  const token = localStorage.getItem('token');
  const currentUserId = localStorage.getItem('_id');
  const employeeRoles = JSON.parse(localStorage.getItem('employeeRoles')) || [];
  const userRoles = JSON.parse(localStorage.getItem('userRoles')) || [];
  const fetchUsers = async () => {
    setIsLoading(true);
    setLoadingMessage('Loading users...');
    const url =
      activeTab === 'Employee'
        ? `${import.meta.env.VITE_BASE_URL}/manage/GetAllEmployees`
        : `${import.meta.env.VITE_BASE_URL}/manage/GetAllUsers`;

    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setUsers([])
      setErrorMessage('Failed to load users.'); // Set error message
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  useEffect(() => {
    let sortedUsers = [...users];

    sortedUsers.sort((a, b) => {
      const nameA = `${a.fullName.firstName} ${a.fullName.lastName}`.toLowerCase();
      const nameB = `${b.fullName.firstName} ${b.fullName.lastName}`.toLowerCase();

      if (sortOption === 'name-asc') return nameA.localeCompare(nameB);
      if (sortOption === 'name-desc') return nameB.localeCompare(nameA);
      if (sortOption === 'role-asc') return a.role.localeCompare(b.role);
      if (sortOption === 'role-desc') return b.role.localeCompare(a.role);
      if (sortOption === 'date-asc') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortOption === 'date-desc') return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

    const filtered = sortedUsers.filter((user) => {
      const fullName = `${user.fullName.firstName} ${user.fullName.lastName}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase()) || user.phone.includes(searchQuery);
    });

    setFilteredUsers(filtered);
  }, [searchQuery, sortOption, users]);

// Keep the menuRef logic as is to manage the outside click listener for closing the menu






const handleDelete = async (user) => {
  // Prevent role change for the current logged-in user
  if (user._id === currentUserId) {
    setErrorMessage('You cannot Delete Your Own Profile!');
    return;
  }

  try {
    // Prepare the updates object for the role change
    const updates = { deleted: !(user.deleted) || false };

    // Create a FormData object to send the updates along with the userId
    const formData = new FormData();
    formData.append('_id', user._id);  // Pass the userId here
    formData.append('updates', JSON.stringify(updates));

    // Log the updates being sent for debugging purposes
    console.log("Sending Role Update: ", updates);

    // Make the API call to update the role
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/manage/anyProfileEdit`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Check if the response status is OK
    if (response.status === 200) {
      // Update the users list after the role change
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
      setErrorMessage('User role updated successfully!');
    } else {
      setErrorMessage('Failed to update user role.');
    }
    fetchUsers();
    // Clear the error message after 2 seconds
    setTimeout(() => {
      setErrorMessage('');
    }, 2000);

  } catch (error) {
    setErrorMessage('Error updating user role. Please try again later.');
    console.error('Error updating role:', error);
  }
};


useEffect(() => {
  const handleOutsideClick = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(null); // Close the menu if clicked outside
    }
  };

  // Remove this effect entirely, no need to listen for outside clicks anymore
  return () => document.removeEventListener('mousedown', handleOutsideClick);
}, []);


  

const handleRoleChange = async (userId, newRole) => {
  // Prevent role change for the current logged-in user
  if (userId === currentUserId) {
    setErrorMessage('You cannot change your own role!');
    return;
  }

  try {
    // Prepare the updates object for the role change
    const updates = { role: newRole };

    // Create a FormData object to send the updates along with the userId
    const formData = new FormData();
    formData.append('_id', userId);  // Pass the userId here
    formData.append('updates', JSON.stringify(updates));

    // Log the updates being sent for debugging purposes
    console.log("Sending Role Update: ", updates);

    // Make the API call to update the role
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/manage/anyProfileEdit`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Check if the response status is OK
    if (response.status === 200) {
      // Update the users list after the role change
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
      setErrorMessage('User role updated successfully!');
    } else {
      setErrorMessage('Failed to update user role.');
    }

    // Clear the error message after 2 seconds
    setTimeout(() => {
      setErrorMessage('');
    }, 2000);

  } catch (error) {
    setErrorMessage('Error updating user role. Please try again later.');
    console.error('Error updating role:', error);
  }
};



  const getRoles = () => (activeTab === 'Employee' ? employeeRoles : userRoles);

  





  return (


    <div className="manageusers-container">
      {/* Other components and JSX */}
      
      {/* Display error message if there's an error */}
      {errorMessage && (
        <ManageUserError errorMessage={errorMessage} onClose={() => setErrorMessage("")} />
      )}

      {/* Rest of your JSX */}
      <div className="manageusers-tabs">
        <button
          onClick={() => setActiveTab('Employee')}
          className={activeTab === 'Employee' ? 'manageuser-active-tab' : 'manageuser-inactive-tab'}
        >
          Employees
        </button>
        <button
          onClick={() => setActiveTab('User')}
          className={activeTab === 'User' ? 'manageuser-active-tab' : 'manageuser-inactive-tab'}
        >
          Users
        </button>
        <StyledWrapper>
  <button type="button" className="manageuser-1-button" onClick={openModal}>
    <span className="manageuser-1-button__text">
      Add {activeTab} {/* Display Add User or Add Employee based on activeTab */}
    </span>
    <span className="manageuser-1-button__icon">
      <svg xmlns="http://www.w3.org/2000/svg" width={24} viewBox="0 0 24 24" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" height={24} fill="none" className="manageuser-1-svg">
        <line y2={19} y1={5} x2={12} x1={12} />
        <line y2={12} y1={12} x2={19} x1={5} />
      </svg>
    </span>
  </button>
  {isModalOpen && <RegisterModal onClose={closeModal} activeTab={activeTab} />} {/* Pass activeTab to RegisterModal */}
</StyledWrapper>

      </div>

      <div className="manageusers-header">
        <input
          type="text"
          placeholder="Search by Name or Phone"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="manageusers-search"
        />
        <select
          onChange={(e) => setSortOption(e.target.value)}
          value={sortOption}
          className="manageusers-sort-dropdown"
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="role-asc">Role (A-Z)</option>
          <option value="role-desc">Role (Z-A)</option>
          <option value="date-asc">Date (Oldest)</option>
          <option value="date-desc">Date (Newest)</option>
        </select>
        

      </div>

      {isLoading && <div className="manageusers-loading">Loading users...</div>}
      

      <div className="manageusers-cards-container">
        {filteredUsers.map((user) => (
          <div key={user._id} className="manageusers-card">
            <div className="m-profile-pic">
            <img 
  src={user.profilePic || defaultpic} 
  alt="Profile" 
  className="manageuser-profile-pics" 
/>
            </div>

            <div className="manageusers-card-content">
              <h3>{/*`${user.fullName.firstName} ${user.fullName.lastName}`*/}
              <Highlight
                    searchWords={[searchQuery]}
                    autoEscape={true}
                    textToHighlight={`${user.fullName.firstName} ${user.fullName.lastName}`}
                  />
              </h3>
              <p className="manageuser-user-email">{user.email}</p>
              <p className="manageuser-user-phone"><Highlight
                    searchWords={[searchQuery]}
                    autoEscape={true}
                    textToHighlight={user.phone}
                  /></p>

              <select
                value={user.role}
                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                disabled={user._id === currentUserId}
                className="manageuser-role-dropdown"
              >
                {getRoles().map((role) => (
                  <option key={role.roleName} value={role.roleName}>
                    {role.roleName}
                  </option>
                ))}
              </select>
            </div>

            <div key={user._id} className="manageuser-menu-wrapper">
              <button
                className="manageusers-card-menu"
                onClick={(e) => handleMenuToggle(user._id, e)}
                              >
                <FaEllipsisV />
              </button>

              {menuOpen === user._id && (
                <>    
                  
                  
                  <div ref={menuRef}>
                  <div className="manageuser-dropdown-menu"  >
                  <button onClick={handleMProfileClick}>
                    👤 Profile
                  </button>
                

                    <button onClick={() => handleDelete(user)}>❌ Delete</button>
                    <button onClick={() => console.log('Order Items', user)}>📦 Order Items</button>
                    <button onClick={() => console.log('Order History', user)}>📜 Order History</button>
                    <button onClick={() => console.log('Notify', user)}>🔔 Notify</button>
                  </div>
                
                 
                    <ManageProfile
                        // Pass token
                      ID={`${user._id}`}
                      isVisible={isMProfileVisible}
                      onClose={() => setIsProfileVisible(false)}
                      
                      // Pass selected user ID
                    /></div>
                </>
              )}

            </div>
          </div>
        ))}
      </div>
      
      
   
  
  </div>
  );
};
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





export default ManageUsers;
