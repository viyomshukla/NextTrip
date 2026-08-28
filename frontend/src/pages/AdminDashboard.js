import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API_BASE from '../config';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
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
        fetch(`${API_BASE}/api/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`${API_BASE}/api/tours`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`${API_BASE}/api/bookings/all`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      if (usersRes.ok) setUsers(await usersRes.json());
      if (toursRes.ok) setTours(await toursRes.json());
      if (bookingsRes.ok) setBookings(await bookingsRes.json());
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTour = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/tours`, {
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
      const response = await fetch(`${API_BASE}/api/users/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newUser)
      });

      const data = await response.json();
      if (response.ok) {
        const usersRes = await fetch(`${API_BASE}/api/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (usersRes.ok) setUsers(await usersRes.json());
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
      const response = await fetch(`${API_BASE}/api/tours/${tourId}`, {
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
      const response = await fetch(`${API_BASE}/api/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        setUsers(users.filter(u => u._id !== userId));
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
      const response = await fetch(`${API_BASE}/api/tours/${tourId}`, {
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
      const response = await fetch(`${API_BASE}/api/bookings/${bookingId}`, {
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

  const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  if (loading) {
    return (
      <div className="nt-center-screen">
        <div>
          <div className="nt-spinner" />
          Loading dashboard…
        </div>
      </div>
    );
  }

  const revenue = bookings.reduce((s, b) => s + (Number(b.totalPrice) || 0), 0);
  const liveTours = tours.filter((t) => t.status === 'ongoing').length;

  const TABS = [
    ['overview', 'Overview'],
    ['tours', `Tours (${tours.length})`],
    ['users', `Users (${users.length})`],
    ['bookings', `Bookings (${bookings.length})`],
  ];

  return (
    <>
      <header className="nt-pagehead">
        <div className="nt-container">
          <span className="nt-eyebrow">Admin</span>
          <h1>Dashboard</h1>
          <p>Signed in as {user?.name}</p>
        </div>
      </header>

      <section className="nt-section nt-section--tight">
        <div className="nt-container">
          <div className="nt-tabs">
            {TABS.map(([key, label]) => (
              <button
                key={key}
                className={activeTab === key ? 'nt-tab nt-tab--on' : 'nt-tab'}
                onClick={() => setActiveTab(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {message && <div className="nt-alert nt-alert--ok">{message}</div>}
          {error && <div className="nt-alert nt-alert--error">{error}</div>}

          {/* ------------------------------------------------------ overview -- */}
          {activeTab === 'overview' && (
            <div className="nt-grid nt-grid--4">
              <div className="nt-statcard">
                <div className="nt-statcard__label">Total users</div>
                <div className="nt-statcard__value">{users.length}</div>
              </div>
              <div className="nt-statcard">
                <div className="nt-statcard__label">Tours live</div>
                <div className="nt-statcard__value">{liveTours}<span style={{ fontSize: '1rem', color: 'var(--muted)' }}> / {tours.length}</span></div>
              </div>
              <div className="nt-statcard">
                <div className="nt-statcard__label">Bookings</div>
                <div className="nt-statcard__value">{bookings.length}</div>
              </div>
              <div className="nt-statcard">
                <div className="nt-statcard__label">Booking value</div>
                <div className="nt-statcard__value">₹{revenue.toLocaleString('en-IN')}</div>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------- tours -- */}
          {activeTab === 'tours' && (
            <div className="nt-stack" style={{ gap: '2rem' }}>
              <div className="nt-card nt-card--pad">
                <h3>Add a tour</h3>
                <form onSubmit={handleCreateTour}>
                  <div className="nt-formgrid">
                    <div className="nt-field">
                      <label className="nt-label">Tour name</label>
                      <input
                        className="nt-input"
                        value={newTour.name}
                        onChange={(e) => setNewTour({ ...newTour, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="nt-field">
                      <label className="nt-label">Location</label>
                      <input
                        className="nt-input"
                        value={newTour.location}
                        onChange={(e) => setNewTour({ ...newTour, location: e.target.value })}
                      />
                    </div>
                    <div className="nt-field">
                      <label className="nt-label">Price (₹)</label>
                      <input
                        className="nt-input"
                        type="number"
                        min="0"
                        value={newTour.price}
                        onChange={(e) => setNewTour({ ...newTour, price: e.target.value })}
                        required
                      />
                    </div>
                    <div className="nt-field">
                      <label className="nt-label">Duration (days)</label>
                      <input
                        className="nt-input"
                        type="number"
                        min="1"
                        value={newTour.duration}
                        onChange={(e) => setNewTour({ ...newTour, duration: e.target.value })}
                      />
                    </div>
                    <div className="nt-field">
                      <label className="nt-label">Image URL</label>
                      <input
                        className="nt-input"
                        value={newTour.image}
                        onChange={(e) => setNewTour({ ...newTour, image: e.target.value })}
                        placeholder="https://…"
                      />
                    </div>
                    <div className="nt-field">
                      <label className="nt-label">Status</label>
                      <select
                        className="nt-select"
                        value={newTour.status}
                        onChange={(e) => setNewTour({ ...newTour, status: e.target.value })}
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="ongoing">Ongoing</option>
                      </select>
                    </div>
                  </div>

                  <div className="nt-field">
                    <label className="nt-label">Description</label>
                    <textarea
                      className="nt-textarea"
                      value={newTour.description}
                      onChange={(e) => setNewTour({ ...newTour, description: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="nt-btn nt-btn--primary">Create tour</button>
                </form>
              </div>

              <div>
                <h3>All tours</h3>
                {tours.length === 0 ? (
                  <div className="nt-empty"><p style={{ margin: 0 }}>No tours yet.</p></div>
                ) : (
                  <div className="nt-tablewrap">
                    <table className="nt-table">
                      <thead>
                        <tr>
                          <th>Tour</th>
                          <th>Location</th>
                          <th>Price</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tours.map((tour) => (
                          <tr key={tour._id}>
                            <td style={{ fontWeight: 600 }}>{tour.title || tour.name}</td>
                            <td style={{ color: 'var(--muted)' }}>{tour.location || '—'}</td>
                            <td>₹{Number(tour.price).toLocaleString('en-IN')}</td>
                            <td>
                              <span className={`nt-badge ${tour.status === 'ongoing' ? 'nt-badge--live' : 'nt-badge--soon'}`}>
                                {tour.status === 'ongoing' ? '● Ongoing' : '◷ Upcoming'}
                              </span>
                            </td>
                            <td>
                              <div className="nt-booking__actions">
                                <button
                                  className="nt-btn nt-btn--ghost nt-btn--sm"
                                  onClick={() => handleToggleTourStatus(tour._id, tour.status)}
                                >
                                  {tour.status === 'ongoing' ? 'Set upcoming' : 'Set ongoing'}
                                </button>
                                <button
                                  className="nt-btn nt-btn--danger nt-btn--sm"
                                  onClick={() => handleDeleteTour(tour._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --------------------------------------------------------- users -- */}
          {activeTab === 'users' && (
            <div className="nt-stack" style={{ gap: '2rem' }}>
              <div className="nt-card nt-card--pad">
                <h3>Add a user</h3>
                <form onSubmit={handleCreateUser}>
                  <div className="nt-formgrid">
                    <div className="nt-field">
                      <label className="nt-label">Full name</label>
                      <input
                        className="nt-input"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="nt-field">
                      <label className="nt-label">Email</label>
                      <input
                        className="nt-input"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="nt-field">
                      <label className="nt-label">Password</label>
                      <input
                        className="nt-input"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        required
                      />
                    </div>
                    <div className="nt-field">
                      <label className="nt-label">Role</label>
                      <select
                        className="nt-select"
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      >
                        <option value="user">Traveller</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="nt-btn nt-btn--primary">Create user</button>
                </form>
              </div>

              <div>
                <h3>All users</h3>
                {users.length === 0 ? (
                  <div className="nt-empty"><p style={{ margin: 0 }}>No users yet.</p></div>
                ) : (
                  <div className="nt-tablewrap">
                    <table className="nt-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u._id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}>
                                <span className="nt-avatar" style={{ width: 30, height: 30, fontSize: '.75rem' }}>
                                  {(u.name || '?').charAt(0)}
                                </span>
                                <span style={{ fontWeight: 600 }}>{u.name}</span>
                              </div>
                            </td>
                            <td style={{ color: 'var(--muted)' }}>{u.email}</td>
                            <td>
                              <span className={`nt-badge ${u.role === 'admin' ? 'nt-badge--warn' : ''}`}>
                                {u.role}
                              </span>
                            </td>
                            <td>
                              <div className="nt-booking__actions">
                                <button
                                  className="nt-btn nt-btn--danger nt-btn--sm"
                                  onClick={() => handleDeleteUser(u._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------ bookings -- */}
          {activeTab === 'bookings' && (
            <div>
              <h3>All bookings</h3>
              {bookings.length === 0 ? (
                <div className="nt-empty"><p style={{ margin: 0 }}>No bookings yet.</p></div>
              ) : (
                <div className="nt-tablewrap">
                  <table className="nt-table">
                    <thead>
                      <tr>
                        <th>Traveller</th>
                        <th>Tour</th>
                        <th>Date</th>
                        <th>People</th>
                        <th>Total</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b._id}>
                          <td style={{ fontWeight: 600 }}>{b.user?.name || 'Unknown'}</td>
                          <td style={{ color: 'var(--muted)' }}>{b.tour?.title || b.tour?.name || '—'}</td>
                          <td>{fmtDate(b.bookingDate)}</td>
                          <td>{b.numberOfPeople}</td>
                          <td style={{ fontWeight: 600 }}>₹{Number(b.totalPrice).toLocaleString('en-IN')}</td>
                          <td>
                            <div className="nt-booking__actions">
                              <button
                                className="nt-btn nt-btn--danger nt-btn--sm"
                                onClick={() => handleCancelBooking(b._id)}
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
