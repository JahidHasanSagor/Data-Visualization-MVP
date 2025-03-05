from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, 
    create_refresh_token, 
    jwt_required, 
    get_jwt_identity
)
from models import db, User
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create blueprint
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    logger.info("Registration request received")
    
    try:
        data = request.get_json()
        
        if not data:
            logger.warning("No JSON data received")
            return jsonify({'error': 'No data received'}), 400
            
        if not all(k in data for k in ['name', 'email', 'password']):
            logger.warning("Missing required fields")
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            logger.warning(f"Email already exists: {data['email']}")
            return jsonify({'error': 'Email already exists'}), 400
            
        # Create new user
        new_user = User(
            email=data['email'],
            name=data['name'],
            password=data['password']
        )
        
        # Add to database
        db.session.add(new_user)
        db.session.commit()
        
        logger.info(f"User registered successfully: {data['email']}")
        
        return jsonify({
            'message': 'Registration successful',
            'email': data['email']
        }), 201
        
    except Exception as e:
        logger.error(f"Error during registration: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'Registration failed'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login a user"""
    try:
        data = request.get_json()
        logger.info(f"Login attempt for email: {data.get('email')}")
        
        # Find user by email
        user = User.query.filter_by(email=data.get('email')).first()
        
        if not user:
            logger.warning(f"User not found: {data.get('email')}")
            return jsonify({'error': 'User not found'}), 404
        
        # Check password
        if not user.check_password(data.get('password')):
            logger.warning(f"Invalid password for user: {data.get('email')}")
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Create tokens
        access_token = create_access_token(identity=user.email)
        refresh_token = create_refresh_token(identity=user.email)
        
        logger.info(f"User logged in successfully: {user.email}")
        
        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {
                'email': user.email,
                'name': user.name
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error during login: {str(e)}")
        return jsonify({'error': 'Login failed'}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    try:
        current_user = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user)
        
        logger.info(f"Token refreshed for user: {current_user}")
        
        return jsonify({
            'access_token': new_access_token
        }), 200
        
    except Exception as e:
        logger.error(f"Error refreshing token: {str(e)}")
        return jsonify({'error': 'Token refresh failed'}), 500

@auth_bp.route('/register', methods=['OPTIONS'])
def handle_register_preflight():
    """Handle preflight request for register endpoint"""
    response = jsonify({})
    return response, 200 