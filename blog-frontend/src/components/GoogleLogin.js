import React from 'react';
import { GoogleOAuthProvider, GoogleLogin as ReactGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';

const GoogleLogin = () => {
  const { login } = useAuth();

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      if (credentialResponse.credential) {
        await login(credentialResponse.credential);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLoginFailure = () => {
    console.error('Google login failed');
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
      <div className="google-login-container">
        <ReactGoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginFailure}
          useOneTap
          theme="filled_blue"
          text="continue_with"
          shape="rectangular"
          size="large"
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleLogin; 