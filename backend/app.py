from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)  # ✅ Correct Placement

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

if __name__ == '__main__':
    app.run(debug=True)
