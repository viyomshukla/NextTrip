// Base URL of the NextTrip backend API.
// Set REACT_APP_API_URL in the deploy environment (Vercel) to point at the
// deployed backend; falls back to the local dev server.
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default API_BASE;
