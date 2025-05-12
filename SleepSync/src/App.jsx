import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import all of your page files Home.jsx
import Home from './Components/Home/home.jsx';
import Login from './Components/Home/login.jsx';
import Resources from './Components/Home/resources.jsx';
import Discussion from './Components/Home/discussion.jsx';
import Tracker from './Components/Home/tracker.jsx';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/discussion" element={<Discussion/>} />
        </Routes>
      </Router> 
    </div>
  );
}

export default App; 