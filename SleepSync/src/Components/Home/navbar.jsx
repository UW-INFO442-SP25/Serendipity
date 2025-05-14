import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="logo">SleepSync</div>
      <nav>
        <a href="#">Home</a>
        <a href="#">Resources</a>
        <a href="#">Discussion Forum</a>
        <a href="#">Behavior Tracker</a>
        <span className="profile-icon">👤</span>
      </nav>
    </header>
  );
};

export default Navbar;