import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [tours, setTours] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  // New tour form state
  const [newTour, setNewTour] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
    location: '',
    image: '',
    status: 'upcoming'
  });

  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, toursRes, bookingsRes] = await Promise.all([
        fetch('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('http://localhost:5000/api/tours', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('http://localhost:5000/api/bookings/all', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      if (toursRes.ok) {
        const toursData = await toursRes.json();
        setTours(toursData);
      }

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTour = async (e) => {
    e.preventDefault();
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
        setNewTour({ name: '', description: '', duration: '', price: '', location: '', image: '', status: 'upcoming' });
        setMessage('Tour created successfully!');
        setError('');
      } else {
        setError(data.error || 'Failed to create tour');
        setMessage('');
      }
    } catch (err) {
      setError('Failed to create tour');
      setMessage('');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newUser)
      });

      const data = await response.json();
      if (response.ok) {
        // Refresh users list
        const usersRes = await fetch('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData);
        }
        setNewUser({ name: '', email: '', password: '', role: 'user' });
        setMessage('User created successfully!');
        setError('');
      } else {
        setError(data.error || 'Failed to create user');
        setMessage('');
      }
    } catch (err) {
      setError('Failed to create user');
      setMessage('');
    }
  };

  const handleDeleteTour = async (tourId) => {
    if (!window.confirm('Are you sure you want to delete this tour?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/tours/${tourId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        setTours(tours.filter(tour => tour._id !== tourId));
        setMessage('Tour deleted successfully!');
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete tour');
        setMessage('');
      }
    } catch (err) {
      setError('Failed to delete tour');
      setMessage('');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        setUsers(users.filter(user => user._id !== userId));
        setMessage('User deleted successfully!');
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete user');
        setMessage('');
      }
    } catch (err) {
      setError('Failed to delete user');
      setMessage('');
    }
  };

  const handleToggleTourStatus = async (tourId, currentStatus) => {
    const newStatus = currentStatus === 'upcoming' ? 'ongoing' : 'upcoming';
    
    try {
      const response = await fetch(`http://localhost:5000/api/tours/${tourId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setTours(tours.map(tour => 
          tour._id === tourId ? { ...tour, status: newStatus } : tour
        ));
        setMessage(`Tour status updated to ${newStatus}!`);
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update tour status');
        setMessage('');
      }
    } catch (err) {
      setError('Failed to update tour status');
      setMessage('');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        setBookings(bookings.filter(booking => booking._id !== bookingId));
        setMessage('Booking cancelled successfully!');
        setError('');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to cancel booking');
        setMessage('');
      }
    } catch (err) {
      setError('Failed to cancel booking');
      setMessage('');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Admin Dashboard</h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome, {user?.name}!</p>

      {/* Debug Info - Remove this after testing */}
      

      {/* Create First Admin Section - Show only if user is not admin */}
      {user?.role !== 'admin' && (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          padding: '1rem', 
          marginBottom: '1rem', 
          borderRadius: '4px',
          border: '1px solid #ffeaa7'
        }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#856404' }}>Create First Admin User</h4>
          <p style={{ margin: '0 0 0.5rem 0', color: '#856404' }}>
            You need to create the first admin user to access admin features.
          </p>
          <button 
            onClick={async () => {
              try {
                const response = await fetch('http://localhost:5000/api/users/first-admin', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: 'Admin User',
                    email: 'admin@example.com',
                    password: 'admin123'
                  })
                });
                const data = await response.json();
                if (response.ok) {
                  alert('First admin user created! Please login with admin@example.com / admin123');
                  window.location.reload();
                } else {
                  alert(data.error || 'Failed to create admin user');
                }
              } catch (err) {
                alert('Failed to create admin user');
              }
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#856404',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Create First Admin
          </button>
        </div>
      )}

      {message && <p style={{ color: 'green', textAlign: 'center', marginBottom: '1rem' }}>{message}</p>}
      {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

      {/* Tab Navigation */}
      <div style={{ display: 'flex', marginBottom: '2rem', borderBottom: '1px solid #ddd' }}>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            padding: '1rem 2rem',
            border: 'none',
            backgroundColor: activeTab === 'users' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'users' ? 'white' : '#333',
            cursor: 'pointer',
            marginRight: '1rem'
          }}
        >
          Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('tours')}
          style={{
            padding: '1rem 2rem',
            border: 'none',
            backgroundColor: activeTab === 'tours' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'tours' ? 'white' : '#333',
            cursor: 'pointer',
            marginRight: '1rem'
          }}
        >
          Tours ({tours.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          style={{
            padding: '1rem 2rem',
            border: 'none',
            backgroundColor: activeTab === 'bookings' ? '#007bff' : '#f8f9fa',
            color: activeTab === 'bookings' ? 'white' : '#333',
            cursor: 'pointer'
          }}
        >
          Bookings ({bookings.length})
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <h2>Manage Users</h2>
          
          {/* Create User Form */}
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '2rem' }}>
            <h3>Create New User</h3>
            <form onSubmit={handleCreateUser}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Name"
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                  required
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                  required
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={e => setNewUser({...newUser, password: e.target.value})}
                  required
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({...newUser, role: e.target.value})}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Create User
              </button>
            </form>
          </div>

          {/* Users List */}
          <div style={{ display: 'grid', gap: '1rem' }}>
            {users.map(user => (
              <div key={user._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>{user.name}</h4>
                  <p style={{ margin: '0 0 0.5rem 0' }}>Email: {user.email}</p>
                  <p style={{ margin: '0' }}>Role: <span style={{ color: user.role === 'admin' ? '#dc3545' : '#007bff' }}>{user.role}</span></p>
                </div>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tours Tab */}
      {activeTab === 'tours' && (
        <div>
          <h2>Manage Tours</h2>
          
          {/* Create Tour Form */}
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBottom: '2rem' }}>
            <h3>Create New Tour</h3>
            <form onSubmit={handleCreateTour}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Tour Name"
                  value={newTour.name}
                  onChange={e => setNewTour({...newTour, name: e.target.value})}
                  required
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={newTour.location}
                  onChange={e => setNewTour({...newTour, location: e.target.value})}
                  required
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                <input
                  type="number"
                  placeholder="Duration (days)"
                  value={newTour.duration}
                  onChange={e => setNewTour({...newTour, duration: e.target.value})}
                  required
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newTour.price}
                  onChange={e => setNewTour({...newTour, price: e.target.value})}
                  required
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="url"
                  placeholder="Image URL (optional)"
                  value={newTour.image}
                  onChange={e => setNewTour({...newTour, image: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                <small style={{ color: '#666' }}>Enter a valid image URL (e.g., https://example.com/image.jpg)</small>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <select
                  value={newTour.status}
                  onChange={e => setNewTour({...newTour, status: e.target.value})}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                >
                  <option value="upcoming">Upcoming Tour</option>
                  <option value="ongoing">Ongoing Tour</option>
                </select>
                <small style={{ color: '#666' }}>Select the tour status</small>
              </div>
              <textarea
                placeholder="Description"
                value={newTour.description}
                onChange={e => setNewTour({...newTour, description: e.target.value})}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', marginBottom: '1rem', minHeight: '100px' }}
              />
              <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Create Tour
              </button>
            </form>
          </div>

          {/* Tours List */}
          <div style={{ display: 'grid', gap: '1rem' }}>
            {tours.map(tour => (
              <div key={tour._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>{tour.title || tour.name}</h4>
                  <p style={{ margin: '0 0 0.5rem 0' }}>Location: {tour.location}</p>
                  <p style={{ margin: '0 0 0.5rem 0' }}>Duration: {tour.duration} days</p>
                  <p style={{ margin: '0 0 0.5rem 0' }}>Price: ₹{tour.price}</p>
                  <p style={{ margin: '0 0 0.5rem 0' }}>
                    Status: 
                    <span style={{ 
                      color: tour.status === 'ongoing' ? '#28a745' : '#007bff', 
                      fontWeight: 'bold',
                      marginLeft: '0.5rem'
                    }}>
                      {tour.status === 'ongoing' ? '🟢 Ongoing' : '🔵 Upcoming'}
                    </span>
                  </p>
                  {tour.image && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <img 
                        src={tour.image} 
                        alt={tour.title || tour.name} 
                        style={{ 
                          width: '100px', 
                          height: '100px', 
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid #dee2e6'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleToggleTourStatus(tour._id, tour.status)}
                    style={{ 
                      padding: '8px 16px', 
                      backgroundColor: tour.status === 'ongoing' ? '#007bff' : '#28a745', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    {tour.status === 'ongoing' ? 'Set Upcoming' : 'Set Ongoing'}
                  </button>
                  <button
                    onClick={() => handleDeleteTour(tour._id)}
                    style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div>
          <h2>All Bookings</h2>
          
          {/* Booking Statistics */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem', 
            marginBottom: '2rem' 
          }}>
            <div style={{ 
              backgroundColor: '#007bff', 
              color: 'white', 
              padding: '1rem', 
              borderRadius: '8px', 
              textAlign: 'center' 
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>{bookings.length}</h3>
              <p style={{ margin: '0' }}>Total Bookings</p>
            </div>
            <div style={{ 
              backgroundColor: '#28a745', 
              color: 'white', 
              padding: '1rem', 
              borderRadius: '8px', 
              textAlign: 'center' 
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>
                ₹{bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0)}
              </h3>
              <p style={{ margin: '0' }}>Total Revenue</p>
            </div>
            <div style={{ 
              backgroundColor: '#ffc107', 
              color: 'black', 
              padding: '1rem', 
              borderRadius: '8px', 
              textAlign: 'center' 
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>
                {bookings.reduce((sum, booking) => sum + (booking.numberOfPeople || 0), 0)}
              </h3>
              <p style={{ margin: '0' }}>Total Passengers</p>
            </div>
          </div>

          {/* Bookings List */}
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {bookings.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '8px',
                border: '1px solid #dee2e6'
              }}>
                <h3 style={{ color: '#6c757d', marginBottom: '1rem' }}>No Bookings Found</h3>
                <p style={{ color: '#6c757d' }}>There are no bookings in the system yet.</p>
              </div>
            ) : (
              bookings.map(booking => (
                <div key={booking._id} style={{ 
                  border: '1px solid #ddd', 
                  borderRadius: '8px', 
                  padding: '1.5rem', 
                  backgroundColor: '#f9f9f9',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {/* Booking Header */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#007bff' }}>
                        {booking.tour?.title || booking.tour?.name || 'Tour'}
                      </h4>
                      <p style={{ margin: '0', color: '#6c757d', fontSize: '0.9rem' }}>
                        Booking ID: {booking._id}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <div style={{ 
                        backgroundColor: '#28a745', 
                        color: 'white', 
                        padding: '0.5rem 1rem', 
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                      }}>
                        ₹{booking.totalPrice || 'N/A'}
                      </div>
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        style={{ 
                          padding: '0.5rem 1rem', 
                          backgroundColor: '#dc3545', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '4px', 
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: 'bold'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  
                  {/* Tour Image */}
                  {booking.tour?.image && (
                    <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                      <img 
                        src={booking.tour.image} 
                        alt={booking.tour?.title || booking.tour?.name || 'Tour'} 
                        style={{ 
                          width: '150px', 
                          height: '150px', 
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '3px solid #dee2e6'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Booking Details Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <h5 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>Customer Information</h5>
                      <div style={{ 
                        backgroundColor: '#f8f9fa', 
                        padding: '0.75rem', 
                        borderRadius: '4px', 
                        border: '1px solid #dee2e6',
                        marginBottom: '0.5rem'
                      }}>
                        <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold', color: '#007bff' }}>
                          👤 {booking.people && booking.people.length > 0 ? booking.people[0].name.split(' ')[0] : (booking.user?.name ? booking.user.name.split(' ')[0] : 'Unknown User')}
                        </p>
                        {/* <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem' }}>
                          📧 {
                        </p> */}
                        <p style={{ margin: '0', fontSize: '0.9rem', color: '#6c757d' }}>
                          📅 Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h5 style={{ margin: '0 0 0.5rem 0', color: '#495057' }}>Tour Information</h5>
                      <p style={{ margin: '0 0 0.5rem 0' }}><strong>Location:</strong> {booking.tour?.location || 'N/A'}</p>
                      <p style={{ margin: '0 0 0.5rem 0' }}><strong>Duration:</strong> {booking.tour?.duration || 'N/A'} days</p>
                      <p style={{ margin: '0 0 0.5rem 0' }}><strong>Price per person:</strong> ₹{booking.tour?.price || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Booking Summary */}
                  <div style={{ 
                    backgroundColor: '#e9ecef', 
                    padding: '1rem', 
                    borderRadius: '4px', 
                    marginBottom: '1rem' 
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                      <div>
                        <p style={{ margin: '0', fontWeight: 'bold' }}>Booking Date</p>
                        <p style={{ margin: '0', color: '#007bff' }}>{new Date(booking.bookingDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0', fontWeight: 'bold' }}>Number of People</p>
                        <p style={{ margin: '0', color: '#28a745' }}>{booking.numberOfPeople || 'N/A'}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0', fontWeight: 'bold' }}>Total Price</p>
                        <p style={{ margin: '0', color: '#dc3545', fontWeight: 'bold' }}>₹{booking.totalPrice || 'N/A'}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0', fontWeight: 'bold' }}>Status</p>
                        <p style={{ margin: '0', color: '#28a745', fontWeight: 'bold' }}>Confirmed</p>
                      </div>
                    </div>
                  </div>

                  {/* People Details */}
                  {booking.people && booking.people.length > 0 && (
                    <div style={{ marginTop: '1rem' }}>
                      <h5 style={{ marginBottom: '1rem', color: '#495057' }}>
                        Passenger Details ({booking.people.length} {booking.people.length === 1 ? 'person' : 'people'})
                      </h5>
                      <div style={{ display: 'grid', gap: '0.75rem' }}>
                        {booking.people.map((person, index) => (
                          <div key={index} style={{ 
                            border: '1px solid #dee2e6', 
                            borderRadius: '6px', 
                            padding: '1rem',
                            backgroundColor: 'white'
                          }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
                              <div>
                                <h6 style={{ margin: '0 0 0.5rem 0', color: '#007bff' }}>Person {index + 1}</h6>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}><strong>Name:</strong> {person.name}</p>
                                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}><strong>Aadhaar:</strong> {person.aadhaar}</p>
                                  <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}><strong>Phone:</strong> {person.phone}</p>
                                </div>
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                {person.image && (
                                  <img
                                    src={person.image}
                                    alt={`${person.name}`}
                                    style={{ 
                                      maxWidth: '80px', 
                                      maxHeight: '80px', 
                                      borderRadius: '6px',
                                      objectFit: 'cover',
                                      border: '2px solid #dee2e6'
                                    }}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 