import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="navbar">
      <div className="logo">
        <NavLink to="/home">SleepSync</NavLink>
      </div>

      {/* Hamburger icon (☰) */}
      <div className="hamburger" onClick={toggleMenu}>
        ☰
      </div>

      <nav className={menuOpen ? 'show-menu' : ''}>
        <NavLink to="/home" onClick={() => setMenuOpen(false)}>Home</NavLink>
        <NavLink to="/resources" onClick={() => setMenuOpen(false)}>Resources</NavLink>
        <NavLink to="/discussion" onClick={() => setMenuOpen(false)}>Discussion Forum</NavLink>
        <NavLink to="/tracker" onClick={() => setMenuOpen(false)}>Behavior Tracker</NavLink>
        <NavLink to="/login" className="profile-icon" onClick={() => setMenuOpen(false)}>👤</NavLink>
      </nav>
    </header>
  );
};

export default Navbar;
