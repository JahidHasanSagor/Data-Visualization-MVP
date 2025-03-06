import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Toast = ({ id, type, title, message, duration, onClose }) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  
  useEffect(() => {
    if (duration > 0) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prev - (100 / (duration / 100));
        });
      }, 100);
      
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => {
          onClose(id);
        }, 300); // Wait for fade out animation
      }, duration);
      
      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [duration, id, onClose]);
  
  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose(id);
    }, 300); // Wait for fade out animation
  };
  
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-100',
          border: 'border-green-500',
          text: 'text-green-800',
          icon: (
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ),
          progress: 'bg-green-500'
        };
      case 'error':
        return {
          bg: 'bg-red-100',
          border: 'border-red-500',
          text: 'text-red-800',
          icon: (
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          ),
          progress: 'bg-red-500'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-100',
          border: 'border-yellow-500',
          text: 'text-yellow-800',
          icon: (
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ),
          progress: 'bg-yellow-500'
        };
      default:
        return {
          bg: 'bg-blue-100',
          border: 'border-blue-500',
          text: 'text-blue-800',
          icon: (
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          ),
          progress: 'bg-blue-500'
        };
    }
  };
  
  const styles = getTypeStyles();
  
  return (
    <div 
      className={`fixed right-4 transform transition-all duration-300 ease-in-out ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      style={{ top: `${id % 1000}px` }}
    >
      <div className={`${styles.bg} ${styles.border} border-l-4 p-4 rounded shadow-md max-w-md flex items-start`}>
        <div className="flex-shrink-0">
          {styles.icon}
        </div>
        <div className="ml-3 flex-1">
          <div className="flex justify-between items-center">
            <p className={`${styles.text} font-medium text-sm`}>{title}</p>
            <button 
              type="button" 
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={handleClose}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <p className={`${styles.text} text-sm mt-1`}>{message}</p>
          {duration > 0 && (
            <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
              <div 
                className={`${styles.progress} h-1 rounded-full transition-all duration-100 ease-linear`}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Toast.propTypes = {
  id: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  duration: PropTypes.number,
  onClose: PropTypes.func.isRequired
};

Toast.defaultProps = {
  duration: 5000
};

export default Toast; 