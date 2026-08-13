from flask import Blueprint, request, jsonify
from services.future_ai.rembg import BackgroundRemover
from services.image_processing import ImageProcessor
from services.future_ai.history import HistoryManager
from utils.validators import validate_image_file
import os

remove_bg_bp = Blueprint('remove_background', __name__)

@remove_bg_bp.route('/remove-background', methods=['POST'])
def remove_background():
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No image'}), 400
    file = request.files['image']
    if not validate_image_file(file):
        return jsonify({'success': False, 'error': 'Invalid file'}), 400

    filepath = ImageProcessor.save_uploaded_file(file)
    try:
        output = BackgroundRemover.remove_background(filepath)
        out_filename = os.path.basename(output)
        HistoryManager.add_record(file.filename, 'remove_background', out_filename, 'success')
        return jsonify({
            'success': True,
            'operation': 'remove_background',
            'output': out_filename
        })
    except Exception as e:
        HistoryManager.add_record(file.filename, 'remove_background', '', 'failed')
        return jsonify({'success': False, 'error': str(e)}), 500
