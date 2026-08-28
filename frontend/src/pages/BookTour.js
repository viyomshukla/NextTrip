import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API_BASE from '../config';

// Traveller photos are embedded in the booking JSON as base64, so they must stay
// small enough for the API body limit and a single Mongo document.
const MAX_IMAGE_DIMENSION = 800;
const IMAGE_QUALITY = 0.7;
const MAX_TRAVELLERS = 10;

const BookTour = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking form state
  const [bookingDate, setBookingDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [people, setPeople] = useState([{ name: '', aadhaar: '', phone: '', image: null }]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Get today's date in YYYY-MM-DD format for minimum date
  const today = new Date().toISOString().split('T')[0];

  const fetchTourDetails = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/tours/${tourId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (response.ok) {
        setTour(data);
        setTotalPrice(data.price);
      } else {
        setError('Failed to load tour details');
      }
    } catch (err) {
      setError('Failed to load tour details');
    } finally {
      setLoading(false);
    }
  }, [tourId]);

  useEffect(() => {
    fetchTourDetails();
  }, [fetchTourDetails]);

  useEffect(() => {
    if (tour) {
      setTotalPrice(tour.price * numberOfPeople);
    }
  }, [numberOfPeople, tour]);

  const handleNumberOfPeopleChange = (count) => {
    setNumberOfPeople(count);
    const newPeople = [];
    for (let i = 0; i < count; i++) {
      // Preserve anything already typed when the count grows.
      newPeople.push(people[i] || { name: '', aadhaar: '', phone: '', image: null });
    }
    setPeople(newPeople);
    setValidationErrors({});
  };

  const handlePersonChange = (index, field, value) => {
    const newPeople = [...people];
    newPeople[index][field] = value;
    setPeople(newPeople);

    const newErrors = { ...validationErrors };
    if (newErrors[`${index}-${field}`]) {
      delete newErrors[`${index}-${field}`];
      setValidationErrors(newErrors);
    }
  };

  const handleImageUpload = (index, file) => {
    const newPeople = [...people];
    newPeople[index].image = file;
    setPeople(newPeople);

    const newErrors = { ...validationErrors };
    if (newErrors[`${index}-image`]) {
      delete newErrors[`${index}-image`];
      setValidationErrors(newErrors);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!bookingDate) {
      errors.bookingDate = 'Please select a booking date';
    } else if (bookingDate < today) {
      errors.bookingDate = 'Cannot book for past dates. Please select a future date.';
    }

    people.forEach((person, index) => {
      if (!person.name || person.name.trim() === '') {
        errors[`${index}-name`] = 'Name is required';
      }
      if (!person.aadhaar || person.aadhaar.trim() === '') {
        errors[`${index}-aadhaar`] = 'Aadhaar number is required';
      } else if (person.aadhaar.length !== 12) {
        errors[`${index}-aadhaar`] = 'Aadhaar must be 12 digits';
      }
      if (!person.phone || person.phone.trim() === '') {
        errors[`${index}-phone`] = 'Phone number is required';
      } else if (person.phone.length !== 10) {
        errors[`${index}-phone`] = 'Phone must be 10 digits';
      }
      if (!person.image) {
        errors[`${index}-image`] = 'Photo is required';
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(img.width, img.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', IMAGE_QUALITY));
        };
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const peopleWithImages = await Promise.all(
        people.map(async (person) => {
          let imageBase64 = null;
          if (person.image) {
            imageBase64 = await convertImageToBase64(person.image);
          }
          return {
            name: person.name.trim(),
            aadhaar: person.aadhaar.trim(),
            phone: person.phone.trim(),
            image: imageBase64
          };
        })
      );

      const bookingData = {
        tourId: tourId,
        bookingDate: bookingDate,
        numberOfPeople: numberOfPeople,
        totalPrice: totalPrice,
        people: peopleWithImages
      };

      const response = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bookingData)
      });

      // A failure can happen before the request reaches the JSON API (a 413 from
      // the body parser returns HTML), so don't assume the body parses.
      const raw = await response.text();
      let data = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch (parseErr) {
        // Non-JSON error page; fall through to the status-based message below.
      }

      if (response.ok) {
        navigate('/bookings');
      } else if (response.status === 413) {
        alert('Those photos are too large to upload. Please choose smaller images.');
      } else {
        alert(data.error || `Failed to book tour (server returned ${response.status})`);
      }
    } catch (err) {
      alert('Failed to book tour');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="nt-center-screen">
        <div>
          <div className="nt-spinner" />
          Loading tour details…
        </div>
      </div>
    );
  }

  if (error || !tour) {
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

  return (
    <>
      <header className="nt-pagehead">
        <div className="nt-container">
          <span className="nt-eyebrow">Complete your booking</span>
          <h1>{tour.title}</h1>
          <div className="nt-meta">
            <span className="nt-meta__item">📍 {tour.location || 'To be announced'}</span>
            {tour.duration && <span className="nt-meta__item">⏱️ {tour.duration} days</span>}
            <span className="nt-meta__item">💰 ₹{Number(tour.price).toLocaleString('en-IN')} per person</span>
          </div>
        </div>
      </header>

      <section className="nt-section nt-section--tight">
        <div className="nt-container">
          <div className="nt-steps">
            <span className="nt-step nt-step--on">
              <span className="nt-step__dot">1</span> Trip date
            </span>
            <span className="nt-step__bar" />
            <span className={`nt-step ${bookingDate ? 'nt-step--on' : ''}`}>
              <span className="nt-step__dot">2</span> Travellers
            </span>
            <span className="nt-step__bar" />
            <span className="nt-step">
              <span className="nt-step__dot">3</span> Confirm
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              className="nt-details__grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.7fr) minmax(280px, 1fr)',
                gap: '2.5rem',
                alignItems: 'start',
              }}
            >
              <div className="nt-stack" style={{ gap: '1.5rem' }}>
                {/* Step 1 */}
                <div className="nt-card nt-card--pad">
                  <h3>When are you travelling?</h3>
                  <div className="nt-formgrid">
                    <div className="nt-field">
                      <label className="nt-label" htmlFor="booking-date">Departure date</label>
                      <input
                        id="booking-date"
                        className="nt-input"
                        type="date"
                        min={today}
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                      />
                      {validationErrors.bookingDate && (
                        <div className="nt-error">{validationErrors.bookingDate}</div>
                      )}
                    </div>

                    <div className="nt-field">
                      <label className="nt-label" htmlFor="people-count">Number of travellers</label>
                      <select
                        id="people-count"
                        className="nt-select"
                        value={numberOfPeople}
                        onChange={(e) => handleNumberOfPeopleChange(Number(e.target.value))}
                      >
                        {Array.from({ length: MAX_TRAVELLERS }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>{n} {n === 1 ? 'traveller' : 'travellers'}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div>
                  <h3>Traveller details</h3>
                  <p className="nt-help" style={{ marginBottom: '1rem' }}>
                    Aadhaar and a photo are required for each traveller. Photos are
                    resized automatically before upload.
                  </p>

                  <div className="nt-stack">
                    {people.map((person, index) => (
                      <div key={index} className="nt-traveller">
                        <div className="nt-traveller__head">
                          <span className="nt-avatar">{index + 1}</span>
                          Traveller {index + 1}
                        </div>

                        <div className="nt-formgrid">
                          <div className="nt-field">
                            <label className="nt-label">Full name</label>
                            <input
                              className="nt-input"
                              type="text"
                              value={person.name}
                              onChange={(e) => handlePersonChange(index, 'name', e.target.value)}
                              placeholder="As printed on ID"
                            />
                            {validationErrors[`${index}-name`] && (
                              <div className="nt-error">{validationErrors[`${index}-name`]}</div>
                            )}
                          </div>

                          <div className="nt-field">
                            <label className="nt-label">Phone number</label>
                            <input
                              className="nt-input"
                              type="tel"
                              inputMode="numeric"
                              maxLength={10}
                              value={person.phone}
                              onChange={(e) =>
                                handlePersonChange(index, 'phone', e.target.value.replace(/\D/g, ''))
                              }
                              placeholder="10 digits"
                            />
                            {validationErrors[`${index}-phone`] && (
                              <div className="nt-error">{validationErrors[`${index}-phone`]}</div>
                            )}
                          </div>

                          <div className="nt-field">
                            <label className="nt-label">Aadhaar number</label>
                            <input
                              className="nt-input"
                              type="text"
                              inputMode="numeric"
                              maxLength={12}
                              value={person.aadhaar}
                              onChange={(e) =>
                                handlePersonChange(index, 'aadhaar', e.target.value.replace(/\D/g, ''))
                              }
                              placeholder="12 digits"
                            />
                            {validationErrors[`${index}-aadhaar`] && (
                              <div className="nt-error">{validationErrors[`${index}-aadhaar`]}</div>
                            )}
                          </div>

                          <div className="nt-field">
                            <label className="nt-label">Photo</label>
                            <label className="nt-file">
                              {person.image ? (
                                <>
                                  <img
                                    className="nt-file__thumb"
                                    src={URL.createObjectURL(person.image)}
                                    alt=""
                                  />
                                  <span style={{ color: 'var(--ink)', fontWeight: 600 }}>
                                    Photo added — change
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span style={{ fontSize: '1.3rem' }}>📷</span>
                                  <span>Upload a photo</span>
                                </>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(index, e.target.files[0])}
                              />
                            </label>
                            {validationErrors[`${index}-image`] && (
                              <div className="nt-error">{validationErrors[`${index}-image`]}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <aside
                className="nt-card nt-card--pad"
                style={{ position: 'sticky', top: 'calc(var(--nav-h) + 1.5rem)' }}
              >
                <h3>Booking summary</h3>

                <div className="nt-stack nt-stack--sm" style={{ margin: '1.25rem 0' }}>
                  <div className="nt-row" style={{ fontSize: '.93rem' }}>
                    <span style={{ color: 'var(--muted)' }}>Tour</span>
                    <span style={{ fontWeight: 600, textAlign: 'right' }}>{tour.title}</span>
                  </div>
                  <div className="nt-row" style={{ fontSize: '.93rem' }}>
                    <span style={{ color: 'var(--muted)' }}>Date</span>
                    <span style={{ fontWeight: 600 }}>{bookingDate || 'Not selected'}</span>
                  </div>
                  <div className="nt-row" style={{ fontSize: '.93rem' }}>
                    <span style={{ color: 'var(--muted)' }}>Travellers</span>
                    <span style={{ fontWeight: 600 }}>{numberOfPeople}</span>
                  </div>
                  <div className="nt-row" style={{ fontSize: '.93rem' }}>
                    <span style={{ color: 'var(--muted)' }}>
                      ₹{Number(tour.price).toLocaleString('en-IN')} × {numberOfPeople}
                    </span>
                    <span style={{ fontWeight: 600 }}>
                      ₹{Number(totalPrice).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div
                  className="nt-row"
                  style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)' }}
                >
                  <span style={{ fontWeight: 700 }}>Total</span>
                  <span className="nt-price">₹{Number(totalPrice).toLocaleString('en-IN')}</span>
                </div>

                <button
                  type="submit"
                  className="nt-btn nt-btn--accent nt-btn--block nt-btn--lg"
                  disabled={submitting}
                  style={{ marginTop: '1.5rem' }}
                >
                  {submitting ? 'Confirming…' : 'Confirm booking'}
                </button>

                <button
                  type="button"
                  className="nt-btn nt-btn--quiet nt-btn--block nt-btn--sm"
                  style={{ marginTop: '.5rem' }}
                  onClick={() => navigate(-1)}
                >
                  Back
                </button>
              </aside>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default BookTour;
