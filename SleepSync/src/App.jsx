import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Home/navbar.jsx';
import Home from './Components/Home/home.jsx';
import Login from './Components/Home/login.jsx';
import Resources from './Components/Home/resources.jsx';
import Discussion from './Components/Home/discussion.jsx';
import Tracker from './Components/Home/tracker.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Landing page (no navbar) */}
        <Route path="/login" element={<Login />} />

        <Route path="/home" element={
          <>
            <Navbar />
            <Home />
          </>
        } />
        <Route path="/resources" element={
          <>
            <Navbar />
            <Resources />
          </>
        } />
        <Route path="/discussion" element={
          <>
            <Navbar />
            <Discussion />
          </>
        } />
        <Route path="/tracker" element={
          <>
            <Navbar />
            <Tracker />
          </>
        } />
      </Routes>
    </Router>
  );
};


export default App;