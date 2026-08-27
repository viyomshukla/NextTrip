import React, { createContext, useState, useEffect, useCallback } from 'react';
import API_BASE from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setUser(null);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      // Fetch complete user profile including role
      fetchUserProfile();
    } else {
      setUser(null);
    }
  }, [token, fetchUserProfile]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        // Fetch complete user profile after login
        const profileResponse = await fetch(`${API_BASE}/api/profile`, {
          headers: { Authorization: `Bearer ${data.token}` },
        });
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUser(profileData);
        }
        setLoading(false);
        return true;
      } else {
        setError(data.error || 'Login failed');
        setLoading(false);
        return false;
      }
    } catch (err) {
      setError('Login failed');
      setLoading(false);
      return false;
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      if (response.ok) {
        // Auto-login after signup
        return await login(email, password);
      } else {
        const data = await response.json();
        setError(data.error || 'Signup failed');
        setLoading(false);
        return false;
      }
    } catch (err) {
      setError('Signup failed');
      setLoading(false);
      return false;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await fetch(`${API_BASE}/api/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(profileData)
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        return true;
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}; 