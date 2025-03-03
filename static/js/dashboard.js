// Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard loaded');
    
    // Get DOM elements
    const refreshButton = document.getElementById('refresh-data');
    const dateRangeSelect = document.getElementById('date-range');
    const exportPdfButton = document.getElementById('export-pdf');
    
    // Initialize charts
    const dashboardCharts = new DashboardCharts();
    
    // Initialize report exporter
    const reportExporter = new ReportExporter();
    
    // Current dashboard data
    let currentDashboardData = null;
    
    // Add event listeners
    refreshButton.addEventListener('click', refreshData);
    dateRangeSelect.addEventListener('change', changeDateRange);
    exportPdfButton.addEventListener('click', exportPdf);
    
    // Initialize dashboard
    initDashboard();
    
    /**
     * Initialize the dashboard
     */
    function initDashboard() {
        console.log('Initializing dashboard');
        
        // Show loading state
        showLoadingState();
        
        // Fetch dashboard data
        fetchDashboardData(dateRangeSelect.value)
            .then(data => {
                // Store current data
                currentDashboardData = data;
                
                // Initialize and update charts
                dashboardCharts.initCharts();
                dashboardCharts.updateCharts(data);
                
                // Update insights
                updateInsights(data);
            })
            .catch(error => {
                console.error('Error fetching dashboard data:', error);
                showErrorState('Failed to load dashboard data. Please try again.');
            });
    }
    
    /**
     * Refresh dashboard data
     */
    function refreshData() {
        console.log('Refreshing data');
        
        // Show loading state
        showLoadingState();
        
        // Fetch dashboard data
        fetchDashboardData(dateRangeSelect.value)
            .then(data => {
                // Store current data
                currentDashboardData = data;
                
                // Update charts
                dashboardCharts.updateCharts(data);
                
                // Update insights
                updateInsights(data);
                
                // Show success message
                showSuccessMessage('Dashboard data refreshed successfully!');
            })
            .catch(error => {
                console.error('Error refreshing dashboard data:', error);
                showErrorState('Failed to refresh dashboard data. Please try again.');
            });
    }
    
    /**
     * Change the date range for the dashboard
     */
    function changeDateRange() {
        const selectedDays = dateRangeSelect.value;
        console.log(`Date range changed to last ${selectedDays} days`);
        
        // Show loading state
        showLoadingState();
        
        // Fetch dashboard data for the selected date range
        fetchDashboardData(selectedDays)
            .then(data => {
                // Store current data
                currentDashboardData = data;
                
                // Update charts
                dashboardCharts.updateCharts(data);
                
                // Update insights
                updateInsights(data);
            })
            .catch(error => {
                console.error('Error fetching dashboard data:', error);
                showErrorState('Failed to load dashboard data. Please try again.');
            });
    }
    
    /**
     * Export the dashboard as a PDF
     */
    function exportPdf() {
        console.log('Exporting dashboard as PDF');
        
        if (!currentDashboardData) {
            alert('No dashboard data available to export. Please refresh the data first.');
            return;
        }
        
        // Show loading message
        alert('Generating PDF report. This may take a few seconds...');
        
        // Export the dashboard
        reportExporter.exportDashboard(currentDashboardData);
    }
    
    /**
     * Fetch dashboard data from the API
     * @param {number} days - Number of days to fetch data for
     * @returns {Promise<Object>} - Promise that resolves to the dashboard data
     */
    function fetchDashboardData(days) {
        // Use the API endpoint to fetch data
        return fetch(`/api/dashboard-data?days=${days}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error fetching dashboard data from API:', error);
                // Fallback to mock data if API fails
                console.log('Falling back to mock data');
                return generateMockData(days);
            });
    }
    
    /**
     * Generate mock data for testing
     * @param {number} days - Number of days to generate data for
     * @returns {Object} - Mock dashboard data
     */
    function generateMockData(days) {
        const data = {
            traffic: {
                data: [],
                totals: {
                    sessions: 0,
                    users: 0,
                    pageviews: 0,
                    bounce_rate: 0
                }
            },
            conversion: {
                data: [],
                totals: {
                    conversion_rate: 0,
                    revenue: 0
                }
            },
            campaign: {
                data: [],
                totals: {
                    impressions: 0,
                    clicks: 0,
                    ctr: 0,
                    cpc: 0
                }
            },
            period_days: parseInt(days)
        };
        
        // Generate data for each day
        const endDate = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(endDate.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            
            // Traffic data
            const sessions = Math.floor(Math.random() * 1500) + 500;
            const users = Math.floor(sessions * (Math.random() * 0.2 + 0.7)); // 70-90% of sessions
            const pageviews = Math.floor(sessions * (Math.random() * 2 + 1.5)); // 1.5-3.5 pages per session
            const bounceRate = Math.floor(Math.random() * 40) + 20; // 20-60%
            
            data.traffic.data.push({
                date: dateString,
                sessions: sessions,
                users: users,
                pageviews: pageviews,
                bounce_rate: bounceRate
            });
            
            // Update totals
            data.traffic.totals.sessions += sessions;
            data.traffic.totals.users += users;
            data.traffic.totals.pageviews += pageviews;
            data.traffic.totals.bounce_rate += bounceRate;
            
            // Conversion data
            const conversionRate = Math.random() * 8 + 2; // 2-10%
            const revenue = Math.floor(Math.random() * 4000) + 1000; // $1000-5000
            
            data.conversion.data.push({
                date: dateString,
                conversion_rate: conversionRate,
                revenue: revenue
            });
            
            // Update totals
            data.conversion.totals.conversion_rate += conversionRate;
            data.conversion.totals.revenue += revenue;
            
            // Campaign data
            const impressions = Math.floor(Math.random() * 40000) + 10000; // 10000-50000
            const clicks = Math.floor(Math.random() * 1500) + 500; // 500-2000
            const ctr = (clicks / impressions) * 100; // Click-through rate
            const cpc = Math.random() * 1.5 + 0.5; // $0.50-2.00
            
            data.campaign.data.push({
                date: dateString,
                impressions: impressions,
                clicks: clicks,
                ctr: ctr,
                cpc: cpc
            });
            
            // Update totals
            data.campaign.totals.impressions += impressions;
            data.campaign.totals.clicks += clicks;
            data.campaign.totals.cpc += cpc;
        }
        
        // Calculate averages for rate metrics
        data.traffic.totals.bounce_rate = (data.traffic.totals.bounce_rate / days).toFixed(2);
        data.conversion.totals.conversion_rate = (data.conversion.totals.conversion_rate / days).toFixed(2);
        data.campaign.totals.ctr = ((data.campaign.totals.clicks / data.campaign.totals.impressions) * 100).toFixed(2);
        data.campaign.totals.cpc = (data.campaign.totals.cpc / days).toFixed(2);
        
        return data;
    }
    
    /**
     * Show loading state for all chart containers
     */
    function showLoadingState() {
        const chartContainers = document.querySelectorAll('.chart-container');
        chartContainers.forEach(container => {
            const placeholderText = container.querySelector('.placeholder-text');
            if (placeholderText) {
                placeholderText.textContent = 'Loading data...';
            }
        });
        
        const insightsContainer = document.querySelector('.insights-container');
        if (insightsContainer) {
            const placeholderText = insightsContainer.querySelector('.placeholder-text');
            if (placeholderText) {
                placeholderText.textContent = 'Analyzing your marketing data...';
            }
        }
    }
    
    /**
     * Show error state for all chart containers
     * @param {string} message - Error message to display
     */
    function showErrorState(message) {
        const chartContainers = document.querySelectorAll('.chart-container');
        chartContainers.forEach(container => {
            const placeholderText = container.querySelector('.placeholder-text');
            if (placeholderText) {
                placeholderText.textContent = message;
            }
        });
    }
    
    /**
     * Show a success message
     * @param {string} message - Success message to display
     */
    function showSuccessMessage(message) {
        alert(message);
    }
    
    /**
     * Update insights based on the dashboard data
     * @param {Object} data - Dashboard data
     */
    function updateInsights(data) {
        const insightsContainer = document.querySelector('.insights-container');
        if (!insightsContainer) return;
        
        const placeholderText = insightsContainer.querySelector('.placeholder-text');
        if (!placeholderText) return;
        
        // Generate insights based on the data
        const insights = generateInsights(data);
        
        // Display insights
        placeholderText.textContent = insights;
    }
    
    /**
     * Generate insights based on the dashboard data
     * @param {Object} data - Dashboard data
     * @returns {string} - Insights text
     */
    function generateInsights(data) {
        // In a real app, this would use AI to generate insights
        // For now, we'll use some simple rules
        
        const insights = [];
        
        // Traffic insights
        if (data.traffic && data.traffic.totals) {
            const avgSessions = data.traffic.totals.sessions / data.period_days;
            if (avgSessions > 1000) {
                insights.push("Your website traffic is strong, averaging over 1,000 sessions per day.");
            } else {
                insights.push("Consider investing in SEO or paid advertising to increase your website traffic.");
            }
        }
        
        // Conversion insights
        if (data.conversion && data.conversion.totals) {
            const conversionRate = parseFloat(data.conversion.totals.conversion_rate);
            if (conversionRate > 5) {
                insights.push("Your conversion rate is above average at " + conversionRate + "%. Keep up the good work!");
            } else {
                insights.push("Your conversion rate of " + conversionRate + "% could be improved. Consider optimizing your landing pages.");
            }
        }
        
        // Campaign insights
        if (data.campaign && data.campaign.totals) {
            const ctr = parseFloat(data.campaign.totals.ctr);
            if (ctr > 3) {
                insights.push("Your campaign CTR of " + ctr + "% is excellent. Your ad creative is resonating with your audience.");
            } else {
                insights.push("Your campaign CTR of " + ctr + "% is below average. Consider testing new ad creatives.");
            }
        }
        
        // Revenue insights
        if (data.conversion && data.conversion.totals && data.campaign && data.campaign.totals) {
            const revenue = data.conversion.totals.revenue;
            const adSpend = data.campaign.totals.clicks * data.campaign.totals.cpc;
            const roi = ((revenue - adSpend) / adSpend) * 100;
            
            if (roi > 200) {
                insights.push("Your marketing ROI is excellent at " + roi.toFixed(2) + "%. Your campaigns are highly profitable.");
            } else if (roi > 100) {
                insights.push("Your marketing ROI is good at " + roi.toFixed(2) + "%. Your campaigns are profitable.");
            } else if (roi > 0) {
                insights.push("Your marketing ROI is positive at " + roi.toFixed(2) + "%, but there's room for improvement.");
            } else {
                insights.push("Your marketing ROI is negative at " + roi.toFixed(2) + "%. Consider optimizing your campaigns to reduce costs or increase revenue.");
            }
        }
        
        return insights.join(" ");
    }
}); 