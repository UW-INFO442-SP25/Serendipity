import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc, getDocs, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase'
import './discussion.css';
import './popup.css';
import Popup from './popup.jsx';


// new post popup
const Discussion = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [discussions, setDiscussions] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Treatment", "Tips", "Stories", "Reviews", "Questions"];
  

  const handleNewPostClick = () => {
    setShowPopup(true);
  };

  const handlePopupCancel = () => {
    setShowPopup(false);
  };

const handlePopupConfirm = async (postData) => {
  try {
  await addDoc(collection(db, "discussions"), {
    title: postData.title,
    content: postData.content,
    author: "You", // You can add real auth later
    replies: 0,
    tag: postData.category,
    timestamp: serverTimestamp()
  });
  setShowPopup(false);
} catch (error) {
  console.error("error adding document: ", error);
  alert("Failed to post discussion, Please try again later.");
}
};

  // for button filtering

useEffect(() => {
  const q = query(collection(db, "discussions"), orderBy("timestamp", "desc"));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setDiscussions(posts);
  });
  return () => unsubscribe(); // Cleanup listener
}, []);

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
  {filteredDiscussions.map((discussion) => {
    const formattedDate = discussion.timestamp
    ? discussion.timestamp.toDate().toLocaleString()
    : "Just now";

    return(
    <Link to={`/post/${discussion.id}`} key={discussion.id} className="discussions-Link">
    <h3>{discussion.title}</h3>
    <p>
      Posted by {discussion.author} · {discussion.replies || 0} replies · Most recent: {formattedDate}
    </p>
    <span className="tag">{discussion.tag}</span>
  </Link>
    );
})}
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