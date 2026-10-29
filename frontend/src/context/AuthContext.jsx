import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('thanglish_token'));
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const storedToken = localStorage.getItem('thanglish_token');
    if (!storedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await apiRequest('/auth/me');
      setUser(userData);
    } catch (err) {
      console.warn('Could not validate session:', err.message);
      localStorage.removeItem('thanglish_token');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('thanglish_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('thanglish_unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('thanglish_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const register = async (fullName, email, password) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ full_name: fullName, email, password }),
    });
    localStorage.setItem('thanglish_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const handleOAuthCallback = async (provider, code) => {
    const endpoint = `/auth/oauth/${provider}/callback`;
    const data = await apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
    localStorage.setItem('thanglish_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const updateProfile = async (updateData) => {
    const updated = await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    setUser(updated);
    return updated;
  };

  const logout = () => {
    localStorage.removeItem('thanglish_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      login,
      register,
      handleOAuthCallback,
      updateProfile,
      logout,
      refreshUser: fetchProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
