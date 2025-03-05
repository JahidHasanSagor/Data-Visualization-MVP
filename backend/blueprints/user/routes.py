from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create blueprint
user_bp = Blueprint('user', __name__)

@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get user profile"""
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        
        if not user:
            logger.warning(f"User not found: {current_user_email}")
            return jsonify({'error': 'User not found'}), 404
        
        logger.info(f"Profile retrieved for user: {current_user_email}")
        
        return jsonify(user.to_dict()), 200
        
    except Exception as e:
        logger.error(f"Error retrieving profile: {str(e)}")
        return jsonify({'error': 'Failed to retrieve profile'}), 500

@user_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile"""
    try:
        current_user_email = get_jwt_identity()
        user = User.query.filter_by(email=current_user_email).first()
        
        if not user:
            logger.warning(f"User not found: {current_user_email}")
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        if 'name' in data:
            user.name = data['name']
        
        if 'password' in data:
            user.set_password(data['password'])
        
        db.session.commit()
        
        logger.info(f"Profile updated for user: {current_user_email}")
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        logger.error(f"Error updating profile: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Failed to update profile'}), 500

@user_bp.route('/profile', methods=['OPTIONS'])
def handle_profile_preflight():
    """Handle preflight request for profile endpoint"""
    response = jsonify({})
    return response, 200 