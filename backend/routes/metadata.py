from flask import Blueprint, request, jsonify
from services.future_ai.metadata_extraction import MetadataExtractor
from services.image_processing import ImageProcessor
from utils.validators import validate_image_file

metadata_bp = Blueprint('metadata', __name__)

@metadata_bp.route('/metadata', methods=['POST'])
def metadata():
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No image'}), 400
    file = request.files['image']
    if not validate_image_file(file):
        return jsonify({'success': False, 'error': 'Invalid file'}), 400

    filepath = ImageProcessor.save_uploaded_file(file)
    try:
        meta = MetadataExtractor.extract_metadata(filepath)
        return jsonify({'success': True, 'metadata': meta})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
