from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
from dotenv import load_dotenv

# Import database
from models import db

# Load environment variables
load_dotenv()

# Import blueprints
from blueprints.auth import auth_bp
from blueprints.integrations import integrations_bp
from blueprints.user import user_bp
from blueprints.upload import upload_bp

# Create Flask app
app = Flask(__name__)

# Configure app
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 86400  # 1 day in seconds

# Configure database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Initialize extensions
jwt = JWTManager(app)

# Configure CORS
CORS(app, resources={
    r"/api/*": {
        "origins": [os.getenv('FRONTEND_URL', 'http://localhost:3000')],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
        "expose_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(integrations_bp, url_prefix='/api/integrations')
app.register_blueprint(user_bp, url_prefix='/api/user')
app.register_blueprint(upload_bp, url_prefix='/api/upload')

# Simple test route
@app.route('/api/test', methods=['GET'])
def test_api():
    return {'message': 'API is working!'}, 200

# Create database tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True) 