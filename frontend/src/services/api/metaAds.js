import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

/**
 * Get Meta Ads authentication URL
 * @returns {Promise<string>} Authentication URL
 */
export const getAuthUrl = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(`${API_URL}/integrations/meta/auth`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.auth_url;
  } catch (error) {
    console.error('Error getting auth URL:', error);
    throw error;
  }
};

/**
 * Authenticate with Meta Ads
 * @returns {Promise<boolean>} Success status
 */
export const authenticate = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(`${API_URL}/integrations/meta/auth`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const authUrl = response.data.auth_url;
    
    // For testing, simulate successful authentication without opening a popup
    console.log('Authentication URL:', authUrl);
    console.log('Simulating successful authentication for testing');
    
    // In a production environment, you would use:
    // return new Promise((resolve, reject) => {
    //   const popup = window.open(authUrl, 'Meta Auth', 'width=800,height=600');
    //   
    //   const checkPopup = setInterval(() => {
    //     if (!popup || popup.closed) {
    //       clearInterval(checkPopup);
    //       resolve(true); // Assume success if popup is closed
    //     }
    //   }, 500);
    //   
    //   window.addEventListener('message', (event) => {
    //     if (event.data && event.data.success !== undefined) {
    //       clearInterval(checkPopup);
    //       if (popup) popup.close();
    //       
    //       if (event.data.success) {
    //         resolve(true);
    //       } else {
    //         reject(new Error(event.data.error || 'Authentication failed'));
    //       }
    //     }
    //   });
    // });
    
    // Return success for testing
    return true;
  } catch (error) {
    console.error('Error authenticating:', error);
    throw error;
  }
};

/**
 * Get Meta Ad Accounts
 * @returns {Promise<Array>} Ad Accounts
 */
export const getAccounts = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(`${API_URL}/integrations/meta/accounts`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.accounts;
  } catch (error) {
    console.error('Error getting accounts:', error);
    throw error;
  }
};

/**
 * Get Meta Ads data
 * @param {string} accountId - Account ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} Ads data
 */
export const getData = async (accountId, startDate, endDate) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(`${API_URL}/integrations/meta/data`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        account_id: accountId,
        start_date: startDate,
        end_date: endDate
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting data:', error);
    throw error;
  }
}; 