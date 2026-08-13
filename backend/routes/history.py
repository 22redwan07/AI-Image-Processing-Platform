from flask import Blueprint, request, jsonify
from services.future_ai.history import HistoryManager

history_bp = Blueprint('history', __name__)

@history_bp.route('/history', methods=['GET'])
def get_history():
    try:
        records = HistoryManager.get_all_records()
        return jsonify({'success': True, 'history': records})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
