from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import pandas as pd
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create blueprint
upload_bp = Blueprint('upload', __name__)

@upload_bp.route('', methods=['POST'])
def upload_file():
    """Upload a CSV file and return the parsed data"""
    try:
        logger.info("File upload request received")
        
        # Check if file is in the request
        if 'file' not in request.files:
            logger.warning("No file part in the request")
            return jsonify({'error': 'No file part'}), 400
            
        file = request.files['file']
        
        # Check if file is selected
        if file.filename == '':
            logger.warning("No file selected")
            return jsonify({'error': 'No file selected'}), 400
            
        # Check file extension
        if not file.filename.endswith('.csv'):
            logger.warning(f"Invalid file type: {file.filename}")
            return jsonify({'error': 'Only CSV files are allowed'}), 400
            
        # Save file temporarily
        temp_path = os.path.join('/tmp', file.filename)
        file.save(temp_path)
        
        # Try to read CSV file with different delimiters
        try:
            # First try standard comma delimiter
            df = pd.read_csv(temp_path)
        except:
            try:
                # Try semicolon delimiter
                df = pd.read_csv(temp_path, sep=';')
            except:
                # Try tab delimiter as last resort
                df = pd.read_csv(temp_path, sep='\t')
        
        # Ensure we have at least two columns for charting
        if len(df.columns) < 2:
            logger.warning("CSV file must have at least two columns")
            return jsonify({'error': 'CSV file must have at least two columns'}), 400
        
        # Rename columns to ensure they're chart-friendly
        if len(df.columns) >= 2:
            # Keep original column names
            original_columns = df.columns.tolist()
            
            # For charting purposes, ensure first column is 'label' and second is 'value'
            chart_columns = original_columns.copy()
            chart_columns[0] = 'label'
            chart_columns[1] = 'value'
            
            # Create a mapping from original to chart columns
            column_mapping = {original_columns[i]: chart_columns[i] for i in range(len(original_columns))}
            
            # Rename columns
            df = df.rename(columns=column_mapping)
            
            # Ensure value column is numeric
            df['value'] = pd.to_numeric(df['value'], errors='coerce').fillna(0)
        
        # Convert DataFrame to list of dictionaries
        data = df.to_dict('records')
        
        # Remove temporary file
        os.remove(temp_path)
        
        logger.info(f"File uploaded and processed successfully: {file.filename}")
        
        return jsonify(data), 200
        
    except Exception as e:
        logger.error(f"Error processing file upload: {str(e)}")
        return jsonify({'error': 'Failed to process file'}), 500

@upload_bp.route('', methods=['OPTIONS'])
def handle_upload_preflight():
    """Handle preflight request for upload endpoint"""
    response = jsonify({})
    return response, 200 