from flask import Blueprint, request, jsonify
from services.image_processing import ImageProcessor
from utils.validators import validate_image_file

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No filename'}), 400
    if not validate_image_file(file):
        return jsonify({'error': 'Invalid file type'}), 400

    filepath = ImageProcessor.save_uploaded_file(file)
    return jsonify({
        'message': 'File uploaded successfully',
        'filename': file.filename,
        'path': filepath
    }), 200
