import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../utils/axios';
import { useAuth } from './AuthContext';

const ApiContext = createContext();

export const useApi = () => useContext(ApiContext);

export const ApiProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [integrations, setIntegrations] = useState({
    google: { connected: false, status: 'disconnected' },
    meta: { connected: false, status: 'disconnected' }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch integration status when user is logged in
  useEffect(() => {
    if (currentUser) {
      fetchIntegrationStatus();
    }
  }, [currentUser]);

  const fetchIntegrationStatus = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://127.0.0.1:5000/api/integrations/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setIntegrations({
        google: {
          connected: response.data.google?.connected || false,
          status: response.data.google?.connected ? 'connected' : 'disconnected',
          data: response.data.google?.data || null
        },
        meta: {
          connected: response.data.meta?.connected || false,
          status: response.data.meta?.connected ? 'connected' : 'disconnected',
          data: response.data.meta?.data || null
        }
      });
    } catch (error) {
      console.error('Failed to fetch integration status:', error);
      setError('Failed to fetch integration status');
    } finally {
      setLoading(false);
    }
  };

  const connectGoogle = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://127.0.0.1:5000/api/integrations/google/auth-url', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Redirect to Google OAuth
      window.location.href = response.data.auth_url;
    } catch (error) {
      console.error('Failed to get Google auth URL:', error);
      setError('Failed to connect to Google Analytics');
      setLoading(false);
    }
  };

  const connectMeta = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://127.0.0.1:5000/api/integrations/meta/auth-url', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Redirect to Meta OAuth
      window.location.href = response.data.auth_url;
    } catch (error) {
      console.error('Failed to get Meta auth URL:', error);
      setError('Failed to connect to Meta Ads');
      setLoading(false);
    }
  };

  const disconnectIntegration = async (platform) => {
    if (!currentUser) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`http://127.0.0.1:5000/api/integrations/${platform}/disconnect`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Update local state
      setIntegrations(prev => ({
        ...prev,
        [platform]: {
          connected: false,
          status: 'disconnected',
          data: null
        }
      }));
    } catch (error) {
      console.error(`Failed to disconnect ${platform}:`, error);
      setError(`Failed to disconnect from ${platform}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchIntegrationData = async (platform) => {
    if (!currentUser || !integrations[platform]?.connected) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`http://127.0.0.1:5000/api/integrations/${platform}/data`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Update integration data
      setIntegrations(prev => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          data: response.data
        }
      }));
      
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch ${platform} data:`, error);
      setError(`Failed to fetch data from ${platform}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    integrations,
    loading,
    error,
    fetchIntegrationStatus,
    connectGoogle,
    connectMeta,
    disconnectIntegration,
    fetchIntegrationData
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}; 