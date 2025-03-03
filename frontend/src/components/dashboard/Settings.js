import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Settings = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    dashboardUpdates: true,
    weeklyReports: false
  });
  const [displayPreferences, setDisplayPreferences] = useState({
    darkMode: false,
    compactView: false,
    autoRefresh: true
  });
  const [success, setSuccess] = useState('');

  const handleNotificationChange = (setting) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleDisplayPreferenceChange = (setting) => {
    setDisplayPreferences(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    setSuccess('Settings saved successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const ToggleSwitch = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`${
        enabled 
          ? 'bg-gradient-to-r from-[#9747FF] to-[#E93D82]' 
          : 'bg-gray-200'
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
    >
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
      />
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#111827]">Settings</h1>
        {success && (
          <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium">
            {success}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
          <h2 className="text-lg font-semibold text-[#111827] mb-4">Profile</h2>
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-[#9747FF] to-[#E93D82] flex items-center justify-center text-white text-2xl font-medium">
              {currentUser?.name ? currentUser.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="text-base font-medium text-[#111827]">{currentUser?.name || 'User'}</h3>
              <p className="text-sm text-[#6B7280]">{currentUser?.email}</p>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
          <h2 className="text-lg font-semibold text-[#111827] mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[#111827]">Email Alerts</h3>
                <p className="text-sm text-[#6B7280]">Receive email notifications for important updates</p>
              </div>
              <ToggleSwitch 
                enabled={notifications.emailAlerts} 
                onChange={() => handleNotificationChange('emailAlerts')} 
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[#111827]">Dashboard Updates</h3>
                <p className="text-sm text-[#6B7280]">Get notified of dashboard changes</p>
              </div>
              <ToggleSwitch 
                enabled={notifications.dashboardUpdates} 
                onChange={() => handleNotificationChange('dashboardUpdates')} 
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[#111827]">Weekly Reports</h3>
                <p className="text-sm text-[#6B7280]">Receive weekly summary reports</p>
              </div>
              <ToggleSwitch 
                enabled={notifications.weeklyReports} 
                onChange={() => handleNotificationChange('weeklyReports')} 
              />
            </div>
          </div>
        </div>

        {/* Display Preferences Section */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
          <h2 className="text-lg font-semibold text-[#111827] mb-4">Display Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[#111827]">Dark Mode</h3>
                <p className="text-sm text-[#6B7280]">Enable dark mode for the dashboard</p>
              </div>
              <ToggleSwitch 
                enabled={displayPreferences.darkMode} 
                onChange={() => handleDisplayPreferenceChange('darkMode')} 
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[#111827]">Compact View</h3>
                <p className="text-sm text-[#6B7280]">Use compact layout for dashboard widgets</p>
              </div>
              <ToggleSwitch 
                enabled={displayPreferences.compactView} 
                onChange={() => handleDisplayPreferenceChange('compactView')} 
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[#111827]">Auto Refresh</h3>
                <p className="text-sm text-[#6B7280]">Automatically refresh dashboard data</p>
              </div>
              <ToggleSwitch 
                enabled={displayPreferences.autoRefresh} 
                onChange={() => handleDisplayPreferenceChange('autoRefresh')} 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#9747FF] to-[#E93D82] rounded-lg hover:opacity-90 transition-opacity"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 