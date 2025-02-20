from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if file and file.filename.endswith('.csv'):
        # Read CSV file with pandas
        df = pd.read_csv(file, delimiter=';')
        print(df.head())  # Print first 5 rows in the console to check
        print("okay")  # Print first 5 rows in the console to check

        # Convert DataFrame to JSON
        data = df.to_dict(orient='records')
        return jsonify(data), 200

    return jsonify({'error': 'File type not supported'}), 400

if __name__ == '__main__':
    app.run(debug=True)
    CORS(app)
