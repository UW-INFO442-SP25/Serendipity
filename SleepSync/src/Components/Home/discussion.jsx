import React, { useState } from 'react';
import './discussion.css';
import './popup.css';
import Popup from './popup.jsx';

// new post popup
const Discussion = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleNewPostClick = () => {
    setShowPopup(true);
  };

  const handlePopupCancel = () => {
    setShowPopup(false);
  };

  const handlePopupConfirm = (postData) => {
    alert("New post created:\n" + JSON.stringify(postData, null, 2));
    setShowPopup(false);
  };

  // for button filtering
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Treatment", "Tips", "Stories", "Reviews", "Questions"];

  return (
    <div>
      <div className={showPopup ? "blur-container blur-filter" : "blur-container"}>
        <main className="forum">
          <h1>Discussion Forum</h1>
          <p>Connect with others, share experiences, and find support in your OSAS management</p>
          
          <div className="filters">
  {filters.map((filter) => (
    <button
      key={filter}
      className={`filter ${activeFilter === filter ? "active" : ""}`}
      onClick={() => setActiveFilter(filter)}
    >
      {filter}
    </button>
  ))}
</div>

          <div className="search-bar">
            <input type="text" placeholder="Search discussions..." />
            <button>Search</button>
          </div>

          <button className="new-post" onClick={handleNewPostClick}>+ New Post</button>

          <section className="discussions">
            <h2>Recent Discussions</h2>
            <div className="discussion">
              <h3>CPAP Mask Comfort Tips</h3>
              <p>Posted by Sleepwell42 · 20 replies · Most recent: 2 hours ago</p>
              <span className="tag">Tips</span>
            </div>
            <div className="discussion">
              <h3>Tracking my Progress</h3>
              <p>Posted by Breather34 · 4 replies · Most recent: Yesterday</p>
              <span className="tag">Treatment</span>
            </div>
            <div className="discussion">
              <h3>ResMed vs. Philips? - which one do you prefer?</h3>
              <p>Posted by CPAPwarrior1 · 16 replies · Most recent: 2 days ago</p>
              <span className="tag">Reviews</span>
            </div>
          </section>
        </main>
      </div>

      {/* Modal popup */}
      {showPopup && (
        <Popup
          onConfirm={handlePopupConfirm}
          onCancel={handlePopupCancel}
        />
      )}
    </div>
  );
};

export default Discussion;
