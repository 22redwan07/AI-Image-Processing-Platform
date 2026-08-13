from flask import Blueprint, request, jsonify
from services.image_processing import ImageProcessor
from utils.validators import validate_image_file
import os

color_adjust_bp = Blueprint('color_adjust', __name__)

@color_adjust_bp.route('/color-adjust', methods=['POST'])
def color_adjust():
    if 'image' not in request.files:
        return jsonify({'error':'No image'}),400
    file=request.files['image']
    if not validate_image_file(file):
        return jsonify({'error':'Invalid file'}),400
    try:
        brightness = int(request.form.get('brightness', 0))
        contrast = float(request.form.get('contrast', 1.0))
        saturation = float(request.form.get('saturation', 1.0))
    except:
        return jsonify({'error':'Invalid params'}),400
    path=ImageProcessor.save_uploaded_file(file)
    out=ImageProcessor.adjust_color(path, brightness, contrast, saturation)
    return jsonify({'output':os.path.basename(out)}),200
