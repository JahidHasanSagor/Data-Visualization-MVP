import React from 'react';

const IntegrationStatus = ({ title, status, icon }) => {
  const { connected, last_sync, error } = status;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon}
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        
        <div className="flex items-center">
          {connected ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
              Connected
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <span className="w-2 h-2 mr-1 bg-gray-500 rounded-full"></span>
              Disconnected
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Status:</span>
          <span className={`font-medium ${connected ? 'text-green-600' : 'text-gray-600'}`}>
            {connected ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Last Sync:</span>
          <span className="font-medium text-gray-600">
            {last_sync ? new Date(last_sync).toLocaleString() : 'Never'}
          </span>
        </div>
        
        {error && (
          <div className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded">
            <span className="font-medium">Error:</span> {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrationStatus; 