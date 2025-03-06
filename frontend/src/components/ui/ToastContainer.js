import React from 'react';
import { useUI } from '../../contexts/UIContext';
import Toast from './Toast';

const ToastContainer = () => {
  const { notifications, removeNotification } = useUI();
  
  if (notifications.length === 0) {
    return null;
  }
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {notifications.map((notification, index) => (
        <Toast
          key={notification.id}
          id={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          duration={notification.duration}
          onClose={removeNotification}
          style={{ top: `${index * 80}px` }}
        />
      ))}
    </div>
  );
};

export default ToastContainer; 