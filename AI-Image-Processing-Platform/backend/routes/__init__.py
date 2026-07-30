from .upload import upload_bp
from .blur import blur_bp
from .sharpen import sharpen_bp
from .edge_detection import edge_bp
from .health import health_bp
from .placeholders import placeholders_bp

def register_blueprints(app):
    app.register_blueprint(upload_bp, url_prefix='/api')
    app.register_blueprint(blur_bp, url_prefix='/api')
    app.register_blueprint(sharpen_bp, url_prefix='/api')
    app.register_blueprint(edge_bp, url_prefix='/api')
    app.register_blueprint(health_bp, url_prefix='/api')
    app.register_blueprint(placeholders_bp, url_prefix='/api')
