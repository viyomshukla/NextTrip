import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Footer from '../components/Footer';

const BookTour = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Booking form state
  const [bookingDate, setBookingDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [people, setPeople] = useState([{
    name: '',
    aadhaar: '',
    phone: '',
    image: null
  }]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Get today's date in YYYY-MM-DD format for minimum date
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchTourDetails();
  }, [tourId]);

  useEffect(() => {
    if (tour) {
      setTotalPrice(tour.price * numberOfPeople);
    }
  }, [numberOfPeople, tour]);

  const fetchTourDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/tours/${tourId}`, {
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
  };

  const handleNumberOfPeopleChange = (count) => {
    setNumberOfPeople(count);
    const newPeople = [];
    for (let i = 0; i < count; i++) {
      newPeople.push({
        name: '',
        aadhaar: '',
        phone: '',
        image: null
      });
    }
    setPeople(newPeople);
    setValidationErrors({});
  };

  const handlePersonChange = (index, field, value) => {
    const newPeople = [...people];
    newPeople[index][field] = value;
    setPeople(newPeople);
    
    // Clear validation error for this field
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
    
    // Clear validation error for image
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      // Convert images to base64 for storage
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

      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();
      if (response.ok) {
        alert('Tour booked successfully!');
        navigate('/bookings');
      } else {
        alert(data.error || 'Failed to book tour');
      }
    } catch (err) {
      alert('Failed to book tour');
    } finally {
      setSubmitting(false);
    }
  };

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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
        Loading tour details...
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

  if (!tour) return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#4a5568'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
        Tour not found
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
          marginBottom: '3rem',
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
            🎫 Book Your Adventure
          </h1>
          <p style={{
            fontSize: '1.2rem',
            opacity: 0.8,
            margin: '0',
            color: '#4a5568'
          }}>
            Complete your booking details below
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          {/* Tour Details Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            height: 'fit-content'
          }}>
            <h2 style={{
              color: '#2d3748',
              margin: '0 0 1.5rem 0',
              fontSize: '2rem',
              fontWeight: '600',
              textAlign: 'center',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              🏔️ {tour.title || tour.name}
            </h2>
            
            {tour.image && (
              <div style={{
                textAlign: 'center',
                marginBottom: '1.5rem'
              }}>
                <img 
                  src={tour.image} 
                  alt={tour.title || tour.name} 
                  style={{
                    width: '100%',
                    maxWidth: '300px',
                    height: '200px',
                    borderRadius: '15px',
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
            
            <div style={{
              color: '#4a5568',
              lineHeight: '1.8'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '15px',
                padding: '1rem',
                marginBottom: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.4)'
              }}>
                <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem' }}>
                  📍 Location
                </div>
                <div>{tour.location}</div>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '15px',
                padding: '1rem',
                marginBottom: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.4)'
              }}>
                <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem' }}>
                  ⏱️ Duration
                </div>
                <div>{tour.duration} days</div>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '15px',
                padding: '1rem',
                marginBottom: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.4)'
              }}>
                <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem' }}>
                  💰 Price per person
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#28a745' }}>
                  ₹{tour.price}
                </div>
              </div>
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '15px',
                padding: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.4)'
              }}>
                <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.5rem' }}>
                  📝 Description
                </div>
                <div>{tour.description}</div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{
              color: '#2d3748',
              margin: '0 0 2rem 0',
              fontSize: '2rem',
              fontWeight: '600',
              textAlign: 'center',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              🎫 Booking Details
            </h2>
            
            <form onSubmit={handleSubmit}>
              {/* Booking Date */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  color: '#2d3748',
                  marginBottom: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}>
                  📅 Booking Date *
                </label>
                <div style={{
                  fontSize: '0.85rem',
                  color: '#4a5568',
                  marginBottom: '0.5rem',
                  fontStyle: 'italic'
                }}>
                  
                </div>
                <input
                  type="date"
                  value={bookingDate}
                  min={today}
                  onChange={e => {
                    setBookingDate(e.target.value);
                    // Clear validation error for booking date
                    if (validationErrors.bookingDate) {
                      const newErrors = { ...validationErrors };
                      delete newErrors.bookingDate;
                      setValidationErrors(newErrors);
                    }
                  }}
                  required
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '15px',
                    border: validationErrors.bookingDate ? '2px solid #e53e3e' : '2px solid rgba(102, 126, 234, 0.3)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: '#2d3748',
                    fontSize: '1rem',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                {validationErrors.bookingDate && (
                  <div style={{
                    color: '#e53e3e',
                    fontSize: '0.9rem',
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>⚠️</span>
                    <span>{validationErrors.bookingDate}</span>
                  </div>
                )}
              </div>

              {/* Number of People */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  color: '#2d3748',
                  marginBottom: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}>
                  👥 Number of People *
                </label>
                <select
                  value={numberOfPeople}
                  onChange={e => handleNumberOfPeopleChange(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '15px',
                    border: '2px solid rgba(102, 126, 234, 0.3)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    color: '#2d3748',
                    fontSize: '1rem',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                  ))}
                </select>
              </div>

              {/* Total Price Display */}
              <div style={{
                background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                borderRadius: '15px',
                padding: '1.5rem',
                marginBottom: '2rem',
                textAlign: 'center',
                boxShadow: '0 8px 25px rgba(78, 205, 196, 0.3)'
              }}>
                <div style={{
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  💰 Total Price
                </div>
                <div style={{
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: '700'
                }}>
                  ₹{totalPrice}
                </div>
                <div style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.9rem'
                }}>
                  ₹{tour.price} × {numberOfPeople} {numberOfPeople === 1 ? 'person' : 'people'}
                </div>
              </div>

              {/* People Details */}
              <h3 style={{
                color: '#2d3748',
                margin: '0 0 1.5rem 0',
                fontSize: '1.5rem',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                👤 Passenger Information
              </h3>
              
              {people.map((person, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.4)'
                }}>
                  <h4 style={{
                    color: '#2d3748',
                    margin: '0 0 1rem 0',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>
                    Passenger {index + 1}
                  </h4>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        color: '#4a5568',
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}>
                        👤 Full Name *
                      </label>
                      <input
                        type="text"
                        value={person.name}
                        onChange={e => handlePersonChange(index, 'name', e.target.value)}
                        required
                        placeholder="Enter full name"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '10px',
                          border: validationErrors[`${index}-name`] ? '2px solid #e53e3e' : '2px solid rgba(102, 126, 234, 0.3)',
                          background: 'rgba(255, 255, 255, 0.9)',
                          color: '#2d3748',
                          fontSize: '1rem',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      {validationErrors[`${index}-name`] && (
                        <div style={{
                          color: '#e53e3e',
                          fontSize: '0.8rem',
                          marginTop: '0.25rem'
                        }}>
                          ⚠️ {validationErrors[`${index}-name`]}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label style={{
                        display: 'block',
                        color: '#4a5568',
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}>
                        🆔 Aadhaar Number *
                      </label>
                      <input
                        type="text"
                        value={person.aadhaar}
                        onChange={e => handlePersonChange(index, 'aadhaar', e.target.value)}
                        required
                        placeholder="12-digit Aadhaar number"
                        maxLength="12"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '10px',
                          border: validationErrors[`${index}-aadhaar`] ? '2px solid #e53e3e' : '2px solid rgba(102, 126, 234, 0.3)',
                          background: 'rgba(255, 255, 255, 0.9)',
                          color: '#2d3748',
                          fontSize: '1rem',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      {validationErrors[`${index}-aadhaar`] && (
                        <div style={{
                          color: '#e53e3e',
                          fontSize: '0.8rem',
                          marginTop: '0.25rem'
                        }}>
                          ⚠️ {validationErrors[`${index}-aadhaar`]}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        color: '#4a5568',
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}>
                        📱 Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={person.phone}
                        onChange={e => handlePersonChange(index, 'phone', e.target.value)}
                        required
                        placeholder="10-digit phone number"
                        maxLength="10"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '10px',
                          border: validationErrors[`${index}-phone`] ? '2px solid #e53e3e' : '2px solid rgba(102, 126, 234, 0.3)',
                          background: 'rgba(255, 255, 255, 0.9)',
                          color: '#2d3748',
                          fontSize: '1rem',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      {validationErrors[`${index}-phone`] && (
                        <div style={{
                          color: '#e53e3e',
                          fontSize: '0.8rem',
                          marginTop: '0.25rem'
                        }}>
                          ⚠️ {validationErrors[`${index}-phone`]}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label style={{
                        display: 'block',
                        color: '#4a5568',
                        marginBottom: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}>
                        📸 Profile Image *
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageUpload(index, e.target.files[0])}
                        required
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '10px',
                          border: validationErrors[`${index}-image`] ? '2px solid #e53e3e' : '2px solid rgba(102, 126, 234, 0.3)',
                          background: 'rgba(255, 255, 255, 0.9)',
                          color: '#2d3748',
                          fontSize: '1rem',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      {validationErrors[`${index}-image`] && (
                        <div style={{
                          color: '#e53e3e',
                          fontSize: '0.8rem',
                          marginTop: '0.25rem'
                        }}>
                          ⚠️ {validationErrors[`${index}-image`]}
                        </div>
                      )}
                    </div>
                  </div>

                  {person.image && (
                    <div style={{
                      textAlign: 'center',
                      marginTop: '1rem'
                    }}>
                      <img
                        src={URL.createObjectURL(person.image)}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid rgba(102, 126, 234, 0.3)'
                        }}
                      />
                      <p style={{
                        margin: '0.25rem 0 0 0',
                        fontSize: '0.8rem',
                        color: '#4a5568'
                      }}>
                        {person.image.name}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* Submit Button */}
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '1.5rem 3rem',
                    background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    boxShadow: '0 8px 25px rgba(78, 205, 196, 0.3)',
                    opacity: submitting ? 0.7 : 1
                  }}
                >
                  {submitting ? '🚀 Creating Booking...' : '🚀 Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookTour; 