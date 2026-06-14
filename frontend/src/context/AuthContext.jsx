import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    const response = await axios.post('/auth/login', { username, password });
    const jwt = response.data.token;
    localStorage.setItem('token', jwt);
    setToken(jwt);
    // Fetch user profile
    const profileRes = await axios.get('/users/me', {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    setUser(profileRes.data);
    return jwt;
  };

  const register = async (username, email, password) => {
    await axios.post('/auth/register', { username, email, password });
    // after registration you can directly log in
    return login(username, password);
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  // Keep token in axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Optionally decode token to set user info on reload (skipped for brevity)

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
