/**
 * Charts module for the reporting tool
 * Uses Chart.js to render charts
 */

class DashboardCharts {
    constructor() {
        this.charts = {};
        this.chartColors = {
            primary: '#4a6cf7',
            secondary: '#6c757d',
            success: '#28a745',
            info: '#17a2b8',
            warning: '#ffc107',
            danger: '#dc3545',
            light: '#f8f9fa',
            dark: '#343a40'
        };
    }

    /**
     * Initialize all dashboard charts
     */
    initCharts() {
        this.initTrafficChart();
        this.initConversionChart();
        this.initCampaignChart();
        this.initRevenueChart();
    }

    /**
     * Initialize the traffic chart
     */
    initTrafficChart() {
        const ctx = document.getElementById('traffic-chart');
        if (!ctx) return;

        // Clear placeholder text
        ctx.innerHTML = '';

        this.charts.traffic = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [], // Will be populated with dates
                datasets: [
                    {
                        label: 'Sessions',
                        data: [],
                        borderColor: this.chartColors.primary,
                        backgroundColor: 'rgba(74, 108, 247, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Users',
                        data: [],
                        borderColor: this.chartColors.info,
                        backgroundColor: 'rgba(23, 162, 184, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    /**
     * Initialize the conversion chart
     */
    initConversionChart() {
        const ctx = document.getElementById('conversion-chart');
        if (!ctx) return;

        // Clear placeholder text
        ctx.innerHTML = '';

        this.charts.conversion = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [], // Will be populated with dates
                datasets: [
                    {
                        label: 'Conversion Rate (%)',
                        data: [],
                        borderColor: this.chartColors.success,
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        yAxisID: 'y'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Conversion Rate (%)'
                        }
                    }
                }
            }
        });
    }

    /**
     * Initialize the campaign chart
     */
    initCampaignChart() {
        const ctx = document.getElementById('campaign-chart');
        if (!ctx) return;

        // Clear placeholder text
        ctx.innerHTML = '';

        this.charts.campaign = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [], // Will be populated with dates
                datasets: [
                    {
                        label: 'Clicks',
                        data: [],
                        backgroundColor: this.chartColors.primary,
                        borderWidth: 0
                    },
                    {
                        label: 'CTR (%)',
                        data: [],
                        type: 'line',
                        borderColor: this.chartColors.warning,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Clicks'
                        }
                    },
                    y1: {
                        beginAtZero: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false
                        },
                        title: {
                            display: true,
                            text: 'CTR (%)'
                        }
                    }
                }
            }
        });
    }

    /**
     * Initialize the revenue chart
     */
    initRevenueChart() {
        const ctx = document.getElementById('revenue-chart');
        if (!ctx) return;

        // Clear placeholder text
        ctx.innerHTML = '';

        this.charts.revenue = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [], // Will be populated with dates
                datasets: [
                    {
                        label: 'Revenue ($)',
                        data: [],
                        backgroundColor: this.chartColors.success,
                        borderWidth: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Revenue ($)'
                        }
                    }
                }
            }
        });
    }

    /**
     * Update all charts with new data
     * @param {Object} data - The data to update the charts with
     */
    updateCharts(data) {
        this.updateTrafficChart(data.traffic);
        this.updateConversionChart(data.conversion);
        this.updateCampaignChart(data.campaign);
        this.updateRevenueChart(data.conversion); // Revenue is in conversion data
    }

    /**
     * Update the traffic chart with new data
     * @param {Object} data - The traffic data
     */
    updateTrafficChart(data) {
        if (!this.charts.traffic || !data || !data.data) return;

        const labels = data.data.map(item => item.date);
        const sessions = data.data.map(item => item.sessions);
        const users = data.data.map(item => item.users);

        this.charts.traffic.data.labels = labels;
        this.charts.traffic.data.datasets[0].data = sessions;
        this.charts.traffic.data.datasets[1].data = users;
        this.charts.traffic.update();
    }

    /**
     * Update the conversion chart with new data
     * @param {Object} data - The conversion data
     */
    updateConversionChart(data) {
        if (!this.charts.conversion || !data || !data.data) return;

        const labels = data.data.map(item => item.date);
        const conversionRate = data.data.map(item => item.conversion_rate);

        this.charts.conversion.data.labels = labels;
        this.charts.conversion.data.datasets[0].data = conversionRate;
        this.charts.conversion.update();
    }

    /**
     * Update the campaign chart with new data
     * @param {Object} data - The campaign data
     */
    updateCampaignChart(data) {
        if (!this.charts.campaign || !data || !data.data) return;

        const labels = data.data.map(item => item.date);
        const clicks = data.data.map(item => item.clicks);
        const ctr = data.data.map(item => item.ctr);

        this.charts.campaign.data.labels = labels;
        this.charts.campaign.data.datasets[0].data = clicks;
        this.charts.campaign.data.datasets[1].data = ctr;
        this.charts.campaign.update();
    }

    /**
     * Update the revenue chart with new data
     * @param {Object} data - The revenue data
     */
    updateRevenueChart(data) {
        if (!this.charts.revenue || !data || !data.data) return;

        const labels = data.data.map(item => item.date);
        const revenue = data.data.map(item => item.revenue);

        this.charts.revenue.data.labels = labels;
        this.charts.revenue.data.datasets[0].data = revenue;
        this.charts.revenue.update();
    }
} 