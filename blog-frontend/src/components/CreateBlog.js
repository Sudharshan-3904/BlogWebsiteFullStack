import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBlog } from '../services/blogService';

const CreateBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setSubmitting(true);
      await createBlog(formData);
      navigate('/');
    } catch (err) {
      setError('Failed to create blog. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Create New Blog</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">Content</label>
          <textarea
            className="form-control"
            id="content"
            name="content"
            rows="10"
            value={formData.content}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? 'Creating...' : 'Create Blog'}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;