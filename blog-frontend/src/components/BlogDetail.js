import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBlogById, deleteBlog } from '../services/blogService';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const data = await getBlogById(id);
        setBlog(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch blog details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(id);
        navigate('/');
      } catch (err) {
        setError('Failed to delete blog. Please try again.');
      }
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!blog) return <div className="alert alert-warning">Blog not found</div>;

  return (
    <div className="blog-detail">
      <h2 className="mb-4">{blog.title}</h2>
      <div className="mb-4">
        {blog.content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <div className="mt-4">
        <Link to={`/edit/${blog.id}`} className="btn btn-primary me-2">Edit</Link>
        <button onClick={handleDelete} className="btn btn-danger me-2">Delete</button>
        <Link to="/" className="btn btn-secondary">Back to List</Link>
      </div>
    </div>
  );
};

export default BlogDetail;