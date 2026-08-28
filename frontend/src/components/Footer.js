import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="nt-footer">
    <div className="nt-container">
      <div className="nt-footer__grid">
        <div>
          <Link to="/" className="nt-brand">
            <span className="nt-brand__mark" aria-hidden="true">✦</span>
            NextTrip
          </Link>
          <p>
            Curated journeys across India and beyond. Small groups, local guides,
            and itineraries built around the places worth slowing down for.
          </p>
        </div>

        <div>
          <h4>Explore</h4>
          <ul>
            <li><Link to="/">All tours</Link></li>
            <li><Link to="/">Ongoing trips</Link></li>
            <li><Link to="/">Upcoming trips</Link></li>
            <li><Link to="/bookings">My bookings</Link></li>
          </ul>
        </div>

        <div>
          <h4>Company</h4>
          <ul>
            <li><Link to="/">About us</Link></li>
            <li><Link to="/">How it works</Link></li>
            <li><Link to="/">Travel stories</Link></li>
            <li><Link to="/">Careers</Link></li>
          </ul>
        </div>

        <div>
          <h4>Get in touch</h4>
          <ul>
            <li><a href="mailto:info@nexttrip.com">info@nexttrip.com</a></li>
            <li><a href="tel:+919876500000">+91 98765 00000</a></li>
            <li>Bengaluru, India</li>
          </ul>
        </div>
      </div>

      <div className="nt-footer__bottom">
        <span>© {new Date().getFullYear()} NextTrip. All rights reserved.</span>
        <span>Made for travellers, not tourists.</span>
      </div>
    </div>
  </footer>
);

export default Footer;
