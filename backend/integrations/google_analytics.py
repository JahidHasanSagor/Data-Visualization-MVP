import os
import json
from datetime import datetime, timedelta
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange, Dimension, Metric, RunReportRequest
)
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from config.credentials import save_credentials, get_credentials, delete_credentials

# Google Analytics API configuration
SCOPES = ['https://www.googleapis.com/auth/analytics.readonly']
CLIENT_CONFIG = {
    "web": {
        "client_id": os.getenv("GOOGLE_CLIENT_ID", ""),
        "client_secret": os.getenv("GOOGLE_CLIENT_SECRET", ""),
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "redirect_uris": ["http://localhost:5000/api/integrations/google/callback"]
    }
}

def get_auth_url(user_id):
    """Generate Google OAuth2 authorization URL"""
    try:
        # Create a flow instance with client config
        flow = Flow.from_client_config(
            client_config=CLIENT_CONFIG,
            scopes=SCOPES,
            redirect_uri=CLIENT_CONFIG["web"]["redirect_uris"][0]
        )
        
        # Generate authorization URL
        auth_url, state = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true',
            prompt='consent'
        )
        
        # Store state for verification
        flow_state = {
            "state": state,
            "created_at": datetime.now().isoformat()
        }
        save_credentials(user_id, "google_analytics_state", flow_state)
        
        return auth_url
    except Exception as e:
        print(f"Error generating auth URL: {e}")
        return None

def handle_callback(user_id, auth_code, state):
    """Handle OAuth2 callback and save credentials"""
    try:
        # Verify state
        stored_state = get_credentials(user_id, "google_analytics_state")
        if not stored_state or stored_state["state"] != state:
            return False, "Invalid state parameter"
        
        # Create a flow instance with client config
        flow = Flow.from_client_config(
            client_config=CLIENT_CONFIG,
            scopes=SCOPES,
            redirect_uri=CLIENT_CONFIG["web"]["redirect_uris"][0],
            state=state
        )
        
        # Exchange authorization code for tokens
        flow.fetch_token(code=auth_code)
        credentials = flow.credentials
        
        # Save credentials
        creds_data = {
            "token": credentials.token,
            "refresh_token": credentials.refresh_token,
            "token_uri": credentials.token_uri,
            "client_id": credentials.client_id,
            "client_secret": credentials.client_secret,
            "scopes": credentials.scopes,
            "expiry": credentials.expiry.isoformat() if credentials.expiry else None
        }
        save_credentials(user_id, "google_analytics", creds_data)
        
        return True, "Successfully authenticated with Google Analytics"
    except Exception as e:
        print(f"Error handling callback: {e}")
        return False, str(e)

def get_analytics_properties(user_id):
    """Get list of Google Analytics properties"""
    try:
        # Get credentials
        creds_data = get_credentials(user_id, "google_analytics")
        if not creds_data:
            return None, "No credentials found"
        
        # Convert expiry string to datetime
        if creds_data["expiry"]:
            creds_data["expiry"] = datetime.fromisoformat(creds_data["expiry"])
        
        # Create credentials object
        credentials = Credentials.from_authorized_user_info(creds_data)
        
        # Build service
        service = build('analyticsadmin', 'v1alpha', credentials=credentials)
        
        # Get properties
        response = service.properties().list().execute()
        properties = response.get('properties', [])
        
        return properties, None
    except HttpError as e:
        error_details = json.loads(e.content.decode())
        return None, f"API Error: {error_details.get('error', {}).get('message', str(e))}"
    except Exception as e:
        return None, f"Error: {str(e)}"

def get_analytics_data(user_id, property_id, start_date=None, end_date=None, metrics=None, dimensions=None):
    """Get Google Analytics data for a property"""
    try:
        # Default dates if not provided
        if not start_date:
            start_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
        if not end_date:
            end_date = datetime.now().strftime('%Y-%m-%d')
        
        # Default metrics and dimensions if not provided
        if not metrics:
            metrics = ['activeUsers', 'screenPageViews', 'sessions', 'engagementRate']
        if not dimensions:
            dimensions = ['date']
        
        # Get credentials
        creds_data = get_credentials(user_id, "google_analytics")
        if not creds_data:
            return None, "No credentials found"
        
        # Convert expiry string to datetime
        if creds_data["expiry"]:
            creds_data["expiry"] = datetime.fromisoformat(creds_data["expiry"])
        
        # Create credentials object
        credentials = Credentials.from_authorized_user_info(creds_data)
        
        # Create a client
        client = BetaAnalyticsDataClient(credentials=credentials)
        
        # Build the request
        request = RunReportRequest(
            property=f"properties/{property_id}",
            date_ranges=[DateRange(start_date=start_date, end_date=end_date)],
            metrics=[Metric(name=m) for m in metrics],
            dimensions=[Dimension(name=d) for d in dimensions]
        )
        
        # Make the request
        response = client.run_report(request)
        
        # Process the response
        result = {
            "dimensions": [dim.name for dim in response.dimension_headers],
            "metrics": [metric.name for metric in response.metric_headers],
            "rows": []
        }
        
        for row in response.rows:
            row_data = {}
            
            # Add dimensions
            for i, dimension in enumerate(row.dimension_values):
                row_data[result["dimensions"][i]] = dimension.value
            
            # Add metrics
            for i, metric in enumerate(row.metric_values):
                row_data[result["metrics"][i]] = metric.value
            
            result["rows"].append(row_data)
        
        return result, None
    except HttpError as e:
        error_details = json.loads(e.content.decode())
        return None, f"API Error: {error_details.get('error', {}).get('message', str(e))}"
    except Exception as e:
        return None, f"Error: {str(e)}"

def disconnect(user_id):
    """Disconnect Google Analytics for a user"""
    try:
        # Remove credentials
        delete_credentials(user_id, "google_analytics")
        return True, None
    except Exception as e:
        return False, f"Error: {str(e)}" 