import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../utils/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is already logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);
  
  const register = async (name, email, password) => {
    try {
      console.log('Attempting registration...', { name, email }); // Debug log
      const response = await axios.post('http://127.0.0.1:5000/api/auth/register', 
        {
          name,
          email,
          password
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );
      
      console.log('Registration response:', response.data); // Debug log
      
      if (response.data.message === 'Registration successful') {
        return true;
      } else {
        throw new Error(response.data.error || 'Failed to create account');
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error.response?.data?.error || 'Failed to create account';
    }
  };
  
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/auth/login', {
        email,
        password
      });
      
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };
  
  const logout = () => {
    // Clear storage first
    localStorage.clear();  // Clear all storage to be thorough
    // Then update state
    setCurrentUser(null);
  };
  
  const updateProfile = async (updatedData) => {
    try {
      console.log('Updating profile with data:', updatedData); // Debug log
      const token = localStorage.getItem('authToken');
      console.log('Using token:', token); // Debug log
      
      const response = await axios.put('http://127.0.0.1:5000/api/user/profile', 
        updatedData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Profile update response:', response.data); // Debug log
      
      const updatedUser = response.data.user;
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return true;
    } catch (error) {
      console.error('Profile update failed:', error.response?.data || error);
      throw error.response?.data?.error || 'Failed to update profile';
    }
  };
  
  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    updateProfile
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 