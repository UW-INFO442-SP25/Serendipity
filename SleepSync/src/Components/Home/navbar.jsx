import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="logo">
        <NavLink to="/home">SleepSync</NavLink>
      </div>
      <nav>
        <NavLink to="/home">Home</NavLink>
        <NavLink to="/resources">Resources</NavLink>
        <NavLink to="/discussion">Discussion Forum</NavLink>
        <NavLink to="/tracker">Behavior Tracker</NavLink>
        <NavLink to="/login" className="profile-icon">👤</NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
