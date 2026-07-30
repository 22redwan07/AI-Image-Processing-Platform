import cv2
import numpy as np
import os
from werkzeug.utils import secure_filename
from config import Config

class ImageProcessor:
    @staticmethod
    def save_uploaded_file(file):
        filename = secure_filename(file.filename)
        filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
        file.save(filepath)
        return filepath

    @staticmethod
    def read_image(filepath):
        img = cv2.imread(filepath)
        if img is None:
            raise ValueError("Could not read image")
        return img

    @staticmethod
    def blur_image(filepath, kernel_size=(5,5)):
        img = cv2.imread(filepath)
        blurred = cv2.GaussianBlur(img, kernel_size, 0)
        output_path = ImageProcessor._save_output(blurred, "blur")
        return output_path

    @staticmethod
    def sharpen_image(filepath):
        img = cv2.imread(filepath)
        kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
        sharpened = cv2.filter2D(img, -1, kernel)
        output_path = ImageProcessor._save_output(sharpened, "sharpen")
        return output_path

    @staticmethod
    def edge_detection(filepath):
        img = cv2.imread(filepath, cv2.IMREAD_GRAYSCALE)
        edges = cv2.Canny(img, 100, 200)
        output_path = ImageProcessor._save_output(edges, "edges")
        return output_path

    @staticmethod
    def _save_output(image, prefix):
        # Generate unique filename
        import time
        filename = f"{prefix}_{int(time.time())}.png"
        output_path = os.path.join(Config.OUTPUT_FOLDER, filename)
        cv2.imwrite(output_path, image)
        return output_path
