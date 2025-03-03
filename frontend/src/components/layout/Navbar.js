import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import '../../assets/styles/components/landing.css';

const Navbar = ({ onMenuClick, isDashboard = true }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Function to clear the date range
  const clearDates = () => {
    setDateRange([null, null]);
  };

  const handleLogout = async () => {
    logout();
    window.location.href = '/';  // Force a full page reload and navigation
  };

  const handleViewProfile = () => {
    navigate('/profile');
    setShowProfileMenu(false);
  };

  const handleSettings = () => {
    navigate('/settings');
    setShowProfileMenu(false);
  };

  return (
    <nav className="bg-white border-b border-[#E5E7EB] px-8 py-4 fixed w-full top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Left side - Menu and Title */}
        <div className="flex items-center space-x-4">
          {isDashboard && (
            <button
              onClick={onMenuClick}
              className="text-[#6B7280] hover:text-[#111827] transition-colors"
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-[#9747FF] to-[#E93D82] bg-clip-text text-transparent">
            ReportVibe.
          </Link>
        </div>

        {/* Center - Search and Category (Only for Dashboard) */}
        {isDashboard && (
          <div className="flex-1" />
        )}

        {/* Right side - Controls */}
        <div className="flex items-center space-x-4">
          {isDashboard ? (
            <>
              {/* Date Picker */}
              <div className="relative flex items-center">
                <DatePicker
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => setDateRange(update)}
                  dateFormat="MMM d, yyyy"
                  placeholderText="Select date range"
                  className="pl-10 pr-4 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#9747FF] transition-colors w-[200px]"
                />
                {startDate && endDate ? (
                  <button
                    onClick={clearDates}
                    className="absolute right-2 text-[#E93D82] hover:text-[#9747FF] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ) : (
                  <svg className="w-5 h-5 absolute left-3 text-[#9747FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>

              {/* Share Button */}
              <button className="p-2 rounded-lg text-[#6B7280] hover:text-[#9747FF] hover:bg-[#F3F4F6] transition-colors" aria-label="Share">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>

              {/* Settings Button */}
              <button className="p-2 rounded-lg text-[#6B7280] hover:text-[#9747FF] hover:bg-[#F3F4F6] transition-colors" aria-label="Settings">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <Link to="#features" className="text-[#4B5563] hover:text-[#111827] transition-colors">Features</Link>
              <Link to="#testimonials" className="text-[#4B5563] hover:text-[#111827] transition-colors">Testimonials</Link>
              <Link to="#pricing" className="text-[#4B5563] hover:text-[#111827] transition-colors">Pricing</Link>
              {currentUser ? (
                <Link to="/dashboard" className="px-4 py-2 bg-gradient-to-r from-[#9747FF] to-[#E93D82] text-white rounded-lg hover:opacity-90 transition-opacity">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-[#4B5563] hover:text-[#111827] transition-colors">Login</Link>
                  <Link to="/register" className="px-4 py-2 bg-gradient-to-r from-[#9747FF] to-[#E93D82] text-white rounded-lg hover:opacity-90 transition-opacity">
                    Get Started
                  </Link>
                </>
              )}
            </>
          )}

          {/* Profile Menu */}
          {currentUser && isDashboard && (
            <div className="relative" ref={profileMenuRef}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors" 
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#9747FF] to-[#E93D82] flex items-center justify-center text-white font-medium">
                  {currentUser?.name ? currentUser.name[0].toUpperCase() : 'U'}
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-1 border border-[#E5E7EB]">
                  <div className="px-4 py-3 border-b border-[#E5E7EB]">
                    <p className="text-sm font-medium text-[#111827]">{currentUser?.name || 'User'}</p>
                    <p className="text-sm text-[#6B7280]">{currentUser?.email}</p>
                  </div>
                  <button
                    onClick={handleViewProfile}
                    className="w-full text-left px-4 py-2 text-sm text-[#4B5563] hover:bg-[#F3F4F6] transition-colors"
                  >
                    Your Profile
                  </button>
                  <button
                    onClick={handleSettings}
                    className="w-full text-left px-4 py-2 text-sm text-[#4B5563] hover:bg-[#F3F4F6] transition-colors"
                  >
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-[#E93D82] hover:bg-[#F3F4F6] transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
