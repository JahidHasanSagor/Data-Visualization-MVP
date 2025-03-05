import os
import json
from datetime import datetime, timedelta
from facebook_business.api import FacebookAdsApi
from facebook_business.adobjects.adaccount import AdAccount
from facebook_business.adobjects.adsinsights import AdsInsights
from facebook_business.exceptions import FacebookRequestError
from config.credentials import save_credentials, get_credentials, delete_credentials

# Meta API configuration
APP_ID = os.getenv("META_APP_ID", "")
APP_SECRET = os.getenv("META_APP_SECRET", "")
REDIRECT_URI = "http://localhost:5000/api/integrations/meta/callback"
SCOPES = ['ads_read', 'ads_management', 'business_management']

def get_auth_url(user_id):
    """Generate Meta OAuth2 authorization URL"""
    try:
        # Generate state for CSRF protection
        import secrets
        state = secrets.token_urlsafe(32)
        
        # Store state for verification
        flow_state = {
            "state": state,
            "created_at": datetime.now().isoformat()
        }
        save_credentials(user_id, "meta_ads_state", flow_state)
        
        # Generate authorization URL
        auth_url = (
            f"https://www.facebook.com/v16.0/dialog/oauth?"
            f"client_id={APP_ID}&"
            f"redirect_uri={REDIRECT_URI}&"
            f"state={state}&"
            f"scope={','.join(SCOPES)}"
        )
        
        return auth_url
    except Exception as e:
        print(f"Error generating auth URL: {e}")
        return None

def handle_callback(user_id, auth_code, state):
    """Handle OAuth2 callback and save credentials"""
    try:
        # Verify state
        stored_state = get_credentials(user_id, "meta_ads_state")
        if not stored_state or stored_state["state"] != state:
            return False, "Invalid state parameter"
        
        # Exchange authorization code for access token
        import requests
        token_url = (
            f"https://graph.facebook.com/v16.0/oauth/access_token?"
            f"client_id={APP_ID}&"
            f"redirect_uri={REDIRECT_URI}&"
            f"client_secret={APP_SECRET}&"
            f"code={auth_code}"
        )
        
        response = requests.get(token_url)
        token_data = response.json()
        
        if 'error' in token_data:
            return False, token_data['error']['message']
        
        # Get long-lived access token
        long_lived_token_url = (
            f"https://graph.facebook.com/v16.0/oauth/access_token?"
            f"grant_type=fb_exchange_token&"
            f"client_id={APP_ID}&"
            f"client_secret={APP_SECRET}&"
            f"fb_exchange_token={token_data['access_token']}"
        )
        
        response = requests.get(long_lived_token_url)
        long_lived_token_data = response.json()
        
        if 'error' in long_lived_token_data:
            return False, long_lived_token_data['error']['message']
        
        # Save credentials
        creds_data = {
            "access_token": long_lived_token_data['access_token'],
            "token_type": long_lived_token_data.get('token_type', 'bearer'),
            "expires_in": long_lived_token_data.get('expires_in', 0),
            "created_at": datetime.now().isoformat()
        }
        save_credentials(user_id, "meta_ads", creds_data)
        
        return True, "Successfully authenticated with Meta Ads"
    except Exception as e:
        print(f"Error handling callback: {e}")
        return False, str(e)

def get_ad_accounts(user_id):
    """Get list of Meta Ad Accounts"""
    try:
        # Get credentials
        creds_data = get_credentials(user_id, "meta_ads")
        if not creds_data:
            return None, "No credentials found"
        
        # Initialize the API
        FacebookAdsApi.init(APP_ID, APP_SECRET, creds_data["access_token"])
        
        # Get user's ad accounts
        from facebook_business.adobjects.user import User
        me = User(fbid='me')
        accounts = me.get_ad_accounts(fields=['name', 'account_id', 'account_status'])
        
        return [account.export_all_data() for account in accounts], None
    except FacebookRequestError as e:
        return None, f"API Error: {e.api_error_message()}"
    except Exception as e:
        return None, f"Error: {str(e)}"

def get_ad_insights(user_id, account_id, start_date=None, end_date=None, fields=None):
    """Get Meta Ads insights for an account"""
    try:
        # Default dates if not provided
        if not start_date:
            start_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
        if not end_date:
            end_date = datetime.now().strftime('%Y-%m-%d')
        
        # Default fields if not provided
        if not fields:
            fields = [
                'campaign_name',
                'impressions',
                'clicks',
                'spend',
                'ctr',
                'cpc',
                'reach',
                'frequency'
            ]
        
        # Get credentials
        creds_data = get_credentials(user_id, "meta_ads")
        if not creds_data:
            return None, "No credentials found"
        
        # Initialize the API
        FacebookAdsApi.init(APP_ID, APP_SECRET, creds_data["access_token"])
        
        # Get insights
        account = AdAccount(f'act_{account_id}')
        insights = account.get_insights(
            params={
                'time_range': {'since': start_date, 'until': end_date},
                'level': 'campaign'
            },
            fields=fields
        )
        
        return [insight.export_all_data() for insight in insights], None
    except FacebookRequestError as e:
        return None, f"API Error: {e.api_error_message()}"
    except Exception as e:
        return None, f"Error: {str(e)}"

def disconnect(user_id):
    """Disconnect Meta Ads for a user"""
    try:
        # Remove credentials
        delete_credentials(user_id, "meta_ads")
        return True, None
    except Exception as e:
        return False, f"Error: {str(e)}" 