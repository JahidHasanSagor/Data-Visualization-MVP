from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(120), nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # API Integration settings
    google_client_id = db.Column(db.String(256), default='')
    google_client_secret = db.Column(db.String(256), default='')
    meta_app_id = db.Column(db.String(256), default='')
    meta_app_secret = db.Column(db.String(256), default='')
    
    def __init__(self, email, name, password):
        self.email = email
        self.name = name
        self.set_password(password)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def get_integration_settings(self):
        return {
            "googleAnalytics": {
                "clientId": self.google_client_id,
                "clientSecret": self.google_client_secret
            },
            "metaAds": {
                "appId": self.meta_app_id,
                "appSecret": self.meta_app_secret
            }
        }
    
    def update_integration_settings(self, settings):
        if 'googleAnalytics' in settings:
            self.google_client_id = settings['googleAnalytics'].get('clientId', '')
            self.google_client_secret = settings['googleAnalytics'].get('clientSecret', '')
        
        if 'metaAds' in settings:
            self.meta_app_id = settings['metaAds'].get('appId', '')
            self.meta_app_secret = settings['metaAds'].get('appSecret', '') 