import React, { useState } from "react";
import './popup.css';

const Popup = ({ onConfirm, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(formData);
  };

  return (
    <div
      className="popup"
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
      aria-describedby="popup-description"
    >
      <div className="popup-content">
        <h2 id="popup-title" className="popup-title">Create New Post</h2>
        <p id="popup-description" className="sr-only">Use this form to create a new discussion post with a title, category, and content.</p>

        <form onSubmit={handleSubmit} className="popup-form">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter a descriptive title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            <option value="Treatment">Treatment</option>
            <option value="Tips">Tips</option>
            <option value="Stories">Stories</option>
            <option value="Reviews">Reviews</option>
            <option value="Questions">Questions</option>
          </select>

          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            placeholder="Share your experience, question, or story..."
            value={formData.content}
            onChange={handleChange}
            required
          />

          <div className="popup-buttons">
            <button
              type="button"
              className="cancel-button"
              onClick={onCancel}
              aria-label="Cancel post creation"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="post-button"
              aria-label="Submit new post"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Popup;
