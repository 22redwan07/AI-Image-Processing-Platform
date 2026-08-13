from flask import Blueprint, request, jsonify
from services.future_ai.batch_processing import BatchProcessor
from utils.validators import validate_image_file

batch_bp = Blueprint('batch_process', __name__)

@batch_bp.route('/batch-process', methods=['POST'])
def batch_process():
    if 'images' not in request.files:
        return jsonify({'success': False, 'error': 'No images'}), 400
    files = request.files.getlist('images')
    operation = request.form.get('operation', 'blur')
    results = BatchProcessor.process_batch(files, operation)
    return jsonify({'success': True, 'results': results})
