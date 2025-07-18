import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Menu, X } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="nav-brand">Explorer Diary</div>
        
        {/* Mobile menu button */}
        <button
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-primary)'
          }}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/add" 
            className={`nav-link ${location.pathname === '/add' ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Add Entry
          </Link>
          <Link 
            to="/timeline" 
            className={`nav-link ${location.pathname === '/timeline' ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Timeline
          </Link>
          <Link 
            to="/map" 
            className={`nav-link ${location.pathname === '/map' ? 'active' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Map View
          </Link>
          
          {currentUser && (
            <div className="nav-user-section">
              <span className="nav-user-info">
                <User size={16} />
                <span className="hidden-mobile">{currentUser.displayName || currentUser.email}</span>
              </span>
              <button 
                onClick={handleLogout}
                className="nav-link logout-btn"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  color: 'inherit',
                  fontSize: 'inherit',
                  fontWeight: 'inherit',
                  padding: '10px 15px',
                  borderRadius: '5px',
                  transition: 'background-color 0.3s'
                }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;