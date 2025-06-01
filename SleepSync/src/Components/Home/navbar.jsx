import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import TranslateToggle from './TranslateToggle';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, user => {
      setIsLoggedIn(!!user && !user.isAnonymous);
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <header className="navbar">
      <div className="logo">
        <NavLink to="/home" className="logo-link">
          SleepSync
        </NavLink>
      </div>

      <div className="hamburger" onClick={toggleMenu}>☰</div>

      <nav className={menuOpen ? 'show-menu' : ''}>
        <NavLink to="/home" onClick={() => setMenuOpen(false)}>Home</NavLink>
        <NavLink to="/resources" onClick={() => setMenuOpen(false)}>Resources</NavLink>
        <NavLink to="/discussion" onClick={() => setMenuOpen(false)}>Discussion Forum</NavLink>
        <NavLink to="/tracker" onClick={() => setMenuOpen(false)}>Behavior Tracker</NavLink>

        {isLoggedIn ? (
          <NavLink to="/profile" className="profile-icon" onClick={() => setMenuOpen(false)}>
            👤 Profile
          </NavLink>
        ) : (
          <NavLink to="/login" className="profile-icon" onClick={() => setMenuOpen(false)}>
            👤 Login
          </NavLink>
        )}
      </nav>

      <TranslateToggle />
    </header>
  );
};

export default Navbar;
