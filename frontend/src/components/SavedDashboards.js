import React from 'react';

const SavedDashboards = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Saved Dashboards</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add saved dashboard cards here */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Dashboard 1</h2>
          <p className="text-gray-600 mb-4">Last modified: 2024-03-14</p>
          <button className="text-blue-600 hover:text-blue-800">Open Dashboard</button>
        </div>
      </div>
    </div>
  );
};

export default SavedDashboards; 