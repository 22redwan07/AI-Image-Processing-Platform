from .upload import upload_bp
from .blur import blur_bp
from .sharpen import sharpen_bp
from .edge_detection import edge_bp
from .health import health_bp
from .placeholders import placeholders_bp
# NEW BLUEPRINTS
from .process_command import process_cmd_bp
from .object_detection import object_detection_bp
from .ocr import ocr_bp
from .remove_background import remove_bg_bp
from .metadata import metadata_bp
from .history import history_bp
from .batch_process import batch_bp
from .auth import auth_bp

def register_blueprints(app):
    app.register_blueprint(upload_bp, url_prefix='/api')
    app.register_blueprint(blur_bp, url_prefix='/api')
    app.register_blueprint(sharpen_bp, url_prefix='/api')
    app.register_blueprint(edge_bp, url_prefix='/api')
    app.register_blueprint(health_bp, url_prefix='/api')
    app.register_blueprint(placeholders_bp, url_prefix='/api')
    # NEW
    app.register_blueprint(process_cmd_bp, url_prefix='/api')
    app.register_blueprint(object_detection_bp, url_prefix='/api')
    app.register_blueprint(ocr_bp, url_prefix='/api')
    app.register_blueprint(remove_bg_bp, url_prefix='/api')
    app.register_blueprint(metadata_bp, url_prefix='/api')
    app.register_blueprint(history_bp, url_prefix='/api')
    app.register_blueprint(batch_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')
