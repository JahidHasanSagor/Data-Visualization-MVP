"""
Script to initialize the database with the new SQLAlchemy models.
"""

from flask import Flask
from models import db
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def init_db():
    """Initialize the database with the new SQLAlchemy models"""
    try:
        # Create a Flask app context
        app = Flask(__name__)
        app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///app.db')
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        
        # Initialize the database
        db.init_app(app)
        
        # Create the database tables
        with app.app_context():
            db.create_all()
            print("Database initialized successfully!")
    
    except Exception as e:
        print(f"Error initializing database: {str(e)}")

if __name__ == '__main__':
    init_db() 