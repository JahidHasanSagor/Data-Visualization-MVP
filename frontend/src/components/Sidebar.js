import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Upload File',  // New Upload File menu item
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      path: '/'
    },
    {
      title: 'Preset Widget',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      path: '/preset-widget'
    },
    {
      title: 'Custom Widget',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
        </svg>
      ),
      path: '/custom-widget'
    },
    {
      title: 'Static Widget',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
      path: '/static-widget'
    },
    {
      title: 'Widget Bundle',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      path: '/widget-bundle'
    }
  ];

  return (
    <div className={`
      ${isOpen ? 'w-64' : 'w-0'} 
      min-h-screen border-r border-gray-200 bg-white
      transition-all duration-300 overflow-hidden
    `}>
      <div className="py-4 w-64"> {/* Fixed width container for content */}
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center px-6 py-3 space-x-3 text-sm ${
              location.pathname === item.path
                ? 'bg-emerald-50 text-emerald-600 border-l-4 border-emerald-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="w-5">{item.icon}</span>
            <span className="font-medium">{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;