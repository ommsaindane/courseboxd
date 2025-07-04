import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ username }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="navbar">
      <div className="navbar-left" onClick={() => navigate('/home')}>
        <h2 className="logo">Courseboxd</h2>
      </div>

      <div className="navbar-right">
        <div
          className="navbar-item username"
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          {username} ⌄
          {dropdownOpen && (
            <div className="dropdown">
            <div onClick={() => navigate('/profile')}>Profile</div>
            <div onClick={() => navigate('/my-courses')}>Courses</div>
            <div onClick={() => navigate('/watchlist')}>Watchlist</div>
            <div onClick={() => navigate('/my-reviews')}>Review</div>
            <div onClick={() => navigate('/activity')}>Activity</div>
            <div onClick={() => {
        localStorage.removeItem("user");
        navigate('/login');
            }}>Logout</div>
        </div>
        )}
        </div>

        <div className="navbar-item" onClick={() => navigate('/home')}>
          Home
        </div>

        <div className="navbar-item" onClick={() => alert('Search coming soon!')}>
          Search
        </div>

        <div className="navbar-item" onClick={() => navigate('/settings')}>
          Settings
        </div>
      </div>
    </div>
  );
};

export default Navbar;
