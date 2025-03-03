/**
 * Export module for the reporting tool
 * Uses html2pdf.js to generate PDF reports
 */

class ReportExporter {
    constructor() {
        this.exportOptions = {
            margin: 10,
            filename: 'marketing-report.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
    }

    /**
     * Export the dashboard as a PDF
     * @param {Object} dashboardData - The dashboard data
     */
    exportDashboard(dashboardData) {
        // Create a new element to render the report
        const reportElement = document.createElement('div');
        reportElement.className = 'report-container';
        reportElement.style.width = '210mm'; // A4 width
        reportElement.style.padding = '20mm';
        reportElement.style.backgroundColor = '#ffffff';
        reportElement.style.fontFamily = 'Arial, sans-serif';
        
        // Add report content
        reportElement.innerHTML = this.generateReportHTML(dashboardData);
        
        // Temporarily add to document (hidden)
        reportElement.style.position = 'absolute';
        reportElement.style.left = '-9999px';
        document.body.appendChild(reportElement);
        
        // Generate PDF
        html2pdf()
            .set(this.exportOptions)
            .from(reportElement)
            .save()
            .then(() => {
                // Remove the temporary element
                document.body.removeChild(reportElement);
            });
    }

    /**
     * Generate the HTML content for the report
     * @param {Object} data - The dashboard data
     * @returns {string} - HTML content for the report
     */
    generateReportHTML(data) {
        const dateRange = `Last ${data.period_days} days`;
        const today = new Date().toLocaleDateString();
        
        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - data.period_days);
        const dateRangeFormatted = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
        
        // Generate HTML
        return `
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #4a6cf7; margin-bottom: 5px;">Marketing Performance Report</h1>
                <p style="color: #6c757d; margin-top: 0;">Generated on ${today}</p>
                <p style="color: #6c757d;">Date Range: ${dateRangeFormatted} (${dateRange})</p>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h2 style="color: #343a40; border-bottom: 1px solid #e9ecef; padding-bottom: 10px;">Key Metrics Summary</h2>
                <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                    ${this.generateMetricSummaryHTML(data)}
                </div>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h2 style="color: #343a40; border-bottom: 1px solid #e9ecef; padding-bottom: 10px;">Traffic Analysis</h2>
                <p>Total Sessions: <strong>${data.traffic.totals.sessions.toLocaleString()}</strong></p>
                <p>Total Users: <strong>${data.traffic.totals.users.toLocaleString()}</strong></p>
                <p>Total Pageviews: <strong>${data.traffic.totals.pageviews.toLocaleString()}</strong></p>
                <p>Average Bounce Rate: <strong>${data.traffic.totals.bounce_rate}%</strong></p>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h2 style="color: #343a40; border-bottom: 1px solid #e9ecef; padding-bottom: 10px;">Conversion Analysis</h2>
                <p>Average Conversion Rate: <strong>${data.conversion.totals.conversion_rate}%</strong></p>
                <p>Total Revenue: <strong>$${data.conversion.totals.revenue.toLocaleString()}</strong></p>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h2 style="color: #343a40; border-bottom: 1px solid #e9ecef; padding-bottom: 10px;">Campaign Performance</h2>
                <p>Total Impressions: <strong>${data.campaign.totals.impressions.toLocaleString()}</strong></p>
                <p>Total Clicks: <strong>${data.campaign.totals.clicks.toLocaleString()}</strong></p>
                <p>Average CTR: <strong>${data.campaign.totals.ctr}%</strong></p>
                <p>Average CPC: <strong>$${data.campaign.totals.cpc}</strong></p>
            </div>
            
            <div style="margin-bottom: 30px;">
                <h2 style="color: #343a40; border-bottom: 1px solid #e9ecef; padding-bottom: 10px;">Insights & Recommendations</h2>
                <p>${this.generateInsights(data)}</p>
            </div>
            
            <div style="text-align: center; margin-top: 50px; color: #6c757d; font-size: 12px;">
                <p>This report was generated by Marketing Reporting Tool</p>
                <p>&copy; 2025 Marketing Reporting Tool. All rights reserved.</p>
            </div>
        `;
    }

    /**
     * Generate HTML for the metric summary section
     * @param {Object} data - The dashboard data
     * @returns {string} - HTML content for the metric summary
     */
    generateMetricSummaryHTML(data) {
        // Calculate ROI
        const revenue = data.conversion.totals.revenue;
        const adSpend = data.campaign.totals.clicks * data.campaign.totals.cpc;
        const roi = ((revenue - adSpend) / adSpend) * 100;
        
        // Generate metric boxes
        return `
            <div style="width: 48%; margin-bottom: 15px; background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
                <h3 style="margin-top: 0; color: #4a6cf7;">Traffic</h3>
                <p style="font-size: 24px; font-weight: bold; margin: 5px 0;">${data.traffic.totals.sessions.toLocaleString()}</p>
                <p style="color: #6c757d; margin: 0;">Total Sessions</p>
            </div>
            
            <div style="width: 48%; margin-bottom: 15px; background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
                <h3 style="margin-top: 0; color: #28a745;">Conversion Rate</h3>
                <p style="font-size: 24px; font-weight: bold; margin: 5px 0;">${data.conversion.totals.conversion_rate}%</p>
                <p style="color: #6c757d; margin: 0;">Average</p>
            </div>
            
            <div style="width: 48%; margin-bottom: 15px; background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
                <h3 style="margin-top: 0; color: #17a2b8;">Revenue</h3>
                <p style="font-size: 24px; font-weight: bold; margin: 5px 0;">$${data.conversion.totals.revenue.toLocaleString()}</p>
                <p style="color: #6c757d; margin: 0;">Total</p>
            </div>
            
            <div style="width: 48%; margin-bottom: 15px; background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
                <h3 style="margin-top: 0; color: #ffc107;">ROI</h3>
                <p style="font-size: 24px; font-weight: bold; margin: 5px 0;">${roi.toFixed(2)}%</p>
                <p style="color: #6c757d; margin: 0;">Return on Investment</p>
            </div>
        `;
    }

    /**
     * Generate insights based on the dashboard data
     * @param {Object} data - Dashboard data
     * @returns {string} - Insights text
     */
    generateInsights(data) {
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
} 