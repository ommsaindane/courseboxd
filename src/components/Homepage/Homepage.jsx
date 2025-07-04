import React from 'react';
import Navbar from '../Navbar/Navbar';

const Homepage = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const username = storedUser?.user?.username || "User";


  return (
    <div>
      <Navbar username={username} />
      <div style={{ padding: '20px' }}>
        <h1>Welcome to Courseboxd 🎓</h1>
        {/* Course Dashboard content here */}
      </div>
    </div>
  );
};

export default Homepage;