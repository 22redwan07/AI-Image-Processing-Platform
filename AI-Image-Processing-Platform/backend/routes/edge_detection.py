from flask import Blueprint, request, jsonify
from services.image_processing import ImageProcessor
import os

edge_bp = Blueprint('edge_detection', __name__)

@edge_bp.route('/edge-detection', methods=['POST'])
def edge_detection():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No filename'}), 400

    filepath = ImageProcessor.save_uploaded_file(file)
    try:
        output_path = ImageProcessor.edge_detection(filepath)
        return jsonify({
            'message': 'Edge detection successful',
            'output': os.path.basename(output_path)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
