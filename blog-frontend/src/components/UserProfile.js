import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="user-profile">
      <div className="dropdown">
        <button
          className="btn btn-link dropdown-toggle text-decoration-none"
          type="button"
          id="userDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {currentUser.picture ? (
            <img
              src={currentUser.picture}
              alt={currentUser.name}
              className="rounded-circle me-2"
              width="28"
              height="28"
            />
          ) : (
            <i className="bi bi-person-circle me-2"></i>
          )}
          <span>{currentUser.name}</span>
        </button>
        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
          <li className="dropdown-item-text text-center">
            <small>{currentUser.email}</small>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <button className="dropdown-item" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserProfile; 