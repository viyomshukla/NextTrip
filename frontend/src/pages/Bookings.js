import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const Bookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:5000/api/bookings', {
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
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
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

  if (loading) return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#4a5568',
      fontSize: '1.5rem',
      fontWeight: '600'
    }}>
      <div style={{
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
        Loading your bookings...
      </div>
    </div>
  );

  if (error) return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#4a5568'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        {error}
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2rem',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '4rem',
          color: '#2d3748'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '700',
            margin: '0 0 1rem 0',
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            📋 My Bookings
          </h1>
          <p style={{
            fontSize: '1.3rem',
            opacity: 0.8,
            margin: '0',
            maxWidth: '600px',
            margin: '0 auto',
            color: '#4a5568'
          }}>
            Track all your tour bookings and manage your travel plans
          </p>
        </div>

        {bookings.length === 0 ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '4rem',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#4a5568'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📋</div>
            <h2 style={{
              color: '#2d3748',
              margin: '0 0 1rem 0',
              fontSize: '2rem',
              fontWeight: '600'
            }}>
              No Bookings Yet
            </h2>
            <p style={{
              margin: '0 0 2rem 0',
              fontSize: '1.1rem',
              opacity: 0.8
            }}>
              You haven't made any bookings yet. Start exploring our amazing tours!
            </p>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(78, 205, 196, 0.3)'
              }}
            >
              Explore Tours
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: '2rem'
          }}>
            {bookings.map(booking => (
              <div key={booking._id} style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Booking Status Badge */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(78, 205, 196, 0.3)'
                }}>
                  ✅ Confirmed
                </div>

                {/* Tour Image */}
                {booking.tour && booking.tour.image && (
                  <div style={{
                    marginBottom: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <img
                      src={booking.tour.image}
                      alt={booking.tour.name || booking.tour.title}
                      style={{
                        width: '200px',
                        height: '200px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        border: '3px solid rgba(255, 255, 255, 0.5)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Tour Details */}
                <h3 style={{
                  color: '#2d3748',
                  margin: '0 0 1rem 0',
                  fontSize: '1.5rem',
                  fontWeight: '600'
                }}>
                  {booking.tour ? (booking.tour.name || booking.tour.title) : 'Tour Details'}
                </h3>

                <div style={{
                  color: '#4a5568',
                  marginBottom: '2rem',
                  lineHeight: '1.6'
                }}>
                  <p style={{ margin: '0 0 0.5rem 0' }}>
                    <strong>📍 Location:</strong> {booking.tour ? booking.tour.location : 'N/A'}
                  </p>
                  <p style={{ margin: '0 0 0.5rem 0' }}>
                    <strong>⏱️ Duration:</strong> {booking.tour ? `${booking.tour.duration} days` : 'N/A'}
                  </p>
                  <p style={{ margin: '0 0 0.5rem 0' }}>
                    <strong>👥 People:</strong> {booking.numberOfPeople}
                  </p>
                  <p style={{ margin: '0 0 0.5rem 0' }}>
                    <strong>💰 Total Price:</strong> ₹{booking.totalPrice}
                  </p>
                  <p style={{ margin: '0 0 0.5rem 0' }}>
                    <strong>📅 Booked On:</strong> {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Passenger Details */}
                {booking.passengers && booking.passengers.length > 0 && (
                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{
                      color: '#2d3748',
                      margin: '0 0 1rem 0',
                      fontSize: '1.2rem',
                      fontWeight: '600'
                    }}>
                      👤 Passengers ({booking.passengers.length})
                    </h4>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '1rem'
                    }}>
                      {booking.passengers.map((passenger, index) => (
                        <div key={index} style={{
                          background: 'rgba(255, 255, 255, 0.6)',
                          borderRadius: '10px',
                          padding: '1rem',
                          border: '1px solid rgba(255, 255, 255, 0.4)'
                        }}>
                          {passenger.image && (
                            <div style={{
                              textAlign: 'center',
                              marginBottom: '0.5rem'
                            }}>
                              <img
                                src={passenger.image}
                                alt={passenger.name}
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                  border: '2px solid rgba(255, 255, 255, 0.5)'
                                }}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <div style={{
                            color: '#4a5568',
                            fontSize: '0.9rem'
                          }}>
                            <p style={{ margin: '0 0 0.25rem 0', fontWeight: '600' }}>
                              {passenger.name}
                            </p>
                            <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.8rem' }}>
                              📱 {passenger.phone}
                            </p>
                            <p style={{ margin: '0', fontSize: '0.8rem' }}>
                              🆔 {passenger.aadhaar}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'center'
                }}>
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '15px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      boxShadow: '0 4px 15px rgba(240, 147, 251, 0.3)'
                    }}
                  >
                    ❌ Cancel Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Bookings; 