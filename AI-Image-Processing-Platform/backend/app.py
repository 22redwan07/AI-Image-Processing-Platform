import os
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from routes import register_blueprints
from utils.error_handlers import register_error_handlers

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for frontend
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Register all blueprints
    register_blueprints(app)

    # Register error handlers
    register_error_handlers(app)

    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
