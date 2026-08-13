from flask import Blueprint, request, jsonify
from services.image_processing import ImageProcessor
from utils.validators import validate_image_file
import os

blur_bp = Blueprint('blur', __name__)

@blur_bp.route('/blur', methods=['POST'])
def blur_image():
    if 'image' not in request.files:
        return jsonify({'error':'No image'}),400
    file=request.files['image']
    if not validate_image_file(file):
        return jsonify({'error':'Invalid file'}),400
    path=ImageProcessor.save_uploaded_file(file)
    out=ImageProcessor.blur_image(path)
    return jsonify({'output':os.path.basename(out)}),200
