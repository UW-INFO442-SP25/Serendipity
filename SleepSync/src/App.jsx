import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './Components/Home/navbar.jsx';
import Home from './Components/Home/home.jsx';
import Login from './Components/Home/login.jsx';
import Resources from './Components/Home/resources.jsx';
import Discussion from './Components/Home/discussion.jsx';
import Tracker from './Components/Home/tracker.jsx';
import Profile from './Components/Home/profile.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Login page (no Navbar) */}
        <Route path="/login" element={<Login />} />

        {/* Main pages */}
        <Route path="/home" element={<><Navbar /><Home /></>} />
        <Route path="/resources" element={<><Navbar /><Resources /></>} />
        <Route path="/discussion" element={<><Navbar /><Discussion /></>} />
        <Route path="/tracker" element={<><Navbar /><Tracker /></>} />
        <Route path="/profile" element={<><Navbar /><Profile /></>} />

        {/* Fallback route: catch all invalid paths */}
        <Route path="*" element={<Navigate to="/profile" />} />
      </Routes>
    </Router>
  );
};

export default App;
