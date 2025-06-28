import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footer';

const Home = () => {
  const { user, logout } = useContext(AuthContext);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTour, setNewTour] = useState({ title: '', description: '', price: '', category: '', image: '' });
  const [createMsg, setCreateMsg] = useState('');
  const [showUpcomingDialog, setShowUpcomingDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:5000/api/tours', {
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
  }, [user]);

  const handleDeleteTour = async (tourId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tours/${tourId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        setTours(tours.filter(t => t._id !== tourId));
      }
    } catch (err) {
      console.error('Failed to delete tour:', err);
    }
  };

  const handleCreateTour = async (e) => {
    e.preventDefault();
    setCreateMsg('');
    try {
      const response = await fetch('http://localhost:5000/api/tours', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(newTour)
      });
      const data = await response.json();
      if (response.ok) {
        setTours([...tours, data]);
        setNewTour({ title: '', description: '', price: '', category: '', image: '' });
        setShowCreateForm(false);
        setCreateMsg('Tour created successfully!');
      } else {
        setCreateMsg(data.error || 'Failed to create tour');
      }
    } catch (err) {
      setCreateMsg('Failed to create tour');
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
        Loading NextTrip...
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

  // Admin Dashboard View
  if (user && user.role === 'admin') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: '2rem',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#2d3748'
          }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: '700',
              margin: '0 0 1rem 0',
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              🏠 NextTrip Admin Dashboard
            </h1>
            <p style={{
              fontSize: '1.2rem',
              opacity: 0.8,
              margin: '0',
              color: '#4a5568'
            }}>
              Welcome back, {user.name}! 🎉
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2rem',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👥</div>
              <h3 style={{ color: '#2d3748', margin: '0 0 1rem 0', fontSize: '1.5rem' }}>Manage Users</h3>
              <p style={{ color: '#4a5568', margin: '0 0 2rem 0' }}>Create, view, and manage all users</p>
              <Link to="/admin" style={{
                display: 'inline-block',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '25px',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(78, 205, 196, 0.3)'
              }}>
                Go to Users
              </Link>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2rem',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🗺️</div>
              <h3 style={{ color: '#2d3748', margin: '0 0 1rem 0', fontSize: '1.5rem' }}>Manage Tours</h3>
              <p style={{ color: '#4a5568', margin: '0 0 2rem 0' }}>Create, edit, and delete tours</p>
              <Link to="/admin" style={{
                display: 'inline-block',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '25px',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
              }}>
                Go to Tours
              </Link>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2rem',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
              <h3 style={{ color: '#2d3748', margin: '0 0 1rem 0', fontSize: '1.5rem' }}>View Bookings</h3>
              <p style={{ color: '#4a5568', margin: '0 0 2rem 0' }}>Monitor all bookings across the platform</p>
              <Link to="/admin" style={{
                display: 'inline-block',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '25px',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(240, 147, 251, 0.3)'
              }}>
                View Bookings
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular User View
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2rem',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Hero Section */}
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
            Welcome to NextTrip
          </h1>
          <p style={{
            fontSize: '1.3rem',
            opacity: 0.8,
            margin: '0',
            maxWidth: '600px',
            margin: '0 auto',
            color: '#4a5568'
          }}>
            Discover amazing destinations and create unforgettable memories with our curated tour experiences
          </p>
        </div>

        {/* Ongoing Tours Section */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '2rem',
            gap: '1rem'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              boxShadow: '0 8px 25px rgba(78, 205, 196, 0.3)'
            }}>
              🟢
            </div>
            <h2 style={{
              color: '#2d3748',
              margin: '0',
              fontSize: '2.5rem',
              fontWeight: '600',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              Ongoing Tours
            </h2>
          </div>

          {tours.filter(tour => tour.status === 'ongoing').length === 0 ? (
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '3rem',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#4a5568'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌍</div>
              <p style={{ margin: '0', fontSize: '1.2rem', opacity: 0.8 }}>No ongoing tours at the moment.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '2rem'
            }}>
              {tours.filter(tour => tour.status === 'ongoing').map(tour => (
                <div key={tour._id} style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '2rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  transform: 'perspective(1000px) rotateY(0deg)',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                >
                  {/* Status Badge */}
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
                    🟢 Active
                  </div>

                  {tour.image && (
                    <div style={{
                      marginBottom: '1.5rem',
                      textAlign: 'center'
                    }}>
                      <img
                        src={tour.image}
                        alt={tour.name || tour.title}
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

                  <h3 style={{
                    color: '#2d3748',
                    margin: '0 0 1rem 0',
                    fontSize: '1.5rem',
                    fontWeight: '600'
                  }}>
                    {tour.name || tour.title}
                  </h3>

                  <div style={{
                    color: '#4a5568',
                    marginBottom: '2rem',
                    lineHeight: '1.6'
                  }}>
                    <p style={{ margin: '0 0 0.5rem 0' }}>
                      <strong>📍 Location:</strong> {tour.location}
                    </p>
                    <p style={{ margin: '0 0 0.5rem 0' }}>
                      <strong>⏱️ Duration:</strong> {tour.duration} days
                    </p>
                    <p style={{ margin: '0 0 0.5rem 0' }}>
                      <strong>💰 Price:</strong> ₹{tour.price}
                    </p>
                    <p style={{ margin: '0' }}>
                      <strong>📝 Description:</strong> {tour.description}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/book-tour/${tour._id}`)}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '15px',
                      cursor: 'pointer',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(78, 205, 196, 0.3)'
                    }}
                  >
                    Book This Tour
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Tours Section */}
        <div style={{ marginBottom: '4rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '2rem',
            gap: '1rem'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
            }}>
              🔵
            </div>
            <h2 style={{
              color: '#2d3748',
              margin: '0',
              fontSize: '2.5rem',
              fontWeight: '600',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              Upcoming Tours
            </h2>
          </div>

          {tours.filter(tour => tour.status === 'upcoming').length === 0 ? (
            <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '3rem',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#4a5568'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⏰</div>
              <p style={{ margin: '0', fontSize: '1.2rem', opacity: 0.8 }}>No upcoming tours available at the moment.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '2rem'
            }}>
              {tours.filter(tour => tour.status === 'upcoming').map(tour => (
                <div key={tour._id} style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '2rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  transform: 'perspective(1000px) rotateY(0deg)',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                >
                  {/* Status Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                  }}>
                    🔵 Coming Soon
                  </div>

                  {tour.image && (
                    <div style={{
                      marginBottom: '1.5rem',
                      textAlign: 'center'
                    }}>
                      <img
                        src={tour.image}
                        alt={tour.name || tour.title}
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

                  <h3 style={{
                    color: '#2d3748',
                    margin: '0 0 1rem 0',
                    fontSize: '1.5rem',
                    fontWeight: '600'
                  }}>
                    {tour.name || tour.title}
                  </h3>

                  <div style={{
                    color: '#4a5568',
                    marginBottom: '2rem',
                    lineHeight: '1.6'
                  }}>
                    <p style={{ margin: '0 0 0.5rem 0' }}>
                      <strong>📍 Location:</strong> {tour.location}
                    </p>
                    <p style={{ margin: '0 0 0.5rem 0' }}>
                      <strong>⏱️ Duration:</strong> {tour.duration} days
                    </p>
                    <p style={{ margin: '0 0 0.5rem 0' }}>
                      <strong>💰 Price:</strong> ₹{tour.price}
                    </p>
                    <p style={{ margin: '0' }}>
                      <strong>📝 Description:</strong> {tour.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (tour.status === 'upcoming') {
                        setShowUpcomingDialog(true);
                      } else {
                        navigate(`/book-tour/${tour._id}`);
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '15px',
                      cursor: 'pointer',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    ⏰ Coming Soon
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Tour Dialog */}
        {showUpcomingDialog && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              padding: '3rem',
              borderRadius: '20px',
              maxWidth: '500px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              transform: 'perspective(1000px) rotateY(0deg)',
              animation: 'slideIn 0.3s ease'
            }}>
              <div style={{
                fontSize: '4rem',
                marginBottom: '1.5rem'
              }}>
                ⏰
              </div>
              <h3 style={{
                margin: '0 0 1rem 0',
                color: '#667eea',
                fontSize: '1.8rem',
                fontWeight: '600'
              }}>
                Tour Not Active Yet
              </h3>
              <p style={{
                margin: '0 0 2rem 0',
                color: '#4a5568',
                lineHeight: '1.6',
                fontSize: '1.1rem'
              }}>
                This tour is currently marked as "Upcoming" and is not available for booking yet. 
                Please check back later or contact the admin for more information.
              </p>
              <button
                onClick={() => setShowUpcomingDialog(false)}
                style={{
                  padding: '1rem 2rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                }}
              >
                Got it!
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home; 