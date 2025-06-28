import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1rem 2rem',
      color: 'Black',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Logo and Brand */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          color: 'Black',
          textDecoration: 'none',
          fontSize: '1.8rem',
          fontWeight: 'bold'
        }}>
          
          <span style={{
            background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            NextTrip
          </span>
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <>
              {user.role === 'admin' ? (
                // Admin Navigation
                <>
                  <Link to="/admin" style={{
                    color: 'white',
                    textDecoration: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '25px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    fontWeight: '500'
                  }}>
                    Admin Dashboard
                  </Link>
                  <Link to="/profile" style={{
                    color: 'white',
                    textDecoration: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '25px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    fontWeight: '500'
                  }}>
                    👤 Profile
                  </Link>
                  <button onClick={logout} style={{
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)'
                  }}>
                    🚪 Logout
                  </button>
                </>
              ) : (
                // Regular User Navigation
                <>
                  <Link to="/" style={{
                    color: 'white',
                    textDecoration: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '25px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    fontWeight: '500'
                  }}>
                    🏠 Home
                  </Link>
                  <Link to="/bookings" style={{
                    color: 'white',
                    textDecoration: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '25px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    fontWeight: '500'
                  }}>
                    📋 My Bookings
                  </Link>
                  <Link to="/profile" style={{
                    color: 'white',
                    textDecoration: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '25px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    fontWeight: '500'
                  }}>
                    👤 Profile
                  </Link>
                  <button onClick={logout} style={{
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)'
                  }}>
                    🚪 Logout
                  </button>
                </>
              )}
            </>
          ) : (
            // Guest Navigation
            <>
              <Link to="/login" style={{
                color: 'white',
                textDecoration: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontWeight: '500'
              }}>
                🔐 Login
              </Link>
              <Link to="/signup" style={{
                background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                color: 'white',
                textDecoration: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                fontWeight: '500',
                boxShadow: '0 4px 15px rgba(78, 205, 196, 0.3)'
              }}>
                ✨ Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 