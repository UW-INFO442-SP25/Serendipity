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
  const newPost = {
    title: postData.title,
    author: "You", 
    replies: 0,
    recent: "Just now",
    tag: postData.category
  };

  setDiscussions(prev => [newPost, ...prev]);
  setShowPopup(false);
};

  // for button filtering
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Treatment", "Tips", "Stories", "Reviews", "Questions"];
  const [discussions, setDiscussions] = useState(() => {
  const saved = localStorage.getItem('discussions');
  return saved ? JSON.parse(saved) : [
    {
      title: "CPAP Mask Comfort Tips",
      author: "Sleepwell42",
      replies: 20,
      recent: "2 hours ago",
      tag: "Tips"
    },
    {
      title: "Tracking my Progress",
      author: "Breather34",
      replies: 4,
      recent: "Yesterday",
      tag: "Treatment"
    },
    {
      title: "ResMed vs. Philips? - which one do you prefer?",
      author: "CPAPwarrior1",
      replies: 16,
      recent: "2 days ago",
      tag: "Reviews"
    }
  ];
});
const filteredDiscussions = activeFilter === "All"
  ? discussions
  : discussions.filter((d) => d.tag === activeFilter);

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
  <h2>{activeFilter === "All" ? "Recent Discussions" : `${activeFilter} Discussions`}</h2>
  {filteredDiscussions.map((discussion, index) => (
    <div key={index} className="discussion">
      <h3>{discussion.title}</h3>
      <p>
        Posted by {discussion.author} · {discussion.replies} replies · Most recent: {discussion.recent}
      </p>
      <span className="tag">{discussion.tag}</span>
    </div>
  ))}
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
