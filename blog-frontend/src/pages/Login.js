import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GoogleLogin from '../components/GoogleLogin';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    // Redirect to home if already logged in with a delay to show success message
    if (isAuthenticated && loginSuccess) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loginSuccess, navigate]);

  const handleLoginSuccess = () => {
    setLoginSuccess(true);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          {loginSuccess ? (
            <div className="alert alert-success text-center" role="alert">
              <h4 className="alert-heading">Login Successful!</h4>
              <p>Welcome back! You've successfully logged in.</p>
              <p>Redirecting to your blog dashboard...</p>
            </div>
          ) : (
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h3 className="text-center mb-0">Login</h3>
              </div>
              <div className="card-body">
                <div className="text-center mb-4">
                  <p>Sign in to access your account</p>
                </div>
                <div className="d-flex justify-content-center">
                  <GoogleLogin onSuccess={handleLoginSuccess} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
