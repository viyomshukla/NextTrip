import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signup, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await signup(name, email, password);
    if (success) {
      navigate('/');
    }
  };

  // Cheap inline strength read so people aren't surprised by a server rejection.
  const strength = (() => {
    if (!password) return null;
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return [
      { label: 'Too short', color: 'var(--danger)' },
      { label: 'Weak', color: 'var(--danger)' },
      { label: 'Fair', color: 'var(--warning)' },
      { label: 'Good', color: 'var(--brand-600)' },
      { label: 'Strong', color: 'var(--success)' },
    ][score];
  })();

  return (
    <div className="nt-auth">
      <div className="nt-auth__form">
        <div className="nt-auth__inner nt-rise">
          <span className="nt-eyebrow">Get started</span>
          <h1>Create your account</h1>
          <p className="nt-auth__sub">
            Free to join. Browse live departures and hold a place in minutes.
          </p>

          {error && <div className="nt-alert nt-alert--error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="nt-field">
              <label className="nt-label" htmlFor="signup-name">Full name</label>
              <input
                id="signup-name"
                className="nt-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
                required
              />
            </div>

            <div className="nt-field">
              <label className="nt-label" htmlFor="signup-email">Email address</label>
              <input
                id="signup-email"
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
              <label className="nt-label" htmlFor="signup-password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="signup-password"
                  className="nt-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
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
              {strength && (
                <div className="nt-help" style={{ color: strength.color, fontWeight: 600 }}>
                  Password strength: {strength.label}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="nt-btn nt-btn--primary nt-btn--block nt-btn--lg"
              disabled={loading}
              style={{ marginTop: '1.5rem' }}
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="nt-auth__alt">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>

      <aside className="nt-auth__aside">
        <blockquote className="nt-quote">
          Booked on a Thursday, was on a bus through the Western Ghats by Saturday.
          The whole thing took less time than picking a restaurant.
          <cite>— Dev M., Kerala backwaters</cite>
        </blockquote>
        <h2>Ten travellers. One local guide.</h2>
        <p>
          Every NextTrip departure is capped small and run by someone who lives
          where you are going.
        </p>
      </aside>
    </div>
  );
};

export default Signup;
