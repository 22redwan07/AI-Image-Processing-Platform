import os
from services.image_processing import ImageProcessor
from config import Config

class BatchProcessor:
    @staticmethod
    def process_batch(files, operation):
        results = []
        for file in files:
            try:
                filepath = ImageProcessor.save_uploaded_file(file)
                if operation == 'blur':
                    out = ImageProcessor.blur_image(filepath)
                elif operation == 'sharpen':
                    out = ImageProcessor.sharpen_image(filepath)
                elif operation == 'edges':
                    out = ImageProcessor.edge_detection(filepath)
                else:
                    raise ValueError(f"Unsupported operation: {operation}")
                results.append({
                    'filename': file.filename,
                    'success': True,
                    'output': os.path.basename(out)
                })
            except Exception as e:
                results.append({
                    'filename': file.filename,
                    'success': False,
                    'error': str(e)
                })
        return results
