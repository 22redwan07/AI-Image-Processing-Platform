import cv2
import easyocr
import numpy as np
from config import Config
from services.image_processing import ImageProcessor

reader = easyocr.Reader(['en'], gpu=False)

class EasyOCR:
    @staticmethod
    def extract_text(image_path):
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError("Could not read image for OCR")
        result = reader.readtext(img)
        text_blocks = []
        for (bbox, text, confidence) in result:
            text_blocks.append({
                'text': text,
                'confidence': round(confidence, 2),
                'bbox': [[int(x), int(y)] for (x, y) in bbox]
            })
        for (bbox, text, confidence) in result:
            top_left = tuple(map(int, bbox[0]))
            bottom_right = tuple(map(int, bbox[2]))
            cv2.rectangle(img, top_left, bottom_right, (0, 255, 0), 2)
            cv2.putText(img, f"{text} ({confidence:.2f})",
                        (top_left[0], top_left[1]-10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,255,0), 2)
        out_path = ImageProcessor._save_output(img, "ocr")
        return text_blocks, out_path
