import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc,increment,getDoc,updateDoc, collection, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import './discussion.css';


const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");

  useEffect(() => {
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

    const unsubscribe = onSnapshot(collection(db, 'discussions', id, 'replies'),
    (snapshot) => {
      const replyList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReplies(replyList);
    });

    fetchPost();
    return () => unsubscribe();
  }, [id]);

  const handleReply = async () => {
    if (!newReply) return;
    await addDoc(collection(db, 'discussions', id, 'replies'), {
      text: newReply,
      author: user.uid, 
      timestamp: serverTimestamp()
    });
    const postRef = doc(db, 'discussions', id);
    await updateDoc(postRef, {
        replies: increment(1)
    });
    setNewReply('');
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="post-page">
        <div className="forum">
      <button onClick={() => window.history.back()}>&larr; Back</button>

      <div className="post-box">
        <h2>{post.title}</h2>
        <p><strong>Posted by {post.author}</strong> · {post.tag}</p>
        <p>{post.content || "Post content here..."}</p>
      </div>

      <div className="comments">
        <h3>Comments ({replies.length})</h3>
        {replies.map(reply => (
          <div key={reply.id} className="comment-box">
            <strong>{reply.author}</strong>
            <p>{reply.text}</p>
          </div>
        ))}

        <div className="add-comment">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
          />
          <button onClick={handleReply}>Post Reply</button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Post;
