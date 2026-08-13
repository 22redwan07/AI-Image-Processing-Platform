import os
from PIL import Image
from config import Config

class MetadataExtractor:
    @staticmethod
    def extract_metadata(filepath):
        filename = os.path.basename(filepath)
        stats = os.stat(filepath)
        file_size = stats.st_size
        img = Image.open(filepath)
        width, height = img.size
        format = img.format
        mode = img.mode
        metadata = {
            'filename': filename,
            'format': format,
            'width': width,
            'height': height,
            'file_size_bytes': file_size,
            'color_mode': mode,
            'exif': None,
        }
        exif_data = img._getexif()
        if exif_data:
            metadata['exif'] = exif_data
        return metadata
