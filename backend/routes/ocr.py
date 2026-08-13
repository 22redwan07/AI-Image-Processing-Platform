from flask import Blueprint, request, jsonify
from services.future_ai.easyocr import EasyOCR
from services.image_processing import ImageProcessor
from services.future_ai.history import HistoryManager
from utils.validators import validate_image_file
import os

ocr_bp = Blueprint('ocr', __name__)

@ocr_bp.route('/ocr', methods=['POST'])
def ocr():
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No image'}), 400
    file = request.files['image']
    if not validate_image_file(file):
        return jsonify({'success': False, 'error': 'Invalid file'}), 400

    filepath = ImageProcessor.save_uploaded_file(file)
    try:
        text_blocks, output = EasyOCR.extract_text(filepath)
        out_filename = os.path.basename(output)
        HistoryManager.add_record(file.filename, 'ocr', out_filename, 'success')
        return jsonify({
            'success': True,
            'operation': 'ocr',
            'text': [t['text'] for t in text_blocks],
            'detections': text_blocks,
            'output': out_filename
        })
    except Exception as e:
        HistoryManager.add_record(file.filename, 'ocr', '', 'failed')
        return jsonify({'success': False, 'error': str(e)}), 500
