import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API_BASE from '../config';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [tab, setTab] = useState('details');
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
      const response = await fetch(`${API_BASE}/api/users/change-password`, {
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

  const initials = (user?.name || user?.email || '?').trim().charAt(0);

  return (
    <>
      <header className="nt-pagehead">
        <div className="nt-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <span
              className="nt-avatar"
              style={{ width: 68, height: 68, fontSize: '1.6rem' }}
            >
              {initials}
            </span>
            <div>
              <span className="nt-eyebrow" style={{ marginBottom: '.35rem' }}>
                {user?.role === 'admin' ? 'Administrator' : 'Traveller'}
              </span>
              <h1 style={{ marginBottom: '.15rem' }}>{user?.name}</h1>
              <p style={{ margin: 0 }}>{user?.email}</p>
            </div>
          </div>
        </div>
      </header>

      <section className="nt-section nt-section--tight">
        <div className="nt-container" style={{ maxWidth: 720 }}>
          <div className="nt-tabs">
            <button
              className={tab === 'details' ? 'nt-tab nt-tab--on' : 'nt-tab'}
              onClick={() => { setTab('details'); setMessage(''); setError(''); }}
            >
              Account details
            </button>
            <button
              className={tab === 'security' ? 'nt-tab nt-tab--on' : 'nt-tab'}
              onClick={() => { setTab('security'); setMessage(''); setError(''); }}
            >
              Password
            </button>
          </div>

          {message && <div className="nt-alert nt-alert--ok">{message}</div>}
          {error && <div className="nt-alert nt-alert--error">{error}</div>}

          {tab === 'details' ? (
            <div className="nt-card nt-card--pad">
              <h3>Your details</h3>
              <p className="nt-help" style={{ marginBottom: '1.5rem' }}>
                This is the name and email we use for your bookings.
              </p>

              <form onSubmit={handleProfileUpdate}>
                <div className="nt-field">
                  <label className="nt-label" htmlFor="profile-name">Full name</label>
                  <input
                    id="profile-name"
                    className="nt-input"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="nt-field">
                  <label className="nt-label" htmlFor="profile-email">Email address</label>
                  <input
                    id="profile-email"
                    className="nt-input"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="nt-btn nt-btn--primary"
                  disabled={isUpdating}
                  style={{ marginTop: '.5rem' }}
                >
                  {isUpdating ? 'Saving…' : 'Save changes'}
                </button>
              </form>
            </div>
          ) : (
            <div className="nt-card nt-card--pad">
              <h3>Change password</h3>
              <p className="nt-help" style={{ marginBottom: '1.5rem' }}>
                Pick something you don't use anywhere else.
              </p>

              <form onSubmit={handlePasswordChange}>
                <div className="nt-field">
                  <label className="nt-label" htmlFor="pw-current">Current password</label>
                  <input
                    id="pw-current"
                    className="nt-input"
                    type="password"
                    autoComplete="current-password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="nt-field">
                  <label className="nt-label" htmlFor="pw-new">New password</label>
                  <input
                    id="pw-new"
                    className="nt-input"
                    type="password"
                    autoComplete="new-password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="nt-field">
                  <label className="nt-label" htmlFor="pw-confirm">Confirm new password</label>
                  <input
                    id="pw-confirm"
                    className="nt-input"
                    type="password"
                    autoComplete="new-password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    required
                  />
                  {passwordData.confirmPassword &&
                    passwordData.newPassword !== passwordData.confirmPassword && (
                      <div className="nt-error">Passwords do not match</div>
                    )}
                </div>

                <button
                  type="submit"
                  className="nt-btn nt-btn--primary"
                  disabled={isChangingPassword}
                  style={{ marginTop: '.5rem' }}
                >
                  {isChangingPassword ? 'Updating…' : 'Update password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Profile;
