import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBlogs, deleteBlog } from '../services/blogService';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getAllBlogs();
      setBlogs(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch blogs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(id);
        setBlogs(blogs.filter(blog => blog.id !== id));
      } catch (err) {
        setError('Failed to delete blog. Please try again.');
      }
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h2 className="mb-4">All Blogs</h2>
      {blogs.length === 0 ? (
        <p>No blogs found. Create your first blog!</p>
      ) : (
        <div className="row">
          {blogs.map(blog => (
            <div className="col-md-4 mb-4" key={blog.id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{blog.title}</h5>
                  <p className="card-text">{blog.content.substring(0, 100)}...</p>
                </div>
                <div className="card-footer bg-white border-top-0">
                  <Link to={`/blog/${blog.id}`} className="btn btn-primary me-2">Read More</Link>
                  <Link to={`/edit/${blog.id}`} className="btn btn-secondary me-2">Edit</Link>
                  <button onClick={() => handleDelete(blog.id)} className="btn btn-danger">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;