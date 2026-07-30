from flask import Blueprint, request, jsonify
from services.image_processing import ImageProcessor
import os

sharpen_bp = Blueprint('sharpen', __name__)

@sharpen_bp.route('/sharpen', methods=['POST'])
def sharpen_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No filename'}), 400

    filepath = ImageProcessor.save_uploaded_file(file)
    try:
        output_path = ImageProcessor.sharpen_image(filepath)
        return jsonify({
            'message': 'Image sharpened successfully',
            'output': os.path.basename(output_path)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
