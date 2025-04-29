import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin as ReactGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';

const GoogleLogin = ({ onSuccess }) => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (credentialResponse.credential) {
        await login(credentialResponse.credential);
        // Call the parent component's success handler if provided
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginFailure = () => {
    console.error('Google login failed');
    setError('Google login failed. Please try again.');
  };

  return (
    <div className="google-login-container">
      {error && <div className="alert alert-danger">{error}</div>}
      
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
        {isLoading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <ReactGoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
            useOneTap
            theme="filled_blue"
            text="continue_with"
            shape="rectangular"
            size="large"
          />
        )}
      </GoogleOAuthProvider>
    </div>
  );
};

export default GoogleLogin; 