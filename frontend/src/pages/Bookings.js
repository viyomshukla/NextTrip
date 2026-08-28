import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import API_BASE from '../config';

const Bookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE}/api/bookings`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        } else {
          setError('Failed to load bookings');
        }
      } catch (err) {
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchBookings();
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        setBookings(bookings.filter(b => b._id !== bookingId));
      } else {
        alert('Failed to cancel booking');
      }
    } catch (err) {
      alert('Failed to cancel booking');
    }
  };

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';

  const totalSpend = bookings.reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);

  if (loading) {
    return (
      <div className="nt-center-screen">
        <div>
          <div className="nt-spinner" />
          Loading your trips…
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="nt-pagehead">
        <div className="nt-container">
          <div className="nt-row">
            <div>
              <span className="nt-eyebrow">Your account</span>
              <h1>My trips</h1>
              <p>Every tour you have reserved, newest first.</p>
            </div>

            {bookings.length > 0 && (
              <div style={{ display: 'flex', gap: '2rem' }}>
                <div>
                  <div className="nt-stat__num">{bookings.length}</div>
                  <div className="nt-stat__label">Bookings</div>
                </div>
                <div>
                  <div className="nt-stat__num">₹{totalSpend.toLocaleString('en-IN')}</div>
                  <div className="nt-stat__label">Total value</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="nt-section nt-section--tight">
        <div className="nt-container">
          {error && <div className="nt-alert nt-alert--error">{error}</div>}

          {bookings.length === 0 ? (
            <div className="nt-empty">
              <div className="nt-empty__icon" aria-hidden="true">🎒</div>
              <h3>No trips booked yet</h3>
              <p>When you reserve a tour it will show up here with all its details.</p>
              <Link to="/" className="nt-btn nt-btn--primary">Browse tours</Link>
            </div>
          ) : (
            <div className="nt-stack">
              {bookings.map((booking) => {
                const tour = booking.tour;
                const isOpen = expanded === booking._id;
                const travellers = booking.people || booking.passengers || [];

                return (
                  <article key={booking._id} className="nt-booking nt-rise">
                    {tour && tour.image ? (
                      <img
                        className="nt-booking__thumb"
                        src={tour.image}
                        alt={tour.title || 'Tour'}
                        onError={(e) => { e.target.style.visibility = 'hidden'; }}
                      />
                    ) : (
                      <div className="nt-booking__thumb" aria-hidden="true">🏔️</div>
                    )}

                    <div>
                      <div className="nt-booking__title">
                        {tour ? (tour.title || tour.name) : 'Tour details unavailable'}
                      </div>

                      <div className="nt-meta">
                        <span className="nt-meta__item">📍 {tour?.location || 'N/A'}</span>
                        {tour?.duration && <span className="nt-meta__item">⏱️ {tour.duration} days</span>}
                        <span className="nt-meta__item">👥 {booking.numberOfPeople} travelling</span>
                        <span className="nt-meta__item">📅 {fmtDate(booking.bookingDate)}</span>
                      </div>

                      {travellers.length > 0 && (
                        <>
                          <button
                            className="nt-btn nt-btn--quiet nt-btn--sm"
                            style={{ marginTop: '.5rem', marginLeft: '-.9rem' }}
                            onClick={() => setExpanded(isOpen ? null : booking._id)}
                            aria-expanded={isOpen}
                          >
                            {isOpen ? '▴ Hide travellers' : `▾ Show ${travellers.length} traveller${travellers.length > 1 ? 's' : ''}`}
                          </button>

                          {isOpen && (
                            <div className="nt-stack nt-stack--sm" style={{ marginTop: '.75rem' }}>
                              {travellers.map((p, i) => (
                                <div
                                  key={i}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '.75rem',
                                    padding: '.6rem .8rem',
                                    background: 'var(--canvas)',
                                    borderRadius: 'var(--radius)',
                                    fontSize: '.9rem',
                                  }}
                                >
                                  <span className="nt-avatar" style={{ width: 30, height: 30, fontSize: '.75rem' }}>
                                    {(p.name || '?').charAt(0)}
                                  </span>
                                  <span style={{ fontWeight: 600 }}>{p.name}</span>
                                  <span style={{ color: 'var(--muted)' }}>{p.phone}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div className="nt-price" style={{ marginBottom: '.75rem' }}>
                        ₹{Number(booking.totalPrice).toLocaleString('en-IN')}
                      </div>
                      <div className="nt-booking__actions">
                        {tour && (
                          <button
                            className="nt-btn nt-btn--ghost nt-btn--sm"
                            onClick={() => navigate(`/tours/${tour._id}`)}
                          >
                            View tour
                          </button>
                        )}
                        <button
                          className="nt-btn nt-btn--danger nt-btn--sm"
                          onClick={() => handleCancelBooking(booking._id)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Bookings;
