import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from config import Config
from routes import register_blueprints
from utils.error_handlers import register_error_handlers

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    register_blueprints(app)
    register_error_handlers(app)

    @app.route('/outputs/<filename>')
    def serve_output(filename):
        return send_from_directory(app.config['OUTPUT_FOLDER'], filename)

    return app

app = create_app()
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
