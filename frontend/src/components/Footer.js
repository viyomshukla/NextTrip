import React from 'react';

const Footer = () => (
  <footer style={{
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#111',
    padding: '1.2rem 0 0.7rem 0',
    borderTop: '1px solid #e2e8f0',
    marginTop: '2rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxShadow: '0 -2px 16px rgba(102, 126, 234, 0.07)'
  }}>
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '1.2rem',
      padding: '0 1rem'
    }}>
      {/* Brand & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
        <span style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: 'white',
          letterSpacing: '1px'
        }}>
          NextTrip
        </span>
      </div>

      {/* Contact Details */}
      <div style={{ fontSize: '1rem', lineHeight: '1.6', minWidth: '180px', color: '#111' }}>
        <div style={{ fontWeight: 600, color: '#111' }}>Contact Us:</div>
        <div>📧 <a href="mailto:info@nexttrip.com" style={{ color: '#111', textDecoration: 'none' }}>info@nexttrip.com</a></div>
        <div>📞 <a href="tel:+919876XXXXX" style={{ color: '#111', textDecoration: 'none' }}>+91 98765 XXXXX</a></div>
        <div>🏢 Bengaluru, India</div>
      </div>
    </div>
    <div style={{
      textAlign: 'center',
      marginTop: '1rem',
      color: '#222',
      fontSize: '0.95rem',
      letterSpacing: '0.5px'
    }}>
      © {new Date().getFullYear()} NextTrip. All rights reserved.
    </div>
  </footer>
);

export default Footer; 