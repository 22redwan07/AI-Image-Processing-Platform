from .file_utils import is_allowed_file
def validate_image_file(file):
    if not file or file.filename=='':
        return False
    return is_allowed_file(file.filename)
