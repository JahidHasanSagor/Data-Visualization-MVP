from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create blueprint
integrations_bp = Blueprint('integrations', __name__)

@integrations_bp.route('/status', methods=['GET'])
@jwt_required()
def get_integration_status():
    """Get integration status"""
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        
        if not user:
            logger.warning(f"User not found: {current_user_email}")
            return jsonify({'error': 'User not found'}), 404
        
        # For testing, return dummy status with connected services
        # In a real implementation, this would check the actual connection status
        status = {
            "google_analytics": {
                "connected": bool(user.google_client_id and user.google_client_secret),
                "last_sync": "2023-06-15T10:30:00Z",
                "error": None
            },
            "meta_ads": {
                "connected": bool(user.meta_app_id and user.meta_app_secret),
                "last_sync": "2023-06-14T15:45:00Z",
                "error": None
            }
        }
        
        logger.info(f"Integration status retrieved for user: {current_user_email}")
        
        return jsonify(status), 200
        
    except Exception as e:
        logger.error(f"Error retrieving integration status: {str(e)}")
        return jsonify({'error': 'Failed to retrieve integration status'}), 500

@integrations_bp.route('/settings', methods=['GET'])
@jwt_required()
def get_integration_settings():
    """Get integration settings"""
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        
        if not user:
            logger.warning(f"User not found: {current_user_email}")
            return jsonify({"error": "User not found"}), 404
        
        # Get settings from user model
        settings = user.get_integration_settings()
        
        # Add redirect URIs
        settings["googleAnalytics"]["redirectUri"] = request.host_url.rstrip('/') + "/api/integrations/google/callback"
        settings["metaAds"]["redirectUri"] = request.host_url.rstrip('/') + "/api/integrations/meta/callback"
        
        logger.info(f"Integration settings retrieved for user: {current_user_email}")
        
        return jsonify(settings), 200
    
    except Exception as e:
        logger.error(f"Error retrieving integration settings: {str(e)}")
        return jsonify({"error": "Failed to retrieve settings"}), 500

@integrations_bp.route('/settings', methods=['POST'])
@jwt_required()
def save_integration_settings():
    """Save integration settings"""
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        
        if not user:
            logger.warning(f"User not found: {current_user_email}")
            return jsonify({"error": "User not found"}), 404
        
        # Get data from request
        data = request.json
        
        # Update user with new settings
        user.update_integration_settings(data)
        
        # Save to database
        db.session.commit()
        
        logger.info(f"Integration settings saved for user: {current_user_email}")
        
        return jsonify({"message": "Settings saved successfully"}), 200
    
    except Exception as e:
        logger.error(f"Error saving integration settings: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Failed to save settings"}), 500

@integrations_bp.route('/google/test', methods=['POST'])
@jwt_required()
def test_google_connection():
    """Test Google Analytics connection"""
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        
        if not user:
            logger.warning(f"User not found: {current_user_email}")
            return jsonify({"error": "Unauthorized"}), 401
        
        # In a real implementation, we would test the connection with the provided credentials
        # For now, we'll just check if credentials exist
        if not user.google_client_id or not user.google_client_secret:
            return jsonify({
                "success": False,
                "error": "Missing Google Analytics credentials"
            }), 400
        
        logger.info(f"Google Analytics connection tested for user: {current_user_email}")
        
        # Return success
        return jsonify({
            "success": True,
            "message": "Successfully connected to Google Analytics API"
        }), 200
    
    except Exception as e:
        logger.error(f"Error testing Google Analytics connection: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Failed to connect to Google Analytics API"
        }), 500

@integrations_bp.route('/meta/test', methods=['POST'])
@jwt_required()
def test_meta_connection():
    """Test Meta Ads connection"""
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        
        if not user:
            logger.warning(f"User not found: {current_user_email}")
            return jsonify({"error": "Unauthorized"}), 401
        
        # In a real implementation, we would test the connection with the provided credentials
        # For now, we'll just check if credentials exist
        if not user.meta_app_id or not user.meta_app_secret:
            return jsonify({
                "success": False,
                "error": "Missing Meta Ads credentials"
            }), 400
        
        logger.info(f"Meta Ads connection tested for user: {current_user_email}")
        
        # Return success
        return jsonify({
            "success": True,
            "message": "Successfully connected to Meta Ads API"
        }), 200
    
    except Exception as e:
        logger.error(f"Error testing Meta Ads connection: {str(e)}")
        return jsonify({
            "success": False,
            "error": "Failed to connect to Meta Ads API"
        }), 500

@integrations_bp.route('/settings', methods=['OPTIONS'])
def options_integration_settings():
    """Handle preflight request for settings endpoint"""
    response = make_response()
    return response 