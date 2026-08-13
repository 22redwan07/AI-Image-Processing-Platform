from flask import Blueprint, request, jsonify
from services.image_processing import ImageProcessor
from utils.validators import validate_image_file
import os

edge_bp = Blueprint('edge_detection', __name__)

@edge_bp.route('/edge-detection', methods=['POST'])
def edge_detection():
    if 'image' not in request.files:
        return jsonify({'error':'No image'}),400
    file=request.files['image']
    if not validate_image_file(file):
        return jsonify({'error':'Invalid file'}),400
    path=ImageProcessor.save_uploaded_file(file)
    out=ImageProcessor.edge_detection(path)
    return jsonify({'output':os.path.basename(out)}),200
