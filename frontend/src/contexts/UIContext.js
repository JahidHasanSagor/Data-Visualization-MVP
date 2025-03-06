import React, { createContext, useState, useContext, useCallback } from 'react';

const UIContext = createContext();

export const useUI = () => useContext(UIContext);

export const UIProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('light');

  // Add a notification
  const addNotification = useCallback((notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      type: notification.type || 'info',
      message: notification.message,
      title: notification.title || getDefaultTitle(notification.type),
      duration: notification.duration || 5000, // Default 5 seconds
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove notification after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
    
    return id;
  }, []);
  
  // Helper to get default title based on notification type
  const getDefaultTitle = (type) => {
    switch (type) {
      case 'success': return 'Success';
      case 'error': return 'Error';
      case 'warning': return 'Warning';
      default: return 'Information';
    }
  };
  
  // Show success notification
  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({
      type: 'success',
      message,
      ...options
    });
  }, [addNotification]);
  
  // Show error notification
  const showError = useCallback((message, options = {}) => {
    return addNotification({
      type: 'error',
      message,
      ...options
    });
  }, [addNotification]);
  
  // Show info notification
  const showInfo = useCallback((message, options = {}) => {
    return addNotification({
      type: 'info',
      message,
      ...options
    });
  }, [addNotification]);
  
  // Show warning notification
  const showWarning = useCallback((message, options = {}) => {
    return addNotification({
      type: 'warning',
      message,
      ...options
    });
  }, [addNotification]);
  
  // Remove a notification by ID
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  
  // Set loading state for a specific component or feature
  const setLoading = useCallback((key, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }));
  }, []);
  
  // Check if a specific component or feature is loading
  const isLoading = useCallback((key) => {
    return loadingStates[key] || false;
  }, [loadingStates]);
  
  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);
  
  // Toggle theme
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const value = {
    // Notifications
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    
    // Loading states
    setLoading,
    isLoading,
    
    // UI preferences
    sidebarOpen,
    toggleSidebar,
    theme,
    toggleTheme
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
}; 