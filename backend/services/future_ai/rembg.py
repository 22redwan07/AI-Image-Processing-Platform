import os
import time
from rembg import remove
from PIL import Image
import io
from config import Config

class BackgroundRemover:
    @staticmethod
    def remove_background(image_path):
        with open(image_path, 'rb') as f:
            input_data = f.read()
        output_data = remove(input_data)
        pil_img = Image.open(io.BytesIO(output_data))
        if pil_img.mode != 'RGBA':
            pil_img = pil_img.convert('RGBA')
        out_path = os.path.join(Config.OUTPUT_FOLDER, f"nobg_{int(time.time())}.png")
        pil_img.save(out_path, format='PNG')
        return out_path
