import React from 'react';
import './discussion.css';

const Discussion = () => {
  return (
    <div>
      <main className="forum">
        <h1>Discussion Forum</h1>
        <p>Connect with others, share experiences, and find support in your OSAS management</p>

        <div className="filters">
          <button className="filter active">All</button>
          <button className="filter">Treatment</button>
          <button className="filter">Tips</button>
          <button className="filter">Stories</button>
          <button className="filter">Reviews</button>
          <button className="filter">Questions</button>
        </div>

        <div className="search-bar">
          <input type="text" placeholder="Search discussions..." />
          <button>Search</button>
        </div>

        <button className="new-post">+ New Post</button>

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
            <h3>ResMed vs. Phillips? - which one do you prefer?</h3>
            <p>Posted by CPAPwarrier1 · 16 replies · Most recent: 2 days ago</p>
            <span className="tag">Reviews</span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Discussion;