from flask import Blueprint, request, jsonify
from services.future_ai.nlp_parser import NLPCommandParser
from services.image_processing import ImageProcessor
from services.future_ai.history import HistoryManager
from utils.validators import validate_image_file
import os

process_cmd_bp = Blueprint('process_command', __name__)

@process_cmd_bp.route('/process-command', methods=['POST'])
def process_command():
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No image'}), 400
    file = request.files['image']
    if not validate_image_file(file):
        return jsonify({'success': False, 'error': 'Invalid file'}), 400
    command = request.form.get('command', '').strip()
    if not command:
        return jsonify({'success': False, 'error': 'No command'}), 400

    parsed = NLPCommandParser.parse(command)
    if not parsed['operation']:
        return jsonify({'success': False, 'error': 'Unknown command'}), 400

    op = parsed['operation']
    params = parsed['params']
    filepath = ImageProcessor.save_uploaded_file(file)

    try:
        if op == 'blur':
            output = ImageProcessor.blur_image(filepath)
        elif op == 'sharpen':
            output = ImageProcessor.sharpen_image(filepath)
        elif op == 'edge_detection':
            output = ImageProcessor.edge_detection(filepath)
        elif op == 'object_detection':
            from services.future_ai.yolov8 import YOLOv8Detector
            detections, output = YOLOv8Detector.detect_objects(filepath)
        elif op == 'ocr':
            from services.future_ai.easyocr import EasyOCR
            text_blocks, output = EasyOCR.extract_text(filepath)
        elif op == 'remove_background':
            from services.future_ai.rembg import BackgroundRemover
            output = BackgroundRemover.remove_background(filepath)
        elif op == 'grayscale':
            import cv2
            img = cv2.imread(filepath)
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            output = ImageProcessor._save_output(gray, 'grayscale')
        elif op == 'rotate':
            import cv2
            img = cv2.imread(filepath)
            angle = params.get('angle', 90)
            (h, w) = img.shape[:2]
            center = (w//2, h//2)
            M = cv2.getRotationMatrix2D(center, angle, 1.0)
            rotated = cv2.warpAffine(img, M, (w, h))
            output = ImageProcessor._save_output(rotated, 'rotate')
        elif op == 'flip':
            import cv2
            img = cv2.imread(filepath)
            flipped = cv2.flip(img, 1)
            output = ImageProcessor._save_output(flipped, 'flip')
        elif op == 'resize':
            import cv2
            img = cv2.imread(filepath)
            if 'scale' in params:
                scale = params['scale']
                new_w = int(img.shape[1] * scale)
                new_h = int(img.shape[0] * scale)
            else:
                new_w = params.get('width', 800)
                new_h = params.get('height', 600)
            resized = cv2.resize(img, (new_w, new_h))
            output = ImageProcessor._save_output(resized, 'resize')
        elif op == 'brightness':
            output = ImageProcessor.adjust_color(filepath, brightness=params.get('brightness', 20))
        elif op == 'contrast':
            output = ImageProcessor.adjust_color(filepath, contrast=params.get('contrast', 1.5))
        elif op == 'metadata':
            from services.future_ai.metadata_extraction import MetadataExtractor
            meta = MetadataExtractor.extract_metadata(filepath)
            return jsonify({'success': True, 'operation': 'metadata', 'metadata': meta})
        elif op == 'enhance':
            # Placeholder: auto-enhance not implemented, return original
            output = filepath
        else:
            return jsonify({'success': False, 'error': f'Operation {op} not implemented'}), 400

        out_filename = os.path.basename(output)
        HistoryManager.add_record(file.filename, op, out_filename, 'success')
        return jsonify({
            'success': True,
            'operation': op,
            'output': out_filename,
            'message': f'{op} completed'
        })
    except Exception as e:
        HistoryManager.add_record(file.filename, op, '', 'failed')
        return jsonify({'success': False, 'error': str(e)}), 500
