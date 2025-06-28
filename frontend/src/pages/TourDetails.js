import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const TourDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [tour, setTour] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [bookingDate, setBookingDate] = useState('');
  const [bookingMsg, setBookingMsg] = useState('');

  // Get today's date in YYYY-MM-DD format for minimum date
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchTourAndReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const [tourRes, reviewsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/tours/${id}`, { 
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
          }),
          fetch(`http://localhost:5000/api/reviews/tour/${id}`)
        ]);
        const tourData = await tourRes.json();
        const reviewsData = await reviewsRes.json();
        setTour(tourData);
        setReviews(reviewsData);
      } catch (err) {
        setError('Failed to load tour details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTourAndReviews();
  }, [id]);

  const hasReviewed = reviews.some(r => r.user._id === user?.id);

  const handleBook = async (e) => {
    e.preventDefault();
    setBookingMsg('');
    if (!bookingDate) {
      setBookingMsg('Please select a date.');
      return;
    }
    if (bookingDate < today) {
      setBookingMsg('Cannot book for past dates. Please select a future date.');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ tour: id, date: bookingDate })
      });
      const data = await response.json();
      if (response.ok) {
        setBookingMsg('Booking successful!');
        setBookingDate('');
      } else {
        setBookingMsg(data.error || 'Booking failed. Please try again.');
      }
    } catch (err) {
      setBookingMsg('Booking failed. Please try again.');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to submit a review');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/reviews/tour/${id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(newReview)
      });
      if (response.ok) {
        setNewReview({ rating: 5, comment: '' });
        // Refresh reviews
        const reviewsRes = await fetch(`http://localhost:5000/api/reviews/tour/${id}`);
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
        alert('Review submitted successfully!');
      } else {
        alert('Failed to submit review');
      }
    } catch (err) {
      alert('Failed to submit review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        setReviews(reviews.filter(r => r._id !== reviewId));
        alert('Review deleted successfully!');
      } else {
        alert('Failed to delete review');
      }
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>;
  if (!tour) return <div style={{ textAlign: 'center', padding: '2rem' }}>Tour not found</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Tour Details */}
        <div>
          <h1 style={{ marginTop: '0' }}>{tour.title}</h1>
          <p><strong>Description:</strong> {tour.description}</p>
          <p><strong>Duration:</strong> {tour.duration} days</p>
          <p><strong>Location:</strong> {tour.location}</p>
          <p><strong>Price:</strong> ${tour.price}</p>
          
          {/* Reviews Section */}
          <div style={{ marginTop: '2rem' }}>
            <h2>Reviews</h2>
            {reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {reviews.map(review => (
                  <div key={review._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', backgroundColor: '#f9f9f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p><strong>{review.user.name}</strong> - {review.rating}/5 stars</p>
                        <p>{review.comment}</p>
                        <small>{new Date(review.createdAt).toLocaleDateString()}</small>
                      </div>
                      {(user && (user._id === review.user._id || user.role === 'admin')) && (
                        <button 
                          onClick={() => handleDeleteReview(review._id)}
                          style={{ 
                            backgroundColor: '#dc3545', 
                            color: 'white', 
                            border: 'none', 
                            padding: '0.25rem 0.5rem', 
                            borderRadius: '4px', 
                            cursor: 'pointer' 
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Review Form */}
            {user && (
              <div style={{ marginTop: '2rem', border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
                <h3>Add Review</h3>
                <form onSubmit={handleReviewSubmit}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label>Rating:</label><br />
                    <select 
                      value={newReview.rating} 
                      onChange={e => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    >
                      <option value={5}>5 stars</option>
                      <option value={4}>4 stars</option>
                      <option value={3}>3 stars</option>
                      <option value={2}>2 stars</option>
                      <option value={1}>1 star</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label>Comment:</label><br />
                    <textarea 
                      value={newReview.comment} 
                      onChange={e => setNewReview({...newReview, comment: e.target.value})} 
                      required 
                      style={{ width: '100%', padding: '8px', marginTop: '5px', minHeight: '100px' }}
                    />
                  </div>
                  <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Submit Review
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Booking Section */}
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', height: 'fit-content' }}>
          <h2>Book This Tour</h2>
          <form onSubmit={handleBook}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Booking Date:</label><br />
              <div style={{
                fontSize: '0.8rem',
                color: '#666',
                marginBottom: '0.25rem',
                fontStyle: 'italic'
              }}>
                Only future dates are allowed
              </div>
              <input 
                type="date" 
                value={bookingDate} 
                onChange={e => setBookingDate(e.target.value)} 
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                min={today}
              />
            </div>
            <button 
              type="submit"
              style={{ 
                width: '100%', 
                padding: '10px', 
                backgroundColor: '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}
            >
              Book Tour
            </button>
            {bookingMsg && <p style={{ color: bookingMsg.includes('successful') ? 'green' : 'red', marginTop: '10px' }}>{bookingMsg}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default TourDetails; 