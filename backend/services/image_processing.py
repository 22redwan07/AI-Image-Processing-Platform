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
    def blur_image(filepath):
        img = cv2.imread(filepath)
        if img is None:
            raise ValueError("Could not read image")
        blurred = cv2.GaussianBlur(img, (5,5), 0)
        return ImageProcessor._save_output(blurred, "blur")

    @staticmethod
    def sharpen_image(filepath):
        img = cv2.imread(filepath)
        if img is None:
            raise ValueError("Could not read image")
        kernel = np.array([[0,-1,0],[-1,5,-1],[0,-1,0]])
        sharpened = cv2.filter2D(img, -1, kernel)
        return ImageProcessor._save_output(sharpened, "sharpen")

    @staticmethod
    def edge_detection(filepath):
        img = cv2.imread(filepath, cv2.IMREAD_GRAYSCALE)
        if img is None:
            raise ValueError("Could not read image")
        edges = cv2.Canny(img, 100, 200)
        return ImageProcessor._save_output(edges, "edges")

    @staticmethod
    def adjust_color(filepath, brightness=0, contrast=1.0, saturation=1.0):
        img = cv2.imread(filepath)
        if img is None:
            raise ValueError("Could not read image")
        img = cv2.convertScaleAbs(img, alpha=contrast, beta=brightness)
        if saturation != 1.0:
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV).astype(np.float32)
            hsv[:,:,1] = np.clip(hsv[:,:,1] * saturation, 0, 255)
            img = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2BGR)
        return ImageProcessor._save_output(img, "color_adj")

    @staticmethod
    def _save_output(image, prefix):
        import time
        filename = f"{prefix}_{int(time.time())}.png"
        output_path = os.path.join(Config.OUTPUT_FOLDER, filename)
        cv2.imwrite(output_path, image)
        return output_path
