import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '../components/Icon';
import ghatsImg from '../Assests/ghats-auth.jpg';

const ASIDE_POINTS = [
  { icon: 'ticket', text: 'Hold a place in about two minutes' },
  { icon: 'shield', text: 'No card needed to create an account' },
  { icon: 'headset', text: 'A real person on the other end of every trip' },
];

const STRENGTH = [
  { label: 'Too short', tone: 'danger' },
  { label: 'Weak', tone: 'danger' },
  { label: 'Fair', tone: 'warn' },
  { label: 'Good', tone: 'good' },
  { label: 'Strong', tone: 'strong' },
];

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
  const score = (() => {
    if (!password) return null;
    let s = 0;
    if (password.length >= 8) s += 1;
    if (/[A-Z]/.test(password)) s += 1;
    if (/[0-9]/.test(password)) s += 1;
    if (/[^A-Za-z0-9]/.test(password)) s += 1;
    return s;
  })();
  const strength = score === null ? null : STRENGTH[score];

  return (
    <div className="nt-auth">
      <div className="nt-auth__form">
        <div className="nt-auth__inner nt-rise">
          <span className="nt-eyebrow">
            <Icon name="sparkle" />
            Get started
          </span>
          <h1>Create your account</h1>
          <p className="nt-auth__sub">
            Free to join. Browse live departures and hold a place in minutes.
          </p>

          {error && (
            <div className="nt-alert nt-alert--error">
              <Icon name="close" />
              {error}
            </div>
          )}

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
              <div className="nt-input-wrap">
                <input
                  id="signup-password"
                  className="nt-input nt-input--has-affix"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  aria-describedby="signup-strength"
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

              {strength && (
                <div className="nt-strength" id="signup-strength" data-tone={strength.tone}>
                  <div className="nt-strength__bar" aria-hidden="true">
                    {[0, 1, 2, 3].map((i) => (
                      <span key={i} className={i < score ? 'is-on' : ''} />
                    ))}
                  </div>
                  <span className="nt-strength__label">{strength.label}</span>
                </div>
              )}
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
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <Icon name="arrowRight" />
                </>
              )}
            </button>
          </form>

          <p className="nt-auth__alt">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>

      <aside className="nt-auth__aside">
        {/* The quote is about a Western Ghats departure, so the panel shows it. */}
        <img className="nt-auth__photo" src={ghatsImg} alt="" />

        <blockquote className="nt-quote">
          <Icon name="quote" className="nt-quote__mark" size="1.6rem" />
          Booked on a Thursday, was on a bus through the Western Ghats by Saturday.
          The whole thing took less time than picking a restaurant.
          <cite>
            <span className="nt-avatar nt-avatar--lg">D</span>
            <span>
              <strong>Dev M.</strong>
              <small>Kerala backwaters</small>
            </span>
          </cite>
        </blockquote>

        <h2>Ten travellers. One local guide.</h2>
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

export default Signup;
