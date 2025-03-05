import json
from datetime import datetime, timedelta
from config.credentials import get_credentials

def get_integration_status(user_id):
    """Get status of all integrations for a user"""
    integrations = {
        "google_analytics": {
            "connected": False,
            "last_sync": None,
            "error": None
        },
        "meta_ads": {
            "connected": False,
            "last_sync": None,
            "error": None
        }
    }
    
    # Check Google Analytics
    ga_creds = get_credentials(user_id, "google_analytics")
    if ga_creds:
        integrations["google_analytics"]["connected"] = True
        
        # Check if token is expired
        if ga_creds.get("expiry"):
            expiry = datetime.fromisoformat(ga_creds["expiry"])
            if expiry < datetime.now():
                integrations["google_analytics"]["error"] = "Token expired"
    
    # Check Meta Ads
    meta_creds = get_credentials(user_id, "meta_ads")
    if meta_creds:
        integrations["meta_ads"]["connected"] = True
        
        # Check if token is expired
        if meta_creds.get("created_at") and meta_creds.get("expires_in"):
            created_at = datetime.fromisoformat(meta_creds["created_at"])
            expires_in = meta_creds["expires_in"]
            expiry = created_at + timedelta(seconds=expires_in)
            
            if expiry < datetime.now():
                integrations["meta_ads"]["error"] = "Token expired"
    
    return integrations

def format_chart_data(data, chart_type="line"):
    """Format data for Chart.js"""
    if not data or not isinstance(data, dict) or "rows" not in data:
        return None
    
    # Extract dimensions and metrics
    dimensions = data.get("dimensions", [])
    metrics = data.get("metrics", [])
    rows = data.get("rows", [])
    
    if not dimensions or not metrics or not rows:
        return None
    
    # Prepare chart data
    chart_data = {
        "labels": [],
        "datasets": []
    }
    
    # Create datasets for each metric
    for metric in metrics:
        dataset = {
            "label": metric,
            "data": [],
            "borderColor": get_color(metrics.index(metric)),
            "backgroundColor": get_color(metrics.index(metric), 0.2),
            "borderWidth": 2,
            "tension": 0.4 if chart_type == "line" else 0
        }
        chart_data["datasets"].append(dataset)
    
    # Fill data
    for row in rows:
        # Add label (first dimension)
        if dimensions[0] in row:
            chart_data["labels"].append(row[dimensions[0]])
        
        # Add data points
        for i, metric in enumerate(metrics):
            if metric in row:
                chart_data["datasets"][i]["data"].append(float(row[metric]))
    
    return chart_data

def get_color(index, alpha=1.0):
    """Get color for chart based on index"""
    colors = [
        f"rgba(75, 192, 192, {alpha})",
        f"rgba(54, 162, 235, {alpha})",
        f"rgba(255, 99, 132, {alpha})",
        f"rgba(255, 159, 64, {alpha})",
        f"rgba(153, 102, 255, {alpha})",
        f"rgba(255, 205, 86, {alpha})",
        f"rgba(201, 203, 207, {alpha})"
    ]
    return colors[index % len(colors)]

def generate_dummy_data(integration_type):
    """Generate dummy data for testing"""
    if integration_type == "google_analytics":
        return {
            "dimensions": ["date"],
            "metrics": ["activeUsers", "screenPageViews", "sessions", "engagementRate"],
            "rows": [
                {"date": "20230101", "activeUsers": "120", "screenPageViews": "450", "sessions": "150", "engagementRate": "0.65"},
                {"date": "20230102", "activeUsers": "135", "screenPageViews": "520", "sessions": "180", "engagementRate": "0.68"},
                {"date": "20230103", "activeUsers": "142", "screenPageViews": "510", "sessions": "175", "engagementRate": "0.72"},
                {"date": "20230104", "activeUsers": "128", "screenPageViews": "480", "sessions": "160", "engagementRate": "0.70"},
                {"date": "20230105", "activeUsers": "145", "screenPageViews": "530", "sessions": "190", "engagementRate": "0.75"},
                {"date": "20230106", "activeUsers": "160", "screenPageViews": "580", "sessions": "210", "engagementRate": "0.78"},
                {"date": "20230107", "activeUsers": "155", "screenPageViews": "560", "sessions": "200", "engagementRate": "0.76"}
            ]
        }
    elif integration_type == "meta_ads":
        return [
            {
                "campaign_name": "Summer Sale",
                "impressions": "12500",
                "clicks": "450",
                "spend": "350.25",
                "ctr": "0.036",
                "cpc": "0.78",
                "reach": "8900",
                "frequency": "1.4"
            },
            {
                "campaign_name": "Product Launch",
                "impressions": "18200",
                "clicks": "620",
                "spend": "520.75",
                "ctr": "0.034",
                "cpc": "0.84",
                "reach": "12400",
                "frequency": "1.5"
            },
            {
                "campaign_name": "Brand Awareness",
                "impressions": "25600",
                "clicks": "380",
                "spend": "420.50",
                "ctr": "0.015",
                "cpc": "1.11",
                "reach": "18900",
                "frequency": "1.35"
            },
            {
                "campaign_name": "Retargeting",
                "impressions": "8900",
                "clicks": "520",
                "spend": "280.30",
                "ctr": "0.058",
                "cpc": "0.54",
                "reach": "4200",
                "frequency": "2.1"
            }
        ]
    else:
        return None 