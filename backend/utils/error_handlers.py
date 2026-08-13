from flask import jsonify
def register_error_handlers(app):
    @app.errorhandler(404)
    def not_found(e): return jsonify({'error':'Not found'}),404
    @app.errorhandler(500)
    def internal(e): return jsonify({'error':'Internal error'}),500
