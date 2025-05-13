import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home/home.jsx';
import Login from './Components/Home/login.jsx';
import Resources from './Components/Home/resources.jsx';
import Discussion from './Components/Home/discussion.jsx';
import Tracker from './Components/Home/tracker.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/discussion" element={<Discussion />} />
        <Route path="/tracker" element={<Tracker />} />
      </Routes>
    </Router>
  );
};

export default App;