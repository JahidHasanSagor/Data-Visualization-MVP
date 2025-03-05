# ReportVibe MVP

<div align="center">
  <img src="Report Vibe.jpeg" alt="Dashboard Preview" width="80%" />
  
  <p><em>Interactive data visualization platform with multiple chart types and external integrations</em></p>
  
  <div>
    <img src="https://img.shields.io/badge/React-18.0.0-blue" alt="React" />
    <img src="https://img.shields.io/badge/Flask-2.0.1-green" alt="Flask" />
    <img src="https://img.shields.io/badge/Chart.js-3.7.0-red" alt="Chart.js" />
    <img src="https://img.shields.io/badge/Status-MVP-yellow" alt="Status" />
  </div>
</div>

## Overview

A comprehensive data visualization platform that integrates with external data sources like Google Analytics and Meta Ads.

## Features

- **Dashboard Visualization**: Create and customize dashboards with various chart types
- **Data Import**: Upload CSV files for visualization
- **External Integrations**: Connect to Google Analytics and Meta Ads
- **Authentication**: Secure user authentication system
- **Responsive Design**: Works on desktop and mobile devices

## Integration Features

### Google Analytics Integration

The Google Analytics integration allows you to:
- Connect to your Google Analytics account via OAuth2
- View key metrics like active users, page views, and session duration
- Visualize data with interactive charts
- Compare data across different time periods

### Meta Ads Integration

The Meta Ads integration allows you to:
- Connect to your Meta Ads account via OAuth2
- View campaign performance metrics
- Analyze ad spend, impressions, clicks, and conversions
- Track ROI and campaign effectiveness

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- Flask
- React

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/data-visualization-mvp.git
cd data-visualization-mvp
```

2. Install backend dependencies
```
cd backend
pip install -r requirements.txt
```

3. Install frontend dependencies
```
cd frontend
npm install
```

4. Set up environment variables
Create a `.env` file in the backend directory with the following variables:
```
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret
```

5. Start the backend server
```
cd backend
flask run
```

6. Start the frontend development server
```
cd frontend
npm start
```

## Usage

1. Register for an account or log in
2. Navigate to the Integrations page
3. Connect your Google Analytics and/or Meta Ads accounts
4. View your data on the Dashboard

## License

This project is licensed under the MIT License - see the LICENSE file for details.
