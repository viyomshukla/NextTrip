import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Footer from '../components/Footer';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const success = await updateProfile(formData);
      if (success) {
        setMessage('Profile updated successfully!');
        setError('');
      }
    } catch (err) {
      setError('Failed to update profile');
      setMessage('');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await fetch('http://localhost:5000/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Password changed successfully!');
        setError('');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setError(data.error || 'Failed to change password');
        setMessage('');
      }
    } catch (err) {
      setError('Failed to change password');
      setMessage('');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2rem',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          color: '#2d3748'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '700',
            margin: '0 0 1rem 0',
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            👤 Profile Dashboard
          </h1>
          <p style={{
            fontSize: '1.2rem',
            opacity: 0.8,
            margin: '0',
            color: '#4a5568'
          }}>
            Manage your account settings and preferences
          </p>
        </div>

        {/* Status Messages */}
        {message && (
          <div style={{
            background: 'rgba(78, 205, 196, 0.2)',
            border: '1px solid rgba(78, 205, 196, 0.4)',
            borderRadius: '15px',
            padding: '1rem',
            marginBottom: '2rem',
            textAlign: 'center',
            color: '#2d3748',
            fontSize: '1.1rem',
            fontWeight: '500',
            backdropFilter: 'blur(10px)'
          }}>
             {message}
          </div>
        )}
        
        {error && (
          <div style={{
            background: 'rgba(245, 87, 108, 0.2)',
            border: '1px solid rgba(245, 87, 108, 0.4)',
            borderRadius: '15px',
            padding: '1rem',
            marginBottom: '2rem',
            textAlign: 'center',
            color: '#e53e3e',
            fontSize: '1.1rem',
            fontWeight: '500',
            backdropFilter: 'blur(10px)'
          }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Profile Update Form */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              color: '#2d3748',
              margin: '0 0 2rem 0',
              fontSize: '2rem',
              fontWeight: '600',
              textAlign: 'center',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              🔧 Update Profile
            </h2>
            
            <form onSubmit={handleProfileUpdate}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  color: '#2d3748',
                  marginBottom: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}>
                  👤 Full Name
                </label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  required 
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '15px',
                    border: '2px solid rgba(102, 126, 234, 0.3)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: '#2d3748',
                    fontSize: '1rem',
                    backdropFilter: 'blur(10px)'
                  }}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  color: '#2d3748',
                  marginBottom: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}>
                  📧 Email Address
                </label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  required 
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '15px',
                    border: '2px solid rgba(102, 126, 234, 0.3)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: '#2d3748',
                    fontSize: '1rem',
                    backdropFilter: 'blur(10px)'
                  }}
                  placeholder="Enter your email address"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isUpdating}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '15px',
                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  boxShadow: '0 8px 25px rgba(78, 205, 196, 0.3)',
                  opacity: isUpdating ? 0.7 : 1
                }}
              >
                {isUpdating ? '🔄 Updating...' : '🚀 Update Profile'}
              </button>
            </form>
          </div>

          {/* Password Change Form */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              color: '#2d3748',
              margin: '0 0 2rem 0',
              fontSize: '2rem',
              fontWeight: '600',
              textAlign: 'center',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              🔐 Change Password
            </h2>
            
            <form onSubmit={handlePasswordChange}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  color: '#2d3748',
                  marginBottom: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}>
                  🔑 Current Password
                </label>
                <input 
                  type="password" 
                  value={passwordData.currentPassword} 
                  onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})} 
                  required 
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '15px',
                    border: '2px solid rgba(102, 126, 234, 0.3)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: '#2d3748',
                    fontSize: '1rem',
                    backdropFilter: 'blur(10px)'
                  }}
                  placeholder="Enter current password"
                />
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  color: '#2d3748',
                  marginBottom: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}>
                  🆕 New Password
                </label>
                <input 
                  type="password" 
                  value={passwordData.newPassword} 
                  onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} 
                  required 
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '15px',
                    border: '2px solid rgba(102, 126, 234, 0.3)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: '#2d3748',
                    fontSize: '1rem',
                    backdropFilter: 'blur(10px)'
                  }}
                  placeholder="Enter new password"
                />
              </div>
              
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  color: '#2d3748',
                  marginBottom: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}>
                  ✅ Confirm New Password
                </label>
                <input 
                  type="password" 
                  value={passwordData.confirmPassword} 
                  onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} 
                  required 
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '15px',
                    border: '2px solid rgba(102, 126, 234, 0.3)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: '#2d3748',
                    fontSize: '1rem',
                    backdropFilter: 'blur(10px)'
                  }}
                  placeholder="Confirm new password"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isChangingPassword}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '15px',
                  cursor: isChangingPassword ? 'not-allowed' : 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)',
                  opacity: isChangingPassword ? 0.7 : 1
                }}
              >
                {isChangingPassword ? '🔄 Changing...' : '🔐 Change Password'}
              </button>
            </form>
          </div>
        </div>

        {/* User Info Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '2rem',
          marginTop: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            color: '#2d3748',
            margin: '0 0 1.5rem 0',
            fontSize: '1.8rem',
            fontWeight: '600',
            textAlign: 'center',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            📋 Account Information
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '15px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.4)'
            }}>
              <div style={{
                color: '#4a5568',
                fontSize: '0.9rem',
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}>
                👤 Name
              </div>
              <div style={{
                color: '#2d3748',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                {user?.name || 'Not set'}
              </div>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '15px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.4)'
            }}>
              <div style={{
                color: '#4a5568',
                fontSize: '0.9rem',
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}>
                📧 Email
              </div>
              <div style={{
                color: '#2d3748',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}>
                {user?.email || 'Not set'}
              </div>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '15px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.4)'
            }}>
              <div style={{
                color: '#4a5568',
                fontSize: '0.9rem',
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}>
                👑 Role
              </div>
              <div style={{
                color: '#2d3748',
                fontSize: '1.1rem',
                fontWeight: '600',
                textTransform: 'capitalize'
              }}>
                {user?.role || 'User'}
              </div>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '15px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.4)'
            }}>
              <div style={{
                color: '#4a5568',
                fontSize: '0.9rem',
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}>
                🆔 User ID
              </div>
              <div style={{
                color: '#2d3748',
                fontSize: '1.1rem',
                fontWeight: '600',
                fontFamily: 'monospace'
              }}>
                {user?._id || 'Not available'}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile; 