import os
from config import Config
def get_file_extension(filename):
    return os.path.splitext(filename)[1].lower()
def is_allowed_file(filename):
    return '.' in filename and get_file_extension(filename)[1:] in Config.ALLOWED_EXTENSIONS
