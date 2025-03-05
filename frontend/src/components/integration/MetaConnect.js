import React, { useState } from 'react';
import axios from 'axios';
import * as metaAdsApi from '../../services/api/metaAds';

const MetaConnect = ({ connected, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [adsData, setAdsData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  
  const handleConnect = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the real authentication API
      await metaAdsApi.authenticate();
      
      // Fetch accounts after successful authentication
      const accountsList = await metaAdsApi.getAccounts();
      setAccounts(accountsList);
      
      // Update connection status
      onStatusUpdate({ 
        connected: true, 
        last_sync: new Date().toISOString(),
        error: null
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error connecting to Meta Ads:', err);
      setError(err.message || 'Failed to connect to Meta Ads');
      setLoading(false);
    }
  };
  
  const handleDisconnect = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Make a real API call to disconnect
      const token = localStorage.getItem('authToken');
      await axios.post('http://localhost:5000/api/integrations/meta/disconnect', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update status
      onStatusUpdate({
        connected: false,
        last_sync: null,
        error: null
      });
      
      // Clear accounts
      setAccounts([]);
      setSelectedAccount('');
      setAdsData(null);
      
      setLoading(false);
    } catch (err) {
      console.error('Error disconnecting from Meta Ads:', err);
      setError(err.message || 'Failed to disconnect');
      setLoading(false);
    }
  };
  
  const handleAccountChange = (e) => {
    setSelectedAccount(e.target.value);
    // Clear previous data when account changes
    setAdsData(null);
  };
  
  const fetchData = async () => {
    if (!selectedAccount) return;
    
    try {
      setDataLoading(true);
      setError(null);
      
      // Get dates for last 30 days
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      // Fetch Meta Ads data
      const response = await metaAdsApi.getData(selectedAccount, startDate, endDate);
      setAdsData(response);
      
      // Update last sync time
      onStatusUpdate({
        last_sync: new Date().toISOString()
      });
      
      setDataLoading(false);
    } catch (err) {
      console.error('Error fetching Meta Ads data:', err);
      setError(err.message || 'Failed to fetch ads data');
      setDataLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
      <div className="flex items-center space-x-3 mb-4">
        <svg className="w-8 h-8 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z" opacity="0.2" />
          <path d="M16.5 8.25h-3v-2.25c0-0.825 0.675-1.5 1.5-1.5h1.5v-3h-1.5c-2.475 0-4.5 2.025-4.5 4.5v2.25h-3v3h3v7.5h3v-7.5h3v-3z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-800">Meta Ads</h3>
      </div>
      
      <p className="text-gray-600 mb-6">
        Connect your Meta (Facebook) Ads account to visualize ad performance, campaign metrics, and ROI data.
      </p>
      
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">
          <span className="font-medium">Error:</span> {error}
        </div>
      )}
      
      {connected ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-green-700 text-sm mb-4">
            <span className="font-medium">Connected!</span> Your Meta Ads account is linked successfully.
          </div>
          
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Select Ad Account
            </label>
            <select
              value={selectedAccount}
              onChange={handleAccountChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select an account</option>
              {accounts.map((account) => (
                <option 
                  key={account.account_id} 
                  value={account.account_id}
                  disabled={account.account_status !== 'ACTIVE'}
                >
                  {account.name} {account.account_status !== 'ACTIVE' && '(Inactive)'}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={handleDisconnect}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              {loading ? 'Disconnecting...' : 'Disconnect'}
            </button>
            
            <button
              onClick={fetchData}
              disabled={!selectedAccount || loading || dataLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {dataLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : 'Fetch Data'}
            </button>
          </div>
          
          {adsData && adsData.campaigns && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Meta Ads Data (Last 30 Days)</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spend</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {adsData.campaigns.map((campaign, index) => (
                      <tr key={campaign.campaign_id || campaign.id || index}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{campaign.campaign_name}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{campaign.impressions}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{campaign.clicks}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">${parseFloat(campaign.spend).toFixed(2)}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{parseFloat(campaign.ctr * 100).toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={loading}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </>
          ) : (
            <>Connect Meta Ads</>
          )}
        </button>
      )}
    </div>
  );
};

export default MetaConnect; 