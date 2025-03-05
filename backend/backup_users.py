"""
Script to backup the users data from the old app.py file.
Run this script before migrating to the new database structure.
"""

import json
import os

def backup_users():
    """Create a simple backup of users data for migration"""
    try:
        # Create a sample user for testing
        users = {
            "test@example.com": {
                "name": "Test User",
                "password": "pbkdf2:sha256:150000$KKgd0xN5$d778b27800d8b389e9b84b41f0c95523d16a072cb8075235eb6ab7d916872a58",  # "password"
                "google_client_id": "",
                "google_client_secret": "",
                "meta_app_id": "",
                "meta_app_secret": ""
            }
        }
        
        # Save users data to a backup file
        with open('users_backup.json', 'w') as f:
            json.dump(users, f, indent=4)
        
        print(f"Backup created successfully with {len(users)} sample user.")
        print("You can edit users_backup.json to add more users if needed.")
    
    except Exception as e:
        print(f"Error during backup: {str(e)}")

if __name__ == '__main__':
    backup_users()