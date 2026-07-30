from flask import Blueprint

placeholders_bp = Blueprint('placeholders', __name__)

# Import all placeholder routes to register them
from .enhance import enhance_bp
from .ocr import ocr_bp
from .object_detection import object_detection_bp
from .remove_background import remove_bg_bp
from .rotate import rotate_bp
from .crop import crop_bp
from .flip import flip_bp
from .resize import resize_bp
from .color_adjust import color_adjust_bp
from .noise_removal import noise_removal_bp

# Register sub-blueprints under /api
placeholders_bp.register_blueprint(enhance_bp)
placeholders_bp.register_blueprint(ocr_bp)
placeholders_bp.register_blueprint(object_detection_bp)
placeholders_bp.register_blueprint(remove_bg_bp)
placeholders_bp.register_blueprint(rotate_bp)
placeholders_bp.register_blueprint(crop_bp)
placeholders_bp.register_blueprint(flip_bp)
placeholders_bp.register_blueprint(resize_bp)
placeholders_bp.register_blueprint(color_adjust_bp)
placeholders_bp.register_blueprint(noise_removal_bp)
