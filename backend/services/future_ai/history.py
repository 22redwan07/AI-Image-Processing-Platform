from .database import get_db_connection

class HistoryManager:
    @staticmethod
    def add_record(original_filename, operation, output_filename, status, user_id=None):
        conn = get_db_connection()
        conn.execute(
            'INSERT INTO history (original_filename, operation, output_filename, status, user_id) VALUES (?, ?, ?, ?, ?)',
            (original_filename, operation, output_filename, status, user_id)
        )
        conn.commit()
        conn.close()

    @staticmethod
    def get_all_records(limit=100):
        conn = get_db_connection()
        rows = conn.execute('SELECT * FROM history ORDER BY timestamp DESC LIMIT ?', (limit,)).fetchall()
        conn.close()
        return [dict(row) for row in rows]
