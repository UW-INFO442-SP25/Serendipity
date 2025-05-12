import React from 'react'
// import all of your page files Home.jsx
import Home from './components/Home/home.jsx';
import Login from './components/Home/login.jsx';
import Resources from './components/Home/resources.jsx';
import Discussion from './components/Home/discussion.jsx';
import Tracker from './components/Home/tracker.jsx';

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