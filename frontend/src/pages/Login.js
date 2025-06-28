import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import pic from './pic.png';
import Footer from '../components/Footer';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('user'); // 'user' or 'admin'
  const { login, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      if (loginType === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Main Login Card */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Card Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#2d3748',
            margin: '0 0 10px 0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🔐 Welcome Back
          </h1>
          <p style={{ color: '#718096', fontSize: '16px', margin: '0' }}>
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Type Toggle */}
        <div style={{
          display: 'flex',
          marginBottom: '30px',
          background: '#f7fafc',
          borderRadius: '12px',
          padding: '4px',
          border: '1px solid #e2e8f0'
        }}>
          <button
            type="button"
            onClick={() => setLoginType('user')}
            style={{
              flex: 1,
              padding: '12px 20px',
              border: 'none',
              borderRadius: '8px',
              background: loginType === 'user' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
              color: loginType === 'user' ? 'white' : '#4a5568',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: loginType === 'user' ? '0 4px 15px rgba(102, 126, 234, 0.3)' : 'none'
            }}
          >
            👤 User Login
          </button>
          <button
            type="button"
            onClick={() => setLoginType('admin')}
            style={{
              flex: 1,
              padding: '12px 20px',
              border: 'none',
              borderRadius: '8px',
              background: loginType === 'admin' ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' : 'transparent',
              color: loginType === 'admin' ? 'white' : '#4a5568',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: loginType === 'admin' ? '0 4px 15px rgba(245, 87, 108, 0.3)' : 'none'
            }}
          >
            ⚡ Admin Login
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#2d3748',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              📧 Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  background: 'white'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#2d3748',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              🔑 Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  background: 'white'
                }}
              />
            </div>
          </div>

          {error && (
            <div style={{
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
              color: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 15px rgba(78, 205, 196, 0.3)'
            }}
          >
            {loading ? '🔄 Signing In...' : '🚀 Sign In'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '25px',
          paddingTop: '25px',
          borderTop: '1px solid #e2e8f0'
        }}>
          <p style={{ color: '#718096', fontSize: '14px', margin: '0 0 15px 0' }}>
            Don't have an account?
          </p>
          <a
            href="/signup"
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            ✨ Create Account
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login; 