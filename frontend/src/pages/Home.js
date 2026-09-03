import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import API_BASE from '../config';
import Icon from '../components/Icon';
import himalayasImg from '../Assests/himalayas-tile.jpg';
import rajasthanImg from '../Assests/rajasthan-tile.jpg';
import keralaImg from '../Assests/kerala-tile.jpg';
import goaImg from '../Assests/goa-tile.jpg';

const HERO_TILES = [
  { cls: 'nt-tile--a nt-tile--tall', name: 'Himalayas', note: 'Treks & high passes', img: himalayasImg },
  { cls: 'nt-tile--b', name: 'Rajasthan', note: 'Forts & desert', img: rajasthanImg },
  { cls: 'nt-tile--c nt-tile--tall', name: 'Kerala', note: 'Backwaters', img: keralaImg },
  { cls: 'nt-tile--d', name: 'Goa', note: 'Coast & culture', img: goaImg },
];

const FEATURES = [
  { icon: 'compass', title: 'Local guides', body: 'Every trip is led by someone who actually lives there.' },
  { icon: 'users', title: 'Small groups', body: 'Capped at ten travellers, so nothing feels like a coach tour.' },
  { icon: 'shield', title: 'Clear pricing', body: 'The price you see covers the itinerary. No surprise add-ons.' },
  { icon: 'bolt', title: 'Fast booking', body: 'Reserve a place in a couple of minutes, traveller details included.' },
];

const STEPS = [
  {
    title: 'Pick a departure',
    body: 'Browse live trips by region or interest. Every listing shows the exact route, dates, and who is guiding it.',
  },
  {
    title: 'Hold your place',
    body: 'Add your traveller details and reserve. You get a confirmation immediately, with the full itinerary attached.',
  },
  {
    title: 'Go, with support',
    body: 'Your guide gets in touch before departure. We stay reachable for the whole trip, not just the booking.',
  },
];

/* Placeholder copy for layout — replace with real reviews before launch. */
const REVIEWS = [
  {
    quote:
      'Ten of us, one guide who grew up in the valley, and zero filler days. The first trip where I never once felt like a tourist.',
    name: 'Ananya R.',
    trip: 'Leh–Nubra crossing',
  },
  {
    quote:
      'Booked on a Thursday, was on a bus through the Western Ghats by Saturday. The whole thing took less time than picking a restaurant.',
    name: 'Dev M.',
    trip: 'Kerala backwaters',
  },
  {
    quote:
      'The price on the page was the price I paid. After years of resort upsells that alone was worth the booking.',
    name: 'Farah S.',
    trip: 'Jaisalmer & Thar desert',
  },
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

const Stars = ({ value = 5 }) => (
  <span className="nt-stars" aria-label={`${value} out of 5`}>
    {[0, 1, 2, 3, 4].map((i) => (
      <Icon key={i} name="star" className={i < value ? '' : 'nt-stars__off'} />
    ))}
  </span>
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
          <Icon name="mountain" size="2.5rem" />
        )}
        <span className={`nt-badge nt-badge--float ${isOngoing ? 'nt-badge--live' : 'nt-badge--soon'}`}>
          <span className={isOngoing ? 'nt-dot nt-dot--live' : 'nt-dot'} />
          {isOngoing ? 'Booking open' : 'Coming soon'}
        </span>
      </div>

      <div className="nt-tour__body">
        <h3 className="nt-tour__title">{tour.title}</h3>

        <p className="nt-tour__loc">
          <Icon name="pin" />
          {tour.location || 'Location to be announced'}
          {tour.duration ? (
            <>
              <span className="nt-tour__sep" />
              <Icon name="clock" />
              {tour.duration} days
            </>
          ) : null}
        </p>

        {tour.description && <p className="nt-tour__desc">{tour.description}</p>}

        <div className="nt-tour__foot">
          <div className="nt-price">
            ₹{Number(tour.price).toLocaleString('en-IN')} <span>/ person</span>
          </div>
          {isOngoing ? (
            <button className="nt-btn nt-btn--accent nt-btn--sm" onClick={() => onBook(tour._id)}>
              Book now
              <Icon name="arrowRight" />
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
  const isFiltered = query.trim() !== '' || category !== 'All';

  /* ------------------------------------------------------ guest landing ---- */
  if (!user) {
    return (
      <>
        <section className="nt-hero">
          <div className="nt-container">
            <div className="nt-hero__grid">
              <div className="nt-rise">
                <span className="nt-eyebrow">
                  <Icon name="sparkle" />
                  Small-group travel
                </span>
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
                    <Icon name="arrowRight" />
                  </Link>
                  <Link to="/login" className="nt-btn nt-btn--ghost nt-btn--lg">
                    I have an account
                  </Link>
                </div>

                <div className="nt-trust">
                  <Stars value={5} />
                  <span>
                    <strong>4.8 out of 5</strong> from 1,200+ travellers
                  </span>
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
                    <div className="nt-stat__num">18</div>
                    <div className="nt-stat__label">Regions covered</div>
                  </div>
                </div>
              </div>

              <div className="nt-hero__art" aria-hidden="true">
                {HERO_TILES.map((t, i) => (
                  <div key={t.name} className={`nt-tile ${t.cls}`}>
                    <img
                      className="nt-tile__img"
                      src={t.img}
                      alt=""
                      /* The first tile is the largest and sits above the fold. */
                      loading={i === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                    <div className="nt-tile__label">
                      {t.name}
                      <span>{t.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="nt-section">
          <div className="nt-container">
            <div className="nt-section-head nt-section-head--center">
              <span className="nt-eyebrow">
                <Icon name="shield" />
                Why NextTrip
              </span>
              <h2>Built for people who hate package tours</h2>
              <p>Fewer people, better guides, and a booking flow that respects your time.</p>
            </div>
            <div className="nt-grid nt-grid--4">
              {FEATURES.map((f) => (
                <div key={f.title} className="nt-feature">
                  <div className="nt-feature__icon">
                    <Icon name={f.icon} size="1.4rem" />
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="nt-section nt-section--alt">
          <div className="nt-container">
            <div className="nt-section-head nt-section-head--center">
              <span className="nt-eyebrow">
                <Icon name="map" />
                How it works
              </span>
              <h2>Three steps, then you are packing</h2>
              <p>No enquiry forms, no callbacks, no waiting on a quote.</p>
            </div>

            <ol className="nt-how">
              {STEPS.map((s, i) => (
                <li key={s.title} className="nt-how__item">
                  <span className="nt-how__num">{i + 1}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="nt-section">
          <div className="nt-container">
            <div className="nt-section-head nt-section-head--center">
              <span className="nt-eyebrow">
                <Icon name="quote" />
                Travellers
              </span>
              <h2>What people say when they get back</h2>
            </div>

            <div className="nt-grid nt-grid--3">
              {REVIEWS.map((r) => (
                <figure key={r.name} className="nt-review">
                  <Stars value={5} />
                  <blockquote>{r.quote}</blockquote>
                  <figcaption>
                    <span className="nt-avatar nt-avatar--lg">{r.name.charAt(0)}</span>
                    <span>
                      <strong>{r.name}</strong>
                      <small>{r.trip}</small>
                    </span>
                  </figcaption>
                </figure>
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
              <div className="nt-cta__actions">
                <Link to="/signup" className="nt-btn nt-btn--accent nt-btn--lg">
                  Create free account
                  <Icon name="arrowRight" />
                </Link>
              </div>
              <ul className="nt-cta__points">
                <li><Icon name="check" /> Free to join</li>
                <li><Icon name="check" /> No card required</li>
                <li><Icon name="check" /> Cancel any hold</li>
              </ul>
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
          <span className="nt-eyebrow">
            <Icon name="chart" />
            Admin
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>
            Welcome back, {user.name}
          </h1>
          <p className="nt-lead" style={{ marginBottom: '2.5rem' }}>
            Manage users, tours, and bookings across the platform.
          </p>

          <div className="nt-grid nt-grid--3">
            {[
              { icon: 'users', title: 'Users', body: 'Create, view, and manage every account.' },
              { icon: 'map', title: 'Tours', body: 'Publish new routes, edit details, retire old ones.' },
              { icon: 'chart', title: 'Bookings', body: 'Monitor reservations across the platform.' },
            ].map((c) => (
              <div key={c.title} className="nt-card nt-card--pad nt-feature">
                <div className="nt-feature__icon">
                  <Icon name={c.icon} size="1.4rem" />
                </div>
                <h3>{c.title}</h3>
                <p style={{ marginBottom: '1.5rem' }}>{c.body}</p>
                <Link to="/admin" className="nt-btn nt-btn--primary nt-btn--sm">
                  Open dashboard
                  <Icon name="arrowRight" />
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
      <section className="nt-hero nt-hero--compact">
        <div className="nt-container">
          <span className="nt-eyebrow">
            <Icon name="sparkle" />
            Welcome back, {user.name}
          </span>
          <h1 style={{ maxWidth: '16ch' }}>
            Where are you <span className="nt-hero__accent">going next?</span>
          </h1>
          <p className="nt-lead" style={{ marginBottom: '2rem' }}>
            Browse live departures and hold your place in a few taps.
          </p>

          {/* Submitting is a no-op: filtering already runs live as you type. */}
          <form className="nt-search" role="search" onSubmit={(e) => e.preventDefault()}>
            <Icon name="search" className="nt-search__icon" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search destinations, tours, or regions"
              aria-label="Search tours"
            />
            {query && (
              <button
                type="button"
                className="nt-search__clear"
                onClick={() => setQuery('')}
                aria-label="Clear search"
              >
                <Icon name="close" />
              </button>
            )}
            <button type="submit" className="nt-btn nt-btn--primary">
              Search
            </button>
          </form>

          <div className="nt-chips" style={{ marginTop: '1.25rem' }}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                className={category === c ? 'nt-chip nt-chip--on' : 'nt-chip'}
                aria-pressed={category === c}
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
                <span className="nt-badge nt-badge--live">
                  <span className="nt-dot nt-dot--live" />
                  Booking open
                </span>
                <h2 style={{ marginTop: '.75rem', marginBottom: '.25rem' }}>Ongoing tours</h2>
                <p>Departures you can join right now.</p>
              </div>
              {!loading && ongoing.length > 0 && (
                <span className="nt-count">
                  {ongoing.length} {ongoing.length === 1 ? 'trip' : 'trips'}
                </span>
              )}
            </div>

            {loading ? (
              <div className="nt-grid nt-grid--tours">
                {[0, 1, 2].map((i) => <TourSkeleton key={i} />)}
              </div>
            ) : ongoing.length === 0 ? (
              <div className="nt-empty">
                <div className="nt-empty__icon">
                  <Icon name="compass" size="1.75rem" />
                </div>
                <h3>{isFiltered ? 'No tours match that search' : 'No departures open yet'}</h3>
                <p>
                  {isFiltered
                    ? 'Try a different destination or clear your filters.'
                    : 'New routes are added regularly — check back soon.'}
                </p>
                {isFiltered && (
                  <button
                    className="nt-btn nt-btn--ghost"
                    onClick={() => { setQuery(''); setCategory('All'); }}
                  >
                    Clear filters
                  </button>
                )}
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
                <span className="nt-badge nt-badge--soon">
                  <span className="nt-dot" />
                  Coming soon
                </span>
                <h2 style={{ marginTop: '.75rem', marginBottom: '.25rem' }}>Upcoming tours</h2>
                <p>Routes opening for booking shortly.</p>
              </div>
              {!loading && upcoming.length > 0 && (
                <span className="nt-count">
                  {upcoming.length} {upcoming.length === 1 ? 'trip' : 'trips'}
                </span>
              )}
            </div>

            {loading ? (
              <div className="nt-grid nt-grid--tours">
                {[0, 1, 2].map((i) => <TourSkeleton key={i} />)}
              </div>
            ) : upcoming.length === 0 ? (
              <div className="nt-empty">
                <div className="nt-empty__icon">
                  <Icon name="clock" size="1.75rem" />
                </div>
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
            <div className="nt-empty__icon">
              <Icon name="clock" size="1.75rem" />
            </div>
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
