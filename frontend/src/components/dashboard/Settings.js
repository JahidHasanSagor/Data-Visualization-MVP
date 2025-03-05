import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ApiSettings from './ApiSettings';

const Settings = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
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

  // Tab navigation component
  const TabNavigation = () => (
    <div className="flex justify-center mb-8">
      <div className="flex border-b border-[#E5E7EB]">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'general'
              ? 'text-[#9747FF] border-b-2 border-[#9747FF]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          General Settings
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'api'
              ? 'text-[#9747FF] border-b-2 border-[#9747FF]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          API Integrations
        </button>
      </div>
    </div>
  );

  // General settings content
  const GeneralSettingsContent = () => (
    <div className="space-y-8">
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

      {/* Notification Settings */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E5E7EB]">
        <h2 className="text-lg font-medium text-[#111827] mb-4">Notification Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Email Alerts</h3>
              <p className="text-xs text-gray-500">Receive email notifications for important updates</p>
            </div>
            <ToggleSwitch 
              enabled={notifications.emailAlerts} 
              onChange={() => handleNotificationChange('emailAlerts')} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Dashboard Updates</h3>
              <p className="text-xs text-gray-500">Get notified when dashboard data is refreshed</p>
            </div>
            <ToggleSwitch 
              enabled={notifications.dashboardUpdates} 
              onChange={() => handleNotificationChange('dashboardUpdates')} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Weekly Reports</h3>
              <p className="text-xs text-gray-500">Receive weekly summary reports via email</p>
            </div>
            <ToggleSwitch 
              enabled={notifications.weeklyReports} 
              onChange={() => handleNotificationChange('weeklyReports')} 
            />
          </div>
        </div>
      </div>
      
      {/* Display Preferences */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E5E7EB]">
        <h2 className="text-lg font-medium text-[#111827] mb-4">Display Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Dark Mode</h3>
              <p className="text-xs text-gray-500">Switch to dark theme for low-light environments</p>
            </div>
            <ToggleSwitch 
              enabled={displayPreferences.darkMode} 
              onChange={() => handleDisplayPreferenceChange('darkMode')} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Compact View</h3>
              <p className="text-xs text-gray-500">Display more content with reduced spacing</p>
            </div>
            <ToggleSwitch 
              enabled={displayPreferences.compactView} 
              onChange={() => handleDisplayPreferenceChange('compactView')} 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Auto Refresh</h3>
              <p className="text-xs text-gray-500">Automatically refresh dashboard data</p>
            </div>
            <ToggleSwitch 
              enabled={displayPreferences.autoRefresh} 
              onChange={() => handleDisplayPreferenceChange('autoRefresh')} 
            />
          </div>
        </div>
      </div>
      
      {/* Save Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSave}
          className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#9747FF] to-[#E93D82] rounded-md hover:opacity-90"
        >
          Save Settings
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#111827] mb-6">Settings</h1>
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6 text-center">
          {success}
        </div>
      )}
      
      <TabNavigation />
      
      {activeTab === 'general' ? <GeneralSettingsContent /> : <ApiSettings />}
    </div>
  );
};

export default Settings; 