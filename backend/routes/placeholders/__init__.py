from flask import Blueprint
placeholders_bp = Blueprint('placeholders', __name__)
from .color_adjust import color_adjust_bp
placeholders_bp.register_blueprint(color_adjust_bp)
