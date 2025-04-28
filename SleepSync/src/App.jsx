import React from 'react'
// import all of your page files Home.jsx
import Home from './components/Home/home.js';
import Home from './components/Home/login.js';
import Home from './components/Home/resources.js';
import Home from './components/Home/discussion.js';
import Home from './components/Home/tracker.js';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
        {/* <Route path="/Home" element={<Home/>} /> */}

        </Routes>
      </Router> 
    </div>
  );

}

export default App