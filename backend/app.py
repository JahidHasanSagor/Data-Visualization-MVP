from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
import pandas as pd

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# In a real app, you'd use a database. This is just for demo
users = {}
SECRET_KEY = 'your-secret-key'

# Authentication endpoints
@app.route('/api/auth/register', methods=['POST'])
def register():
    print("Registration request received") # Debug log
    data = request.get_json()
    print("Registration data:", data) # Debug log
    
    if not data:
        print("No JSON data received")
        return jsonify({'error': 'No data received'}), 400
        
    if not all(k in data for k in ['name', 'email', 'password']):
        print("Missing required fields")
        return jsonify({'error': 'Missing required fields'}), 400
    
    if data['email'] in users:
        print(f"Email already exists: {data['email']}")
        return jsonify({'error': 'Email already exists'}), 400
        
    users[data['email']] = {
        'name': data['name'],
        'password': generate_password_hash(data['password']),
    }
    print(f"User registered successfully: {data['email']}")
    
    return jsonify({
        'message': 'Registration successful',
        'email': data['email']
    })

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if data['email'] not in users:
        return jsonify({'error': 'User not found'}), 404
        
    user = users[data['email']]
    if not check_password_hash(user['password'], data['password']):
        return jsonify({'error': 'Invalid password'}), 401
    
    token = jwt.encode({
        'email': data['email'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }, SECRET_KEY, algorithm='HS256')
    
    return jsonify({
        'token': token,
        'user': {
            'name': user['name'],
            'email': data['email']
        }
    })

@app.route('/api/auth/register', methods=['OPTIONS'])
def handle_register_preflight():
    response = jsonify({'message': 'OK'})
    response.headers.add('Access-Control-Allow-Methods', 'POST')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    return response, 200

# File upload endpoint
@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        print("❌ No file in request")
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    
    if file.filename == '':
        print("❌ No file selected")
        return jsonify({'error': 'No file selected'}), 400

    if file and file.filename.endswith('.csv'):
        print(f"✅ Received file: {file.filename}")

        try:
            df = pd.read_csv(file, delimiter=';')
            print(df.head())  # Print first 5 rows in the console to check
            data = df.to_dict(orient='records')
            return jsonify(data), 200

        except Exception as e:
            print(f"❌ Error reading CSV: {str(e)}")
            return jsonify({'error': f'Failed to process file: {str(e)}'}), 500

    print("❌ Invalid file type")
    return jsonify({'error': 'File type not supported'}), 400

@app.route('/api/user/profile', methods=['PUT'])
def update_profile():
    print("Profile update request received")  # Debug log
    data = request.get_json()
    auth_header = request.headers.get('Authorization')
    
    print("Request data:", data)  # Debug log
    print("Auth header:", auth_header)  # Debug log
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'No token provided'}), 401
        
    token = auth_header.split(' ')[1]
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        email = payload['email']
        
        print(f"Updating profile for user: {email}")  # Debug log
        
        if email not in users:
            return jsonify({'error': 'User not found'}), 404
            
        users[email]['name'] = data.get('name', users[email]['name'])
        
        updated_user = {
            'name': users[email]['name'],
            'email': email
        }
        print("Updated user data:", updated_user)  # Debug log
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': updated_user
        })
    except jwt.ExpiredSignatureError:
        print("Token expired")  # Debug log
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        print("Invalid token")  # Debug log
        return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        print(f"Unexpected error: {str(e)}")  # Debug log
        return jsonify({'error': 'An unexpected error occurred'}), 500

@app.route('/api/user/profile', methods=['OPTIONS'])
def handle_profile_preflight():
    response = jsonify({'message': 'OK'})
    response.headers.add('Access-Control-Allow-Methods', 'PUT')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    return response, 200

@app.after_request
def after_request(response):
    print(f"Response status: {response.status_code}")
    print(f"Response headers: {dict(response.headers)}")
    return response

if __name__ == '__main__':
    app.run(debug=True)
