import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import API_BASE from '../config';

const HERO_TILES = [
  { cls: 'nt-tile--a nt-tile--tall', name: 'Himalayas', note: 'Treks & high passes' },
  { cls: 'nt-tile--b', name: 'Rajasthan', note: 'Forts & desert' },
  { cls: 'nt-tile--c', name: 'Kerala', note: 'Backwaters' },
  { cls: 'nt-tile--d', name: 'Goa', note: 'Coast & culture' },
];

const FEATURES = [
  { icon: '🧭', title: 'Local guides', body: 'Every trip is led by someone who actually lives there.' },
  { icon: '👥', title: 'Small groups', body: 'Capped at ten travellers, so nothing feels like a coach tour.' },
  { icon: '🛡️', title: 'Clear pricing', body: 'The price you see covers the itinerary. No surprise add-ons.' },
  { icon: '⚡', title: 'Fast booking', body: 'Reserve a place in a couple of minutes, traveller details included.' },
];

const CATEGORIES = ['All', 'Adventure', 'Beach', 'Cultural', 'Wildlife', 'Mountain'];

// Skeletons hold the grid's shape while tours load, avoiding a layout jump.
const TourSkeleton = () => (
  <div className="nt-tour" aria-hidden="true">
    <div className="nt-skeleton nt-skeleton--media" />
    <div className="nt-tour__body">
      <div className="nt-skeleton nt-skeleton--line" style={{ width: '70%', height: 18 }} />
      <div className="nt-skeleton nt-skeleton--line" style={{ width: '45%' }} />
      <div className="nt-skeleton nt-skeleton--line" style={{ width: '90%' }} />
      <div className="nt-skeleton nt-skeleton--line" style={{ width: '60%' }} />
    </div>
  </div>
);

const TourCard = ({ tour, onBook, onPeek }) => {
  const isOngoing = tour.status === 'ongoing';
  return (
    <article className="nt-tour nt-rise">
      <div className={tour.image ? 'nt-tour__media' : 'nt-tour__media nt-tour__media--empty'}>
        {tour.image ? (
          <img
            src={tour.image}
            alt={tour.title}
            loading="lazy"
            onError={(e) => {
              // Fall back to the gradient placeholder if the URL is dead.
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <span aria-hidden="true">🏔️</span>
        )}
        <span className={`nt-badge nt-badge--float ${isOngoing ? 'nt-badge--live' : 'nt-badge--soon'}`}>
          {isOngoing ? '● Booking open' : '◷ Coming soon'}
        </span>
      </div>

      <div className="nt-tour__body">
        <h3 className="nt-tour__title">{tour.title}</h3>

        <p className="nt-tour__loc">
          📍 {tour.location || 'Location to be announced'}
          {tour.duration ? ` · ${tour.duration} days` : ''}
        </p>

        {tour.description && <p className="nt-tour__desc">{tour.description}</p>}

        <div className="nt-tour__foot">
          <div className="nt-price">
            ₹{Number(tour.price).toLocaleString('en-IN')} <span>/ person</span>
          </div>
          {isOngoing ? (
            <button className="nt-btn nt-btn--accent nt-btn--sm" onClick={() => onBook(tour._id)}>
              Book now
            </button>
          ) : (
            <button className="nt-btn nt-btn--ghost nt-btn--sm" onClick={onPeek}>
              Details
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

const Home = () => {
  const { user } = useContext(AuthContext);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpcomingDialog, setShowUpcomingDialog] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE}/api/tours`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.ok) {
          const data = await response.json();
          setTours(data);
        } else {
          setError('Failed to load tours');
        }
      } catch (err) {
        setError('Failed to load tours');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchTours();
    else setLoading(false);
  }, [user]);

  // Filtering is client-side over the already-fetched list, so it stays instant.
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tours.filter((t) => {
      const matchesQuery =
        !q ||
        [t.title, t.location, t.description].some((f) => (f || '').toLowerCase().includes(q));
      const matchesCat =
        category === 'All' || (t.category || '').toLowerCase() === category.toLowerCase();
      return matchesQuery && matchesCat;
    });
  }, [tours, query, category]);

  const ongoing = visible.filter((t) => t.status === 'ongoing');
  const upcoming = visible.filter((t) => t.status === 'upcoming');

  /* ------------------------------------------------------ guest landing ---- */
  if (!user) {
    return (
      <>
        <section className="nt-hero">
          <div className="nt-container">
            <div className="nt-hero__grid">
              <div className="nt-rise">
                <span className="nt-eyebrow">✦ Small-group travel</span>
                <h1>
                  Go somewhere that <span className="nt-hero__accent">stays with you</span>
                </h1>
                <p className="nt-lead">
                  Handpicked trips across India, led by local guides who know the routes,
                  the seasons, and the places that never make the guidebooks.
                </p>
                <div className="nt-hero__cta">
                  <Link to="/signup" className="nt-btn nt-btn--accent nt-btn--lg">
                    Start exploring
                  </Link>
                  <Link to="/login" className="nt-btn nt-btn--ghost nt-btn--lg">
                    I have an account
                  </Link>
                </div>

                <div className="nt-hero__stats">
                  <div>
                    <div className="nt-stat__num">40+</div>
                    <div className="nt-stat__label">Curated routes</div>
                  </div>
                  <div>
                    <div className="nt-stat__num">10</div>
                    <div className="nt-stat__label">Travellers max</div>
                  </div>
                  <div>
                    <div className="nt-stat__num">4.8★</div>
                    <div className="nt-stat__label">Average rating</div>
                  </div>
                </div>
              </div>

              <div className="nt-hero__art" aria-hidden="true">
                {HERO_TILES.map((t) => (
                  <div key={t.name} className={`nt-tile ${t.cls}`}>
                    {t.name}
                    <span>{t.note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="nt-section">
          <div className="nt-container">
            <div className="nt-section-head">
              <h2>Why travellers pick NextTrip</h2>
              <p>Fewer people, better guides, and a booking flow that respects your time.</p>
            </div>
            <div className="nt-grid nt-grid--4">
              {FEATURES.map((f) => (
                <div key={f.title} className="nt-feature">
                  <div className="nt-feature__icon" aria-hidden="true">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="nt-section nt-section--tight">
          <div className="nt-container">
            <div className="nt-cta">
              <h2>Your next trip is one account away</h2>
              <p>
                Create a free account to browse live departures, see who is guiding each
                route, and hold a place before it fills.
              </p>
              <div style={{ marginTop: '1.75rem' }}>
                <Link to="/signup" className="nt-btn nt-btn--accent nt-btn--lg">
                  Create free account
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  /* ------------------------------------------------------------- admin ---- */
  if (user.role === 'admin') {
    return (
      <section className="nt-section">
        <div className="nt-container">
          <span className="nt-eyebrow">Admin</span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>
            Welcome back, {user.name}
          </h1>
          <p className="nt-lead" style={{ marginBottom: '2.5rem' }}>
            Manage users, tours, and bookings across the platform.
          </p>

          <div className="nt-grid nt-grid--3">
            {[
              { icon: '👥', title: 'Users', body: 'Create, view, and manage every account.' },
              { icon: '🗺️', title: 'Tours', body: 'Publish new routes, edit details, retire old ones.' },
              { icon: '📊', title: 'Bookings', body: 'Monitor reservations across the platform.' },
            ].map((c) => (
              <div key={c.title} className="nt-card nt-card--pad nt-feature">
                <div className="nt-feature__icon" aria-hidden="true">{c.icon}</div>
                <h3>{c.title}</h3>
                <p style={{ marginBottom: '1.5rem' }}>{c.body}</p>
                <Link to="/admin" className="nt-btn nt-btn--primary nt-btn--sm">
                  Open dashboard
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* -------------------------------------------------- signed-in browsing ---- */
  return (
    <>
      <section className="nt-hero">
        <div className="nt-container">
          <span className="nt-eyebrow">✦ Welcome back, {user.name}</span>
          <h1 style={{ maxWidth: '16ch' }}>
            Where are you <span className="nt-hero__accent">going next?</span>
          </h1>
          <p className="nt-lead" style={{ marginBottom: '2rem' }}>
            Browse live departures and hold your place in a few taps.
          </p>

          <div className="nt-search">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations, tours, or regions"
              aria-label="Search tours"
            />
            <span className="nt-btn nt-btn--primary" aria-hidden="true">Search</span>
          </div>

          <div className="nt-chips" style={{ marginTop: '1.25rem' }}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={category === c ? 'nt-chip nt-chip--on' : 'nt-chip'}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="nt-section">
        <div className="nt-container">
          {error && <div className="nt-alert nt-alert--error">{error}</div>}

          {/* Ongoing */}
          <div style={{ marginBottom: '4rem' }}>
            <div className="nt-row nt-section-head">
              <div>
                <span className="nt-badge nt-badge--live">● Booking open</span>
                <h2 style={{ marginTop: '.75rem', marginBottom: '.25rem' }}>Ongoing tours</h2>
                <p>Departures you can join right now.</p>
              </div>
            </div>

            {loading ? (
              <div className="nt-grid nt-grid--tours">
                {[0, 1, 2].map((i) => <TourSkeleton key={i} />)}
              </div>
            ) : ongoing.length === 0 ? (
              <div className="nt-empty">
                <div className="nt-empty__icon" aria-hidden="true">🧭</div>
                <h3>No tours match that search</h3>
                <p>Try a different destination or clear your filters.</p>
                <button
                  className="nt-btn nt-btn--ghost"
                  onClick={() => { setQuery(''); setCategory('All'); }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="nt-grid nt-grid--tours">
                {ongoing.map((tour) => (
                  <TourCard
                    key={tour._id}
                    tour={tour}
                    onBook={(id) => navigate(`/book-tour/${id}`)}
                    onPeek={() => setShowUpcomingDialog(true)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Upcoming */}
          <div>
            <div className="nt-row nt-section-head">
              <div>
                <span className="nt-badge nt-badge--soon">◷ Coming soon</span>
                <h2 style={{ marginTop: '.75rem', marginBottom: '.25rem' }}>Upcoming tours</h2>
                <p>Routes opening for booking shortly.</p>
              </div>
            </div>

            {loading ? (
              <div className="nt-grid nt-grid--tours">
                {[0, 1, 2].map((i) => <TourSkeleton key={i} />)}
              </div>
            ) : upcoming.length === 0 ? (
              <div className="nt-empty">
                <div className="nt-empty__icon" aria-hidden="true">⏳</div>
                <h3>Nothing upcoming yet</h3>
                <p>New departures are added regularly — check back soon.</p>
              </div>
            ) : (
              <div className="nt-grid nt-grid--tours">
                {upcoming.map((tour) => (
                  <TourCard
                    key={tour._id}
                    tour={tour}
                    onBook={(id) => navigate(`/book-tour/${id}`)}
                    onPeek={() => setShowUpcomingDialog(true)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {showUpcomingDialog && (
        <div
          className="nt-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="nt-upcoming-title"
          onClick={() => setShowUpcomingDialog(false)}
        >
          <div className="nt-modal__panel" onClick={(e) => e.stopPropagation()}>
            <div className="nt-empty__icon" aria-hidden="true">⏳</div>
            <h3 id="nt-upcoming-title">Not open for booking yet</h3>
            <p style={{ color: 'var(--muted)' }}>
              This tour is still marked upcoming. We will open places as soon as the
              departure is confirmed — check back shortly.
            </p>
            <button
              className="nt-btn nt-btn--primary nt-btn--block"
              style={{ marginTop: '1.5rem' }}
              onClick={() => setShowUpcomingDialog(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
