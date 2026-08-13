import os
import cv2
import numpy as np
from ultralytics import YOLO
from config import Config
from services.image_processing import ImageProcessor

MODEL_PATH = os.path.join(Config.MODELS_FOLDER, 'yolov8n.pt')
if not os.path.exists(MODEL_PATH):
    model = YOLO('yolov8n.pt')
else:
    model = YOLO(MODEL_PATH)

class YOLOv8Detector:
    @staticmethod
    def detect_objects(image_path):
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError("Could not read image for detection")
        results = model(img)
        boxes = results[0].boxes
        if boxes is None:
            return [], img
        detections = []
        for box in boxes:
            xyxy = box.xyxy[0].cpu().numpy().astype(int)
            conf = float(box.conf[0].cpu().numpy())
            cls = int(box.cls[0].cpu().numpy())
            class_name = results[0].names[cls]
            detections.append({
                'class': class_name,
                'confidence': round(conf, 2),
                'bbox': xyxy.tolist()
            })
        annotated = results[0].plot()
        out_path = ImageProcessor._save_output(annotated, "yolo")
        return detections, out_path
