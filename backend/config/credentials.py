import os
import json
from cryptography.fernet import Fernet
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get encryption key from environment or generate one
ENCRYPTION_KEY = os.getenv('ENCRYPTION_KEY')
if not ENCRYPTION_KEY:
    ENCRYPTION_KEY = Fernet.generate_key().decode()
    print(f"Generated new encryption key: {ENCRYPTION_KEY}")
    print("Add this to your .env file as ENCRYPTION_KEY")

# Initialize encryption
cipher_suite = Fernet(ENCRYPTION_KEY.encode())

# File to store encrypted credentials
CREDENTIALS_FILE = os.path.join(os.path.dirname(__file__), 'credentials.json')

def encrypt_data(data):
    """Encrypt sensitive data"""
    json_data = json.dumps(data)
    encrypted_data = cipher_suite.encrypt(json_data.encode())
    return encrypted_data

def decrypt_data(encrypted_data):
    """Decrypt sensitive data"""
    decrypted_data = cipher_suite.decrypt(encrypted_data)
    return json.loads(decrypted_data.decode())

def save_credentials(user_id, service, credentials):
    """Save encrypted credentials for a user and service"""
    # Load existing credentials
    all_credentials = {}
    if os.path.exists(CREDENTIALS_FILE):
        with open(CREDENTIALS_FILE, 'rb') as f:
            try:
                encrypted_data = f.read()
                all_credentials = decrypt_data(encrypted_data)
            except Exception as e:
                print(f"Error reading credentials: {e}")
    
    # Initialize user credentials if not exist
    if user_id not in all_credentials:
        all_credentials[user_id] = {}
    
    # Save credentials for the service
    all_credentials[user_id][service] = credentials
    
    # Encrypt and save
    encrypted_data = encrypt_data(all_credentials)
    with open(CREDENTIALS_FILE, 'wb') as f:
        f.write(encrypted_data)
    
    return True

def get_credentials(user_id, service):
    """Get decrypted credentials for a user and service"""
    if not os.path.exists(CREDENTIALS_FILE):
        return None
    
    with open(CREDENTIALS_FILE, 'rb') as f:
        try:
            encrypted_data = f.read()
            all_credentials = decrypt_data(encrypted_data)
            
            if user_id in all_credentials and service in all_credentials[user_id]:
                return all_credentials[user_id][service]
        except Exception as e:
            print(f"Error reading credentials: {e}")
    
    return None

def delete_credentials(user_id, service=None):
    """Delete credentials for a user, optionally for a specific service"""
    if not os.path.exists(CREDENTIALS_FILE):
        return False
    
    with open(CREDENTIALS_FILE, 'rb') as f:
        try:
            encrypted_data = f.read()
            all_credentials = decrypt_data(encrypted_data)
            
            if user_id in all_credentials:
                if service:
                    if service in all_credentials[user_id]:
                        del all_credentials[user_id][service]
                else:
                    del all_credentials[user_id]
                
                # Encrypt and save
                encrypted_data = encrypt_data(all_credentials)
                with open(CREDENTIALS_FILE, 'wb') as f:
                    f.write(encrypted_data)
                
                return True
        except Exception as e:
            print(f"Error deleting credentials: {e}")
    
    return False 