import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '../components/Icon';
import ladakhImg from '../Assests/ladakh-auth.jpg';

const ASIDE_POINTS = [
  { icon: 'users', text: 'Ten travellers per departure, never more' },
  { icon: 'compass', text: 'Guides who live on the route they lead' },
  { icon: 'shield', text: 'The listed price is the price you pay' },
];

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
          <span className="nt-eyebrow">
            <Icon name="sparkle" />
            Welcome back
          </span>
          <h1>Log in to NextTrip</h1>
          <p className="nt-auth__sub">
            Pick up where you left off and manage your upcoming trips.
          </p>

          {error && (
            <div className="nt-alert nt-alert--error">
              <Icon name="close" />
              {error}
            </div>
          )}

          {/* Account type decides where a successful login lands. */}
          <div
            className="nt-segment"
            role="radiogroup"
            aria-label="Account type"
            data-active={loginType}
          >
            <span className="nt-segment__thumb" aria-hidden="true" />
            {[
              { id: 'user', label: 'Traveller' },
              { id: 'admin', label: 'Administrator' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={loginType === opt.id}
                className={loginType === opt.id ? 'nt-segment__opt is-on' : 'nt-segment__opt'}
                onClick={() => setLoginType(opt.id)}
              >
                {opt.label}
              </button>
            ))}
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
              <div className="nt-input-wrap">
                <input
                  id="login-password"
                  className="nt-input nt-input--has-affix"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="nt-input__affix"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Icon name={showPassword ? 'eyeOff' : 'eye'} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="nt-btn nt-btn--primary nt-btn--block nt-btn--lg"
              disabled={loading}
              style={{ marginTop: '1.5rem' }}
            >
              {loading ? (
                <>
                  <span className="nt-btn__spinner" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                <>
                  Log in
                  <Icon name="arrowRight" />
                </>
              )}
            </button>
          </form>

          <p className="nt-auth__alt">
            New to NextTrip? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>

      <aside className="nt-auth__aside">
        {/* The quote is about the Ladakh route, so the panel shows it. */}
        <img className="nt-auth__photo" src={ladakhImg} alt="" />

        <blockquote className="nt-quote">
          <Icon name="quote" className="nt-quote__mark" size="1.6rem" />
          The Ladakh route was the first trip where I never once felt like a tourist.
          Ten of us, one guide who grew up in the valley, and zero filler days.
          <cite>
            <span className="nt-avatar nt-avatar--lg">A</span>
            <span>
              <strong>Ananya R.</strong>
              <small>Leh–Nubra crossing</small>
            </span>
          </cite>
        </blockquote>

        <h2>Trips worth taking time off for</h2>
        <ul className="nt-auth__points">
          {ASIDE_POINTS.map((p) => (
            <li key={p.text}>
              <Icon name={p.icon} />
              {p.text}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default Login;
