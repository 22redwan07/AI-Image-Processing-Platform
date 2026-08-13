from flask import Blueprint, request, jsonify
from services.future_ai.auth import AuthService

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/auth/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'success': False, 'error': 'Missing username/password'}), 400
    result = AuthService.register(username, password)
    if result:
        return jsonify({'success': True, 'user': result})
    else:
        return jsonify({'success': False, 'error': 'Username already exists'}), 400

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'success': False, 'error': 'Missing username/password'}), 400
    result = AuthService.login(username, password)
    if result:
        return jsonify({'success': True, 'token': result['token'], 'user': result['user']})
    else:
        return jsonify({'success': False, 'error': 'Invalid credentials'}), 401
