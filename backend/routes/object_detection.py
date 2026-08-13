from flask import Blueprint, request, jsonify
from services.future_ai.yolov8 import YOLOv8Detector
from services.image_processing import ImageProcessor
from services.future_ai.history import HistoryManager
from utils.validators import validate_image_file
import os

object_detection_bp = Blueprint('object_detection', __name__)

@object_detection_bp.route('/object-detection', methods=['POST'])
def object_detection():
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No image'}), 400
    file = request.files['image']
    if not validate_image_file(file):
        return jsonify({'success': False, 'error': 'Invalid file'}), 400

    filepath = ImageProcessor.save_uploaded_file(file)
    try:
        detections, output = YOLOv8Detector.detect_objects(filepath)
        out_filename = os.path.basename(output)
        HistoryManager.add_record(file.filename, 'object_detection', out_filename, 'success')
        return jsonify({
            'success': True,
            'operation': 'object_detection',
            'objects': detections,
            'output': out_filename
        })
    except Exception as e:
        HistoryManager.add_record(file.filename, 'object_detection', '', 'failed')
        return jsonify({'success': False, 'error': str(e)}), 500
