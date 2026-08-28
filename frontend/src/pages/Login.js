import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('user'); // 'user' or 'admin'
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="nt-auth">
      <div className="nt-auth__form">
        <div className="nt-auth__inner nt-rise">
          <span className="nt-eyebrow">Welcome back</span>
          <h1>Log in to NextTrip</h1>
          <p className="nt-auth__sub">
            Pick up where you left off and manage your upcoming trips.
          </p>

          {error && <div className="nt-alert nt-alert--error">{error}</div>}

          {/* Account type decides where a successful login lands. */}
          <div className="nt-chips" style={{ marginBottom: '1.5rem' }}>
            <button
              type="button"
              className={loginType === 'user' ? 'nt-chip nt-chip--on' : 'nt-chip'}
              onClick={() => setLoginType('user')}
            >
              Traveller
            </button>
            <button
              type="button"
              className={loginType === 'admin' ? 'nt-chip nt-chip--on' : 'nt-chip'}
              onClick={() => setLoginType('admin')}
            >
              Administrator
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="nt-field">
              <label className="nt-label" htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                className="nt-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="nt-field">
              <label className="nt-label" htmlFor="login-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  className="nt-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  style={{ paddingRight: '3.25rem' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '.6rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.05rem',
                    lineHeight: 1,
                    padding: '.35rem',
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="nt-btn nt-btn--primary nt-btn--block nt-btn--lg"
              disabled={loading}
              style={{ marginTop: '1.5rem' }}
            >
              {loading ? 'Signing in…' : 'Log in'}
            </button>
          </form>

          <p className="nt-auth__alt">
            New to NextTrip? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>

      <aside className="nt-auth__aside">
        <blockquote className="nt-quote">
          The Ladakh route was the first trip where I never once felt like a tourist.
          Ten of us, one guide who grew up in the valley, and zero filler days.
          <cite>— Ananya R., Leh–Nubra crossing</cite>
        </blockquote>
        <h2>Trips worth taking time off for</h2>
        <p>
          Small groups, local guides, and itineraries that leave room for the
          places you did not plan on.
        </p>
      </aside>
    </div>
  );
};

export default Login;
