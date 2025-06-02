import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  getDoc
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase';
import './discussion.css';
import './popup.css';
import Popup from './popup.jsx';


const Discussion = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [discussions, setDiscussions] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [authorNames, setAuthorNames] = useState({});

  const auth = getAuth();
  const user = auth.currentUser;

  const filters = ['All', 'Treatment', 'Tips', 'Stories', 'Reviews', 'Questions'];

  const handleNewPostClick = () => {
    if (!user || user.isAnonymous) {
      alert('Please sign in to create a new post.');
      return;
    }
    setShowPopup(true);
  };

  const handlePopupCancel = () => {
    setShowPopup(false);
  };

  const handlePopupConfirm = async (postData) => {
    try {
      await addDoc(collection(db, 'discussions'), {
        title: postData.title,
        content: postData.content,
        authorId: user.uid,
        replies: 0,
        tag: postData.category,
        timestamp: serverTimestamp()
      });
      setShowPopup(false);
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Failed to post discussion. Please try again later.');
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'discussions'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setDiscussions(posts);

      const authorIds = [...new Set(posts.map((post) => post.authorId).filter(Boolean))];
      const nameMap = {};

      for (const uid of authorIds) {
        try {
          const docSnap = await getDoc(doc(db, 'profiles', uid));
          if (docSnap.exists()) {
            nameMap[uid] = docSnap.data().name || 'Anonymous';
          }
        } catch (err) {
          nameMap[uid] = 'Anonymous';
        }
      }

      setAuthorNames(nameMap);
    });

    return () => unsubscribe();
  }, []);

  const filteredDiscussions = discussions.filter((d) => {
    const matchesFilter = activeFilter === 'All' || d.tag === activeFilter;
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      <div className={showPopup ? 'blur-container blur-filter' : 'blur-container'}>
        <main className="forum">
          <h1>Discussion Forum</h1>
          <p>
            Connect with others, share experiences, and find support in your OSAS
            management
          </p>

          <div className="filters">
            {filters.map((filter) => (
              <button
                key={filter}
                className={`filter ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="search-bar">
            <input 
            type="text"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
            <button onClick={() => setSearchQuery(searchQuery)}>Search</button>
          </div>

          <button
            className="new-post"
            onClick={handleNewPostClick}
            disabled={!user || user.isAnonymous}
            title={!user || user.isAnonymous ? 'Sign in to create a new post' : ''}
          >
            + New Post
          </button>

          {!user || user.isAnonymous ? (
            <p style={{ color: '#c00', marginTop: '1rem' }}>
              Guests cannot post. Please sign in to participate.
            </p>
          ) : null}

          <section className="discussions">
            <h2>
              {activeFilter === 'All' ? 'Recent Discussions' : `${activeFilter} Discussions`}
            </h2>
            {filteredDiscussions.map((discussion) => {
              const formattedDate = discussion.timestamp
                ? discussion.timestamp.toDate().toLocaleString()
                : 'Just now';

              return (
                <Link
                  to={`/post/${discussion.id}`}
                  key={discussion.id}
                  className="discussions-Link"
                >
                  <h3>{discussion.title}</h3>
                  <p>
                    Posted by{' '}
                    {authorNames[discussion.authorId] || 'Loading...'} ·{' '}
                    {discussion.replies || 0} replies · Most recent: {formattedDate}
                  </p>
                  <span className="tag">{discussion.tag}</span>
                </Link>
              );
            })}
          </section>
        </main>
      </div>

      {showPopup && (
        <Popup onConfirm={handlePopupConfirm} onCancel={handlePopupCancel} />
      )}
    </div>
  );
};

export default Discussion;
