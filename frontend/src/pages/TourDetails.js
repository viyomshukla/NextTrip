import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API_BASE from '../config';

const Stars = ({ value }) => (
  <span aria-label={`${value} out of 5`} style={{ color: 'var(--accent-500)', letterSpacing: '.06em' }}>
    {'★'.repeat(Math.round(value))}
    <span style={{ color: 'var(--border-2)' }}>{'★'.repeat(5 - Math.round(value))}</span>
  </span>
);

const TourDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    const fetchTourAndReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const [tourRes, reviewsRes] = await Promise.all([
          fetch(`${API_BASE}/api/tours/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          fetch(`${API_BASE}/api/reviews/tour/${id}`)
        ]);
        const tourData = await tourRes.json();
        const reviewsData = await reviewsRes.json();
        setTour(tourData);
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      } catch (err) {
        setError('Failed to load tour details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTourAndReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to submit a review');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/reviews/tour/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newReview)
      });
      if (response.ok) {
        setNewReview({ rating: 5, comment: '' });
        const reviewsRes = await fetch(`${API_BASE}/api/reviews/tour/${id}`);
        const reviewsData = await reviewsRes.json();
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      } else {
        alert('Failed to submit review');
      }
    } catch (err) {
      alert('Failed to submit review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(`${API_BASE}/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        setReviews(reviews.filter(r => r._id !== reviewId));
      } else {
        alert('Failed to delete review');
      }
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="nt-center-screen">
        <div>
          <div className="nt-spinner" />
          Loading tour…
        </div>
      </div>
    );
  }

  if (error || !tour || !tour._id) {
    return (
      <section className="nt-section">
        <div className="nt-container">
          <div className="nt-empty">
            <div className="nt-empty__icon" aria-hidden="true">🧭</div>
            <h3>We couldn't load this tour</h3>
            <p>{error || 'It may have been removed or is no longer available.'}</p>
            <Link to="/" className="nt-btn nt-btn--primary">Back to tours</Link>
          </div>
        </div>
      </section>
    );
  }

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / reviews.length
    : null;
  const isOngoing = tour.status === 'ongoing';

  return (
    <>
      {/* Hero banner uses the tour image when present, gradient otherwise. */}
      <header
        style={{
          position: 'relative',
          minHeight: 'clamp(260px, 42vw, 440px)',
          display: 'flex',
          alignItems: 'flex-end',
          background: tour.image
            ? `linear-gradient(to top, rgba(15,23,42,.88), rgba(15,23,42,.25)), url(${tour.image}) center/cover`
            : 'linear-gradient(150deg, var(--brand-700), var(--brand-900))',
          color: '#fff',
        }}
      >
        <div className="nt-container" style={{ paddingBlock: '2.5rem' }}>
          <span className={`nt-badge ${isOngoing ? 'nt-badge--live' : 'nt-badge--soon'}`}>
            {isOngoing ? '● Booking open' : '◷ Coming soon'}
          </span>
          <h1 style={{ color: '#fff', margin: '.85rem 0 .5rem' }}>{tour.title}</h1>
          <div className="nt-meta" style={{ color: 'rgba(255,255,255,.85)' }}>
            <span className="nt-meta__item">📍 {tour.location || 'To be announced'}</span>
            {tour.duration && <span className="nt-meta__item">⏱️ {tour.duration} days</span>}
            {tour.category && <span className="nt-meta__item">🏷️ {tour.category}</span>}
            {avgRating && (
              <span className="nt-meta__item">
                <Stars value={avgRating} /> {avgRating.toFixed(1)} ({reviews.length})
              </span>
            )}
          </div>
        </div>
      </header>

      <section className="nt-section nt-section--tight">
        <div className="nt-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.7fr) minmax(280px, 1fr)',
              gap: '2.5rem',
              alignItems: 'start',
            }}
            className="nt-details__grid"
          >
            <div>
              <h2>About this trip</h2>
              <p style={{ color: 'var(--muted)', fontSize: '1.02rem' }}>
                {tour.description || 'A full itinerary for this tour is coming soon.'}
              </p>

              <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: '2.5rem 0' }} />

              <div className="nt-row" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0 }}>
                  Reviews {reviews.length > 0 && <span style={{ color: 'var(--muted)' }}>({reviews.length})</span>}
                </h2>
              </div>

              {reviews.length === 0 ? (
                <div className="nt-empty" style={{ padding: '2rem' }}>
                  <p style={{ margin: 0 }}>No reviews yet — be the first to share your experience.</p>
                </div>
              ) : (
                <div className="nt-stack">
                  {reviews.map((r) => (
                    <div key={r._id} className="nt-card nt-card--pad">
                      <div className="nt-row" style={{ marginBottom: '.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                          <span className="nt-avatar">{(r.user?.name || '?').charAt(0)}</span>
                          <div>
                            <div style={{ fontWeight: 700 }}>{r.user?.name || 'Traveller'}</div>
                            <Stars value={r.rating} />
                          </div>
                        </div>
                        {user && (r.user?._id === user.id || user.role === 'admin') && (
                          <button
                            className="nt-btn nt-btn--quiet nt-btn--sm"
                            onClick={() => handleDeleteReview(r._id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <p style={{ color: 'var(--muted)', margin: 0 }}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              {user && (
                <div className="nt-card nt-card--pad" style={{ marginTop: '1.5rem' }}>
                  <h3>Leave a review</h3>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="nt-field">
                      <label className="nt-label" htmlFor="review-rating">Rating</label>
                      <select
                        id="review-rating"
                        className="nt-select"
                        value={newReview.rating}
                        onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                      >
                        {[5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n}>{'★'.repeat(n)} — {n} star{n > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                    <div className="nt-field">
                      <label className="nt-label" htmlFor="review-comment">Your experience</label>
                      <textarea
                        id="review-comment"
                        className="nt-textarea"
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        placeholder="What stood out? What should other travellers know?"
                        required
                      />
                    </div>
                    <button type="submit" className="nt-btn nt-btn--primary">Post review</button>
                  </form>
                </div>
              )}
            </div>

            {/* Sticky booking panel is the standard travel-site conversion pattern. */}
            <aside
              className="nt-card nt-card--pad"
              style={{ position: 'sticky', top: 'calc(var(--nav-h) + 1.5rem)' }}
            >
              <div className="nt-price" style={{ fontSize: '2rem' }}>
                ₹{Number(tour.price).toLocaleString('en-IN')} <span>/ person</span>
              </div>

              <div className="nt-meta" style={{ margin: '1rem 0 1.5rem' }}>
                <span className="nt-meta__item">👥 Max 10 travellers</span>
                <span className="nt-meta__item">🧭 Local guide included</span>
              </div>

              {isOngoing ? (
                <button
                  className="nt-btn nt-btn--accent nt-btn--block nt-btn--lg"
                  onClick={() => navigate(`/book-tour/${tour._id}`)}
                >
                  Book this trip
                </button>
              ) : (
                <button className="nt-btn nt-btn--ghost nt-btn--block nt-btn--lg" disabled>
                  Not open for booking
                </button>
              )}

              <p className="nt-help" style={{ textAlign: 'center', marginTop: '.85rem' }}>
                You won't be charged yet — traveller details come next.
              </p>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};

export default TourDetails;
