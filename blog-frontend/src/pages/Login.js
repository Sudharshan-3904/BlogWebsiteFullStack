import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GoogleLogin from '../components/GoogleLogin';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if already logged in
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3 className="text-center mb-0">Login</h3>
            </div>
            <div className="card-body">
              <div className="text-center mb-4">
                <p>Sign in to access your account</p>
              </div>
              <div className="d-flex justify-content-center">
                <GoogleLogin />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
