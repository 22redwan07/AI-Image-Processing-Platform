from flask import Blueprint, request, jsonify
from services.image_processing import ImageProcessor
import os

blur_bp = Blueprint('blur', __name__)

@blur_bp.route('/blur', methods=['POST'])
def blur_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No filename'}), 400

    filepath = ImageProcessor.save_uploaded_file(file)
    try:
        output_path = ImageProcessor.blur_image(filepath)
        # Return path or base64 image; for simplicity return filename
        return jsonify({
            'message': 'Image blurred successfully',
            'output': os.path.basename(output_path)
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
