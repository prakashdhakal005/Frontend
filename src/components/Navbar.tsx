import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          Bug Tracking System
        </Link>
        {isAuthenticated ? (
          <div className="navbar-nav">
            <Link to="/" className="nav-link">
              All Bugs
            </Link>
            {user?.role === 'User' && (
              <>
            <Link to="/my-bugs" className="nav-link">
              My Reported Bugs
            </Link>
              </>
            )}
            {user?.role === 'Developer' && (
              <>
                <Link to="/assigned-bugs" className="nav-link">
                  My Assigned Bugs
                </Link>
                <Link to="/unassigned-bugs" className="nav-link">
                  Unassigned Bugs
                </Link>
              </>
            )}

            {user?.role === 'User' && (
              <>
            <Link to="/create-bug" className="nav-link">
              Report Bug
            </Link>
            </>
            )}
            <span className="nav-link">{user?.fullName} ({user?.role})</span>
            <button onClick={logout} className="btn btn-secondary" style={{ padding: '8px 16px' }}>
              Logout
            </button>
          </div>
        ) : (
          <div className="navbar-nav">
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
