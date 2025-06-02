import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc,increment,getDoc,updateDoc, collection, addDoc, onSnapshot, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import './discussion.css';


const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    const fetchPost = async () => {
        try {
      const docRef = doc(db, 'discussions', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPost({ id: docSnap.id, ...docSnap.data() }); 
      } else {
        setPost(false)
      }
        } catch (error) {
        console.error("Error fetching post, error: ", error);
        setPost(false);
        }
    };

    const unsubscribeReplies = onSnapshot(collection(db, 'discussions', id, 'replies'),
    (snapshot) => {
      const replyList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReplies(replyList);
    });

    fetchPost();
    return () => {
      unsubscribeAuth();
      unsubscribeReplies();
    };
  }, [id]);

  const handleReply = async () => {
    if (!newReply.trim() || !currentUser) return;

    try {
      await addDoc(collection(db, 'discussions', id, 'replies'), {
        text: newReply,
        author: currentUser.displayName || 'You',
        authorId: currentUser.uid,
        timestamp: serverTimestamp()
      });

    const postRef = doc(db, 'discussions', id);
    await updateDoc(postRef, {
        replies: increment(1)
    });


    setNewReply('');
  } catch (error) {
    console.error("Error adding reply: ", error);
    alert('Failed to post reply. please try again later.');
  }
  };


  const handleDeleteReply = async (replyId, replyAuthorId) => {
    if (!currentUser || currentUser.uid !== replyAuthorId) {
      alert('You can only delete your own comment.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await deleteDoc(doc(db, 'discussions', id, 'replies', replyId));
      await updateDoc(doc(db, 'discussions', id), {
        replies: increment(-1)
      });

     
      setReplies(prev => prev.filter(reply => reply.id !== replyId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment.');
    }
  };

  if (!post) return <p>Loading...</p>;
  if (post === false) return <p>Post not found.</p>;

  return (
    <div className="post-page">
      <div className="forum">
        <button onClick={() => window.history.back()}>&larr; Back</button>

        <div className="post-box">
          <h2>{post.title}</h2>
          <p>
            <strong>Posted by {post.author}</strong> · {post.tag}
          </p>
          <p>{post.content || 'Post content here...'}</p>
        </div>

        <div className="comments">
          <h3>Comments ({replies.length})</h3>
          {replies.map(reply => (
            <div key={reply.id} className="comment-box">
              <strong>{reply.author}</strong>
              <p>{reply.text}</p>
              {currentUser && currentUser.uid === reply.authorId && (
                <button
                  className="delete-button"
                  onClick={() => handleDeleteReply(reply.id, reply.authorId)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}

          <div className="add-comment">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newReply}
              onChange={e => setNewReply(e.target.value)}
            />
            <button onClick={handleReply}>Reply</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
  