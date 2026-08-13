import jwt
import bcrypt
import datetime
from .database import get_db_connection
from config import Config

SECRET_KEY = Config.SECRET_KEY

class AuthService:
    @staticmethod
    def hash_password(password):
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    @staticmethod
    def verify_password(password, hashed):
        return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

    @staticmethod
    def register(username, password):
        conn = get_db_connection()
        existing = conn.execute('SELECT id FROM users WHERE username = ?', (username,)).fetchone()
        if existing:
            conn.close()
            return None
        hashed = AuthService.hash_password(password)
        conn.execute('INSERT INTO users (username, password_hash) VALUES (?, ?)', (username, hashed))
        conn.commit()
        conn.close()
        return {'username': username}

    @staticmethod
    def login(username, password):
        conn = get_db_connection()
        user = conn.execute('SELECT id, username, password_hash FROM users WHERE username = ?', (username,)).fetchone()
        conn.close()
        if not user:
            return None
        if AuthService.verify_password(password, user['password_hash']):
            token = jwt.encode({
                'user_id': user['id'],
                'username': user['username'],
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, SECRET_KEY, algorithm='HS256')
            return {'token': token, 'user': dict(user)}
        return None

    @staticmethod
    def verify_token(token):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            return payload
        except:
            return None
