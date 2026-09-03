import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logoMark from '../Assests/logo-mark.png';
import Icon from './Icon';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // The bar only grows a border once the page has scrolled under it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Navigating on mobile should always close the menu sheet.
  useEffect(() => setOpen(false), [location.pathname]);

  const linkClass = ({ isActive }) =>
    isActive ? 'nt-navlink nt-navlink--active' : 'nt-navlink';

  const initials = (user?.name || user?.email || '?').trim().charAt(0);

  return (
    <nav className={scrolled ? 'nt-nav nt-nav--scrolled' : 'nt-nav'}>
      <div className="nt-container nt-nav__inner">
        <Link to="/" className="nt-brand" aria-label="NextTrip home">
          <img className="nt-brand__mark" src={logoMark} alt="" width="36" height="36" />
          NextTrip
        </Link>

        <button
          className="nt-nav__toggle"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          <Icon name={open ? "close" : "menu"} size="1.35rem" />
        </button>

        <div className={open ? 'nt-nav__links nt-nav__links--open' : 'nt-nav__links'}>
          <NavLink to="/" className={linkClass} end>
            Explore
          </NavLink>

          {user && user.role !== 'admin' && (
            <NavLink to="/bookings" className={linkClass}>
              My trips
            </NavLink>
          )}

          {user?.role === 'admin' && (
            <NavLink to="/admin" className={linkClass}>
              Dashboard
            </NavLink>
          )}

          <div className="nt-nav__actions">
            {user ? (
              <>
                <Link to="/profile" className="nt-nav__user" title={user.name || user.email}>
                  <span className="nt-avatar">{initials}</span>
                </Link>
                <button className="nt-btn nt-btn--ghost nt-btn--sm" onClick={logout}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nt-btn nt-btn--quiet nt-btn--sm">
                  Log in
                </Link>
                <Link to="/signup" className="nt-btn nt-btn--primary nt-btn--sm">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
